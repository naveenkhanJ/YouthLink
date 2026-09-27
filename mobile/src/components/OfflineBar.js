/**
 * Feedback/OfflineBar — docs/prototype/design-system.md §5/§8 (NFR-USE-01).
 * A thin, non-blocking strip a screen shows while there's no connectivity —
 * shown or hidden by the caller (this component doesn't detect connectivity
 * itself; that's @react-native-community/netinfo territory if/when a
 * screen needs it, a decision for whichever screen first needs it, not
 * invented here).
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme/tokens";

export default function OfflineBar() {
  return (
    <View style={styles.bar}>
      <Text style={styles.text}>You're offline — showing the last loaded data.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg.subtle,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  text: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
