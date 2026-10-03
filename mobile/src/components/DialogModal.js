/**
 * A dialog over the screen: a full-screen 40% scrim (color/overlay/scrim, design-system §4) with
 * the card (a ConfirmDialog) centred on it, 16px from the sides. Everything behind it, status bar
 * included, is dimmed and not interactive. This is the one place dialogs are put on screen, so a
 * dialog never falls back to the system alert (a white native box that ignores the design).
 *
 * The scrim is a separate layer under the card so the card itself stays fully opaque.
 */
import { Modal, View, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/tokens";
import { fill } from "../theme/layout";

/**
 * @param {boolean} visible
 * @param {() => void} onRequestClose - Hardware Back; usually the dialog's own cancel/confirm.
 * @param {import("react").ReactNode} children - A ConfirmDialog.
 */
export default function DialogModal({ visible, onRequestClose, children }) {
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.layer}>
        <View style={styles.scrim} />
        <View style={styles.wrap}>{children}</View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  layer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  scrim: {
    ...fill,
    backgroundColor: colors.overlay.scrim,
    opacity: 0.4,
  },
  wrap: {
    alignSelf: "stretch",
  },
});
