/**
 * The app's single navigator.
 *
 * ============================================================================
 * YOU SHOULD NOT NEED TO EDIT THIS FILE.
 *
 * To add a screen, add it to your own module's manifest:
 *   src/screens/<module>/<module>.screens.js
 *
 * Every manifest is collected here automatically, which is the point — four
 * people can add screens in parallel without ever editing the same file.
 * ============================================================================
 */
import { useEffect } from "react";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import { useAuth } from "../auth/AuthContext";
import { readLaunchState } from "../auth/launchState";
import { toLocalDigits } from "../screens/account/phoneFormat";
import { TAB_HUB_ROUTES } from "../components/ShellTabBar";
import PushBridge from "../screens/notification/PushBridge";

import accountScreens from "../screens/account/account.screens";
import postingScreens from "../screens/posting/posting.screens";
import discoveryScreens from "../screens/discovery/discovery.screens";
import applicationScreens from "../screens/application/application.screens";
import notificationScreens from "../screens/notification/notification.screens";
import engagementScreens from "../screens/engagement/engagement.screens";
import ratingScreens from "../screens/rating/rating.screens";
import profileScreens from "../screens/profile/profile.screens";
import endorsementScreens from "../screens/endorsement/endorsement.screens";
import helpScreens from "../screens/help/help.screens";
import disputeScreens from "../screens/dispute/dispute.screens";

const Stack = createNativeStackNavigator();

/** Every module's screens, flattened into one list. */
const moduleScreens = [
  ...accountScreens,
  ...postingScreens,
  ...discoveryScreens,
  ...applicationScreens,
  ...notificationScreens,
  ...engagementScreens,
  ...ratingScreens,
  ...profileScreens,
  ...endorsementScreens,
  ...helpScreens,
  ...disputeScreens,
];

// Fails loudly at startup rather than showing a blank screen later, which is
// the confusing symptom of two modules choosing the same screen name.
const names = moduleScreens.map((s) => s.name);
const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
if (duplicates.length > 0) {
  throw new Error(
    `Duplicate screen name(s): ${[...new Set(duplicates)].join(", ")}. ` +
      `Prefix screen names with your module, e.g. "AccountRegister".`,
  );
}

const navigationRef = createNavigationContainerRef();

/**
 * When the app ends a session on its own (a suspension, a password change elsewhere, a deleted
 * account: the server answers SESSION_ENDED), whatever screen the person was on is no longer
 * usable. Send them to the login screen, which explains why (prototype 1.6s). A person who chose
 * to sign out is moved by the Settings screen itself, so this only reacts to a recorded reason.
 */
function SessionEndRedirect() {
  const { status, sessionEndReason } = useAuth();
  useEffect(() => {
    if (status !== "signedOut" || !sessionEndReason || !navigationRef.isReady()) return;
    const current = navigationRef.getCurrentRoute()?.name;
    if (current === "AccountLogin") return;
    // Log in comes with the number of the account that was just signed out, as after a Sign out.
    readLaunchState().then(({ lastPhone }) => {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "AccountLogin", params: lastPhone ? { phone: toLocalDigits(lastPhone) } : undefined }],
      });
    });
  }, [status, sessionEndReason]);
  return null;
}

export default function RootNavigator() {
  return (
    // Android draws edge to edge here, so the window does not shrink for the keyboard
    // (adjustResize has no effect). Padding the whole navigator lifts every screen's pinned
    // action bar above the keyboard. This is react-native-keyboard-controller's version, which
    // grows the padding frame by frame with the keyboard; React Native's own padded in one step,
    // so a pinned bar jumped up while the keyboard was still sliding in.
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
    <NavigationContainer ref={navigationRef}>
      <SessionEndRedirect />
      {/* Push notifications: registration, the permission ask and taps (FR-NOTIF-01/02/09/10). */}
      <PushBridge navigationRef={navigationRef} />
      {/* Moving deeper (a list to its detail, a form step) slides in from the right and back out,
          Android's standard forward motion. The library's default on Android 13+ is a slow (450 ms)
          fade with a small sideways shift, which looked unfinished. */}
      <Stack.Navigator initialRouteName="Home" screenOptions={{ animation: "slide_from_right" }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false, animation: "none" }}
        />
        {moduleScreens.map(({ name, component, options }) => (
          <Stack.Screen
            key={name}
            name={name}
            component={component}
            // The tab bar is drawn inside each tab screen, so any push animation would move the bar
            // too. Tab screens therefore swap with no animation: the bar stays put and only the
            // content changes. (A cross-fade is not an option: the window behind is brand blue and
            // would show through mid-fade.) Which routes are tabs: TAB_HUB_ROUTES.
            options={TAB_HUB_ROUTES.has(name) ? { ...options, animation: "none" } : options}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
    </KeyboardAvoidingView>
  );
}
