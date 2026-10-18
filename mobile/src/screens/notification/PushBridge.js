/**
 * Connects push notifications to the signed-in session and to navigation. Rendered once, inside
 * the NavigationContainer (RootNavigator.js). Draws nothing.
 *
 *   - at start: the two Android channels (FR-NOTIF-10) and how a push looks while the app is open;
 *   - when someone is signed in: register this phone if push is already allowed (a token may have
 *     belonged to another account on this phone), and follow token refreshes;
 *   - the one ask (FR-NOTIF-09, A10) for an employer or verifier, on their first screen after
 *     signing in; a job-seeker is asked by Browse, before its location ask, so the two dialogs come
 *     one after the other (3.9 → 3.3);
 *   - a tap on a push opens what its history row opens (notification.open.js).
 */
import { useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  askForPushOnce,
  configurePush,
  followPushTaps,
  followTokenChanges,
  registerForPush,
  shouldAskForPush,
} from "./push";
import { presentRow } from "./notification.format";
import { openNotificationTarget } from "./notification.open";

// How long to wait after sign-in before the employer's or verifier's ask, so it opens over their
// landing screen rather than over the login transition.
const ASK_AFTER_SIGN_IN_MS = 800;

/**
 * A tap that launched the app arrives before the navigator is ready (and before the splash has
 * gone), so wait for it — up to about ten seconds — rather than dropping the tap.
 */
function whenReady(navigationRef, run, triesLeft = 40) {
  if (navigationRef.isReady()) {
    run();
    return;
  }
  if (triesLeft > 0) setTimeout(() => whenReady(navigationRef, run, triesLeft - 1), 250);
}

export default function PushBridge({ navigationRef }) {
  const { status, user } = useAuth();

  useEffect(() => {
    configurePush();
  }, []);

  useEffect(() => {
    if (status !== "signedIn") return undefined;
    registerForPush();
    const stopFollowing = followTokenChanges();
    let timer;
    if (user?.role && user.role !== "YOUTH_JOB_SEEKER") {
      timer = setTimeout(() => {
        shouldAskForPush().then((ask) => (ask ? askForPushOnce() : null));
      }, ASK_AFTER_SIGN_IN_MS);
    }
    return () => {
      clearTimeout(timer);
      stopFollowing();
    };
  }, [status, user?.id, user?.role]);

  useEffect(
    () =>
      followPushTaps((row) => whenReady(navigationRef, () => {
        const view = presentRow(row);
        // The digest has no single target: it expands in the history, so open the history.
        if (view?.opens === "expand") {
          navigationRef.navigate("NotificationHistory");
          return;
        }
        if (!openNotificationTarget(navigationRef, view)) navigationRef.navigate("NotificationHistory");
      })),
    [navigationRef],
  );

  return null;
}
