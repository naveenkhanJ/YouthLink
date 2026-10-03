/**
 * Display/EndorsementRow — real Figma component (node 40:93, "Components
 * / Display" page, found 2026-09-28). New — nothing existed for this
 * before. Endorsement row (8.5 revoke view, 1.19 track record).
 *
 * Real, non-obvious rules from the component's own description: never
 * anonymous — the endorser is always named (FR-ENDORSE-08). Attribute
 * chips render ONLY the selected ones (an empty array is valid) — never
 * a greyed-out "not attested" chip for an unselected attribute (M8
 * constraint 3, the schema's own comment verbatim). The Revoked variant
 * de-emphasises the whole row and hides the attribute chips entirely —
 * revoked endorsements vanish from counts (FR-ENDORSE-07), so don't
 * pass `attributes` for a revoked row expecting them to still show.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Chip from "./Chip";
import Link from "./Link";

/**
 * @param {string} endorserName
 * @param {string} reason - e.g. "Known him 8 years — neighbour".
 * @param {string[]} [attributes] - Selected attribute labels only. Ignored when revoked.
 * @param {boolean} [revoked]
 * @param {boolean} [showRevoke] - Shows the "Revoke" link. Ignored when already revoked.
 * @param {() => void} [onRevoke]
 */
export default function EndorsementRow({
  endorserName,
  reason,
  attributes = [],
  revoked = false,
  showRevoke = false,
  onRevoke,
}) {
  return (
    <View style={[styles.card, elevation.card, revoked && styles.cardRevoked]}>
      <View style={styles.nameRow}>
        <Text style={[styles.name, revoked && styles.textRevoked]}>{endorserName}</Text>
        {revoked ? <Text style={styles.revokedLabel}>Revoked</Text> : null}
      </View>
      <Text style={[styles.reason, revoked && styles.textRevoked]}>{reason}</Text>
      {!revoked && attributes.length > 0 ? (
        <View style={styles.attributes}>
          {attributes.map((label) => (
            <Chip key={label} label={label} kind="display" />
          ))}
        </View>
      ) : null}
      {!revoked && showRevoke ? (
        <View style={styles.revokeAction}>
          <Link title="Revoke" onPress={onRevoke} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  cardRevoked: {
    // Same card shape, just de-emphasised text — the real component
    // doesn't change the card chrome itself, only the text colour.
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    ...typography.bodyMedium,
    color: colors.text.primary,
  },
  revokedLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  reason: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  textRevoked: {
    color: colors.text.secondary,
  },
  attributes: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  revokeAction: {
    alignItems: "flex-end",
  },
});
