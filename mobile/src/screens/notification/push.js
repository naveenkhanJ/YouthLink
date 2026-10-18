/**
 * Push notifications on the phone — the ONE file that touches expo-notifications.
 *
 * Added 2026-10-18 (full build on integration/viva-demo).
 * Requirements:
 *   - FR-NOTIF-01/02 (and every other notification): the server sends each history row as a push
 *     through Firebase Cloud Messaging (backend notification.sender.js). This file gets the phone's
 *     FCM registration token and gives it to the server, and takes it back on sign-out.
 *   - FR-NOTIF-09 (amendment A10): permission is asked once, after the first successful
 *     registration, with one line of context on the screen behind the dialog (3.9). Denial is a
 *     working state: nothing is blocked, the history still has everything, and a permanently-denied
 *     state shows a settings hint on the history (3.10pd) and preferences (3.11pd), never a prompt.
 *   - FR-NOTIF-10: urgent gig alerts arrive on their own Android channel ("urgent_gigs", high
 *     importance) and everything else on the regular one ("updates"). The server names the channel
 *     on each message; the channels themselves have to exist on the phone, created here.
 *
 * Why expo-notifications and not @react-native-firebase/messaging (decisions.md, 2026-10-18): one
 * Expo package covers all four needs — the FCM token, the Android 13 permission, the channels and
 * tap handling — where Firebase messaging would still need a second library for channels.
 *
 * CONTRACT — nothing here throws; every function resolves.
 */
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { registerDeviceToken, unregisterDeviceToken } from "../../api/notification.api";

export const CHANNEL_URGENT = "urgent_gigs";
export const CHANNEL_REGULAR = "updates";

// Set once the permission has been asked on this install, so it is asked once (A10) and never again.
const ASKED_KEY = "youthlink.pushPermissionAsked";

// The token this phone last gave the server, so sign-out can take back exactly that one.
let registeredToken = null;

// Whether the OS dialog is up right now, so the screen behind it can show its one line of context
// (3.9's contextLine). Screens subscribe through PushContextLine.js.
let asking = false;
const askingListeners = new Set();
function setAsking(value) {
  asking = value;
  askingListeners.forEach((listener) => listener(value));
}
export function isAskingForPush() {
  return asking;
}
/** @returns {() => void} unsubscribe */
export function subscribeAskingForPush(listener) {
  askingListeners.add(listener);
  return () => askingListeners.delete(listener);
}

// How long the context line is on screen before the OS dialog covers it — the same lead Browse
// gives its location context line (CONTEXT_LINE_LEAD_MS), so it can be read first.
export const PUSH_CONTEXT_LEAD_MS = 1200;

/**
 * App start-up: how a push shown while the app is open looks, and the two channels. Safe to call
 * more than once.
 */
export async function configurePush() {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === "android") {
      // Names are what Android's own notification settings list for YouthLink (3.13: "Regular
      // channel" and "Urgent — dedicated channel, time-sensitive").
      await Notifications.setNotificationChannelAsync(CHANNEL_URGENT, {
        name: "Urgent gigs",
        description: "Urgent gigs near you that start within 48 hours.",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 150, 250],
        lightColor: "#d92d20",
      });
      await Notifications.setNotificationChannelAsync(CHANNEL_REGULAR, {
        name: "Regular",
        description: "New gigs, applications, engagements, ratings and everything else.",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  } catch (error) {
    console.warn("Push set-up failed:", error?.message ?? error);
  }
}

/**
 * @returns {Promise<{ status: "granted"|"denied"|"undetermined", canAskAgain: boolean }>}
 */
export async function getPushPermission() {
  try {
    const response = await Notifications.getPermissionsAsync();
    const status = response.granted ? "granted" : response.status === "undetermined" ? "undetermined" : "denied";
    return { status, canAskAgain: Boolean(response.canAskAgain) };
  } catch {
    return { status: "denied", canAskAgain: false };
  }
}

/** Whether this install still has its one ask to make (FR-NOTIF-09, A10). */
export async function shouldAskForPush() {
  try {
    if ((await SecureStore.getItemAsync(ASKED_KEY)) === "yes") return false;
  } catch {
    // An unreadable flag only means we might ask; asking is harmless when the OS has decided.
  }
  const { status, canAskAgain } = await getPushPermission();
  return status !== "granted" && canAskAgain;
}

/** Gets this phone's FCM token and gives it to the server. Resolves false if it could not. */
export async function registerForPush() {
  try {
    const { status } = await getPushPermission();
    if (status !== "granted") return false;
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    if (!token) return false;
    await registerDeviceToken(token);
    registeredToken = token;
    return true;
  } catch (error) {
    console.warn("Could not register for push:", error?.message ?? error);
    return false;
  }
}

/**
 * The one ask (3.9). Shows the OS dialog, remembers that it was asked whatever the answer, and
 * registers the phone when allowed. Either answer moves on — denial is a working state.
 * @returns {Promise<boolean>} true when push is now allowed
 */
export async function askForPushOnce() {
  try {
    await SecureStore.setItemAsync(ASKED_KEY, "yes");
  } catch {
    // Not remembering only risks one repeat ask on a later launch.
  }
  setAsking(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, PUSH_CONTEXT_LEAD_MS));
    const response = await Notifications.requestPermissionsAsync();
    if (response.granted) {
      await registerForPush();
      return true;
    }
  } catch (error) {
    console.warn("Push permission request failed:", error?.message ?? error);
  } finally {
    setAsking(false);
  }
  return false;
}

/** Sign-out: this phone stops getting the account's pushes. Called while still signed in. */
export async function unregisterForPush() {
  const token = registeredToken;
  registeredToken = null;
  if (!token) return;
  try {
    await unregisterDeviceToken(token);
  } catch {
    // Signed out anyway; the server drops tokens Firebase reports dead, and the next sign-in on
    // this phone moves the token to that account.
  }
}

/**
 * Follows token refreshes (Firebase rotates them occasionally) for as long as someone is signed in.
 * @returns {() => void} unsubscribe
 */
export function followTokenChanges() {
  try {
    const subscription = Notifications.addPushTokenListener(({ data }) => {
      if (!data) return;
      registerDeviceToken(data)
        .then(() => {
          registeredToken = data;
        })
        .catch(() => {});
    });
    return () => subscription.remove();
  } catch {
    return () => {};
  }
}

/**
 * The history row a push stands for, rebuilt from the message's data (the server sends the row's
 * id, type and payload), so a tap can open the same place the row does.
 */
function rowFromResponse(response) {
  const data = response?.notification?.request?.content?.data ?? {};
  if (!data.type) return null;
  let payload = data.payload;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = {};
    }
  }
  return { id: data.notificationId, type: data.type, payload: payload ?? {} };
}

/**
 * Calls `onOpen(row)` when the person taps a push — including the tap that launched the app.
 * @returns {() => void} unsubscribe
 */
export function followPushTaps(onOpen) {
  let subscription;
  try {
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        const row = rowFromResponse(response);
        if (row) {
          onOpen(row);
          Notifications.clearLastNotificationResponseAsync?.().catch?.(() => {});
        }
      })
      .catch(() => {});
    subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const row = rowFromResponse(response);
      if (row) onOpen(row);
    });
  } catch {
    // No push support on this build: taps simply never arrive.
  }
  return () => subscription?.remove();
}
