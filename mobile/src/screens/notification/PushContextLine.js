/**
 * 3.9's `contextLine` — the one line of context on the screen behind the notification-permission
 * dialog (FR-NOTIF-09, amendment A10), shown only while that dialog is up.
 *
 * The job-seeker's line is drawn on 3.9 (over Browse). The employer's and the verifier's are not
 * drawn; they say the same thing in each role's own terms, from what that role is told about
 * (3.10ez / 3.10vz's first-run lines) — decisions.md, 2026-10-18.
 */
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { colors, typography } from "../../theme/tokens";
import { isAskingForPush, subscribeAskingForPush } from "./push";

export const PUSH_CONTEXT_LINES = {
  worker: "Turn on notifications to hear about urgent gigs near you, and about anything that needs your answer.",
  employer: "Turn on notifications to hear when someone applies, and about anything that needs your answer.",
  verifier: "Turn on notifications to hear when someone you vouched for gets their first rating.",
};

/** @param {{ role: "worker"|"employer"|"verifier" }} props */
export default function PushContextLine({ role }) {
  const [asking, setAsking] = useState(isAskingForPush());
  // Re-read on subscribing: the ask may have started between this render and the effect.
  useEffect(() => {
    setAsking(isAskingForPush());
    return subscribeAskingForPush(setAsking);
  }, []);
  if (!asking || !PUSH_CONTEXT_LINES[role]) return null;
  return <Text style={styles.line}>{PUSH_CONTEXT_LINES[role]}</Text>;
}

const styles = StyleSheet.create({
  // contextLine: mobile/caption, color/text/secondary.
  line: { ...typography.caption, color: colors.text.secondary },
});
