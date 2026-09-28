/**
 * Display/CodePanel — real Figma component (node 40:127, "Components /
 * Display" page, found 2026-09-28). New — nothing existed for this
 * before. Check-in code panel (5.4/5.5, 8.1 pattern).
 *
 * Custody flips, per the component's own description (product-overview
 * §6): arrival+completion checkpoints have the employer HOLD the code
 * and the worker ENTER it; payment FLIPS this — the worker holds, the
 * employer enters — "the party best positioned to falsely deny
 * something holds the code the other party needs." The "PaymentGate"
 * view is a deliberate PRECONDITION step ("Have you been paid?") shown
 * BEFORE the code, never beside the pay figure — don't collapse
 * `view="paymentGate"` and `view="holder"` into one screen; a worker
 * must confirm payment before their code even appears.
 */
import { Text, View, StyleSheet } from "react-native";
import { colors, spacing, radius, elevation, typography } from "../theme/tokens";
import Button from "./Button";
import CodeInputNumeric from "./CodeInputNumeric";

/**
 * @param {"holder"|"enterer"|"paymentGate"} view
 * @param {string} [code] - "holder" view only, e.g. "482913".
 * @param {string} [enteredCode] - "enterer" view only.
 * @param {(value: string) => void} [onChangeCode] - "enterer" view only.
 * @param {() => void} [onConfirmPaid] - "paymentGate" view only.
 */
export default function CodePanel({ view, code, enteredCode, onChangeCode, onConfirmPaid }) {
  return (
    <View style={[styles.card, elevation.card]}>
      {view === "paymentGate" ? (
        <>
          <Text style={styles.title}>Have you been paid?</Text>
          <Text style={styles.body}>
            Share your code only after you have the money. It is your proof — it stops anyone
            later claiming you were never paid.
          </Text>
          <Button title="Yes — show my code" onPress={onConfirmPaid} style="primary" />
        </>
      ) : null}
      {view === "enterer" ? (
        <>
          <Text style={styles.body}>Enter the code the employer shows you.</Text>
          <CodeInputNumeric value={enteredCode} onChangeText={onChangeCode} />
        </>
      ) : null}
      {view === "holder" ? (
        <>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{code.split("").join(" ")}</Text>
          </View>
          <Text style={styles.body}>Show this code to the worker when they arrive.</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.input,
    backgroundColor: colors.bg.default,
  },
  title: {
    ...typography.title,
    color: colors.text.primary,
  },
  body: {
    ...typography.secondary,
    color: colors.text.secondary,
  },
  codeBox: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.input,
    backgroundColor: colors.bg.subtle,
  },
  code: {
    ...typography.displayNumber,
    color: colors.text.primary,
  },
});
