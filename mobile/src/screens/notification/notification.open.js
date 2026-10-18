/**
 * Opening the place a notification points to — shared by a tap on a history row (3.10) and a tap on
 * a push (FR-NOTIF-08: the push and its row are the same notification, so they open the same place).
 *
 * `view` is presentRow()'s result (notification.format.js). Only screens this build registers are
 * opened; a row whose target isn't built (or has none, like WARNING_RECORDED) does nothing.
 */
import { isRouteRegistered } from "../../components/ShellTabBar";

// The listing detail (3.12) belongs to the Applying module.
export const LISTING_DETAIL_SCREEN = "ApplicationListingDetail";

/**
 * @param {object} navigation - a navigation object, or the root navigation ref
 * @param {{ opens: object|string|null }} view
 * @returns {boolean} true when something was opened
 */
export function openNotificationTarget(navigation, view) {
  const opens = view?.opens;
  if (!opens || opens === "expand") return false;
  if (opens.gigPostingId && isRouteRegistered(navigation, LISTING_DETAIL_SCREEN)) {
    // The listing as it stands now, not as it was when the notification was sent.
    navigation.navigate(LISTING_DETAIL_SCREEN, { gigPostingId: opens.gigPostingId });
    return true;
  }
  // A11's other targets (the pool, the engagement, the case, the ratings…): the screen as it stands
  // now, opened only when this build has it.
  if (opens.screen && isRouteRegistered(navigation, opens.screen)) {
    navigation.navigate(opens.screen, opens.params);
    return true;
  }
  return false;
}
