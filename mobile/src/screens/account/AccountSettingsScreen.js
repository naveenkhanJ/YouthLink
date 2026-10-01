/**
 * Unified Settings (prototype 1.10 / 1.10e / 1.10ed / 1.10eg / 1.10n / 1.10v and the Sign out
 * dialogs 1.10s*; FR-ACC-18) — Afham.
 *
 * One screen holds every account setting, with the rows the role needs:
 *   SECURITY      Change password
 *   CONTACT       Phone · NIC (last four) · Email ("Add email" when none) · Display name
 *                 [employer: Business name & bio (Business only) · Posting as]
 *   NOTIFICATIONS Notification preferences
 *   SUPPORT       Help — how YouthLink works
 *   ACCOUNT       Sign out · Delete account
 * The variants differ only in which rows show and what values they carry, so it is one screen
 * reading the signed-in user.
 *
 * Sign out (FR-ACC-18 amendment): confirm, then this device discards its token. Other devices
 * stay signed in (no server call), and the login screen opens with the number remembered.
 *
 * Rows whose destination another card builds (NIC 1.13, Email 1.14, Business 1.15eb, Posting as
 * 1.16, Delete 1.17, notification preferences M3 3.11) open it only once that screen is
 * registered; until then the row does nothing rather than crash. Screen names below are the
 * ones to register them under.
 */
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../auth/AuthContext";
import { colors, spacing, typography } from "../../theme/tokens";
import ScreenHeader from "../../components/ScreenHeader";
import ConfirmDialog from "../../components/ConfirmDialog";
import SettingsRow from "./components/SettingsRow";
import { COUNTRY_CODE, formatLocalNumber, toLocalDigits } from "./phoneFormat";
import { getMe } from "../../api/account";

// Destinations owned by other cards (see header). Names are the proposed screen names.
const NIC = "AccountNic";
const EMAIL = "AccountEmail";
const BUSINESS = "AccountBusiness";
const POSTING_AS = "AccountPostingAs";
const DELETE = "AccountDeleteAccount";
const NOTIFICATION_PREFERENCES = "NotificationPreferences";

export default function AccountSettingsScreen({ navigation }) {
  const { user, signOut, updateUser } = useAuth();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  // Every time Settings comes into view, re-read the account: an email confirmed in the browser,
  // a number changed on another device. Quiet on failure — the stored values stay on screen.
  useEffect(() => {
    const refresh = () =>
      getMe()
        .then(({ pendingEmail, ...account }) => updateUser(account))
        .catch(() => {});
    refresh();
    return navigation.addListener("focus", refresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  if (!user) return null; // signing out: the screen is about to be replaced

  const isEmployer = user.role === "EMPLOYER";
  const isBusiness = isEmployer && user.postingAsType === "BUSINESS";

  /** Opens `name` if some module has registered it; a not-yet-built screen is a no-op. */
  function open(name, params) {
    if (navigation.getState().routeNames.includes(name)) navigation.navigate(name, params);
  }

  async function handleSignOut() {
    const remembered = toLocalDigits(user.phone);
    setConfirmingSignOut(false);
    await signOut();
    navigation.reset({ index: 0, routes: [{ name: "AccountLogin", params: { phone: remembered } }] });
  }

  const phoneText = `${COUNTRY_CODE} ${formatLocalNumber(toLocalDigits(user.phone))}`;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.group}>SECURITY</Text>
        <SettingsRow label="Change password" onPress={() => open("AccountChangePassword")} />

        <Text style={styles.group}>CONTACT</Text>
        <SettingsRow label="Phone" value={phoneText} onPress={() => open("AccountPhoneChange")} />
        <SettingsRow label="NIC" value={`•••• ${user.nicLast4 ?? ""}`} onPress={() => open(NIC)} />
        <SettingsRow label="Email" value={user.email || "Add email"} onPress={() => open(EMAIL)} />
        <SettingsRow label="Display name" value={user.legalName} onPress={() => open("AccountDisplayName")} />
        {isBusiness ? (
          <SettingsRow label="Business name & bio" value={user.businessName} onPress={() => open(BUSINESS)} />
        ) : null}
        {isEmployer ? (
          <SettingsRow
            label="Posting as"
            value={isBusiness ? "Business" : "Individual"}
            onPress={() => open(POSTING_AS)}
          />
        ) : null}

        <Text style={styles.group}>NOTIFICATIONS</Text>
        <SettingsRow label="Notification preferences" onPress={() => open(NOTIFICATION_PREFERENCES)} />

        <Text style={styles.group}>SUPPORT</Text>
        <SettingsRow label="Help — how YouthLink works" onPress={() => open("HelpIndex")} />

        <Text style={styles.group}>ACCOUNT</Text>
        <SettingsRow label="Sign out" onPress={() => setConfirmingSignOut(true)} />
        <SettingsRow label="Delete account" danger onPress={() => open(DELETE)} />
      </ScrollView>

      {/* 1.10s: the dialog sits over a 40% scrim; nothing behind it is interactive. */}
      <Modal
        visible={confirmingSignOut}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmingSignOut(false)}
      >
        <View style={styles.dialogLayer}>
          <View style={styles.scrim} />
          <View style={styles.dialogWrap}>
            <ConfirmDialog
              title="Sign out of YouthLink?"
              body="Other devices stay signed in. Sign back in any time with your phone and password, or a one-time code."
              cancelLabel="Cancel"
              cancelStyle="secondary"
              confirmLabel="Sign out"
              confirmStyle="primary"
              onCancel={() => setConfirmingSignOut(false)}
              onConfirm={handleSignOut}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.subtle,
  },
  // Spec: content pad 16/16/24/16, gap 4.
  content: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.xs,
  },
  group: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  dialogLayer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  // color/overlay/scrim at 40% node opacity (design-system §4) — a separate layer so the
  // dialog on top stays fully opaque.
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay.scrim,
    opacity: 0.4,
  },
  dialogWrap: {
    alignSelf: "stretch",
  },
});
