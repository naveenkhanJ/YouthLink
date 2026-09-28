/**
 * HF.4 — Disputes. docs/prototype/MHF-help.md. Copy is verbatim. The 48h
 * response window, one clarifying question, 24h pause, and 3-warnings/90-days
 * figures must agree with the Disputes/Moderation modules' own requirements
 * (FR-DISPUTE-*, FR-MOD-02) — they're specification here, not just copy.
 */
import TopicLayout from "./components/TopicLayout";

const STEPS = [
  {
    lead: "Opening one",
    body: "either side can open a dispute from the engagement. The other side has 48 hours to give their account; if they do not, the review goes ahead without it.",
  },
  {
    lead: "What the moderator sees",
    body: "both statements, any photo attached as evidence, and the code-exchange history — which codes were entered and at what time. A code that was never entered is evidence in itself.",
  },
  {
    lead: "The decision",
    body: "a moderator may ask one clarifying question, which pauses the case for 24 hours, and can then close it with a warning on the account at fault or escalate it to an Admin. Once escalated the moderator can no longer act, the Admin's ruling is final, and both sides are told the outcome.",
  },
];

export default function HelpDisputesScreen({ navigation }) {
  return (
    <TopicLayout
      headerTitle="Disputes"
      pageTitle="How disputes are resolved"
      lead="A dispute is for when a checkpoint cannot be agreed — an arrival that was never confirmed, or a payment code that was never entered. It is a review of the record rather than an argument between two people."
      steps={STEPS}
      footnote="Every action is written to the audit log under the name of the person who took it. Three warnings on one account within 90 days escalate automatically for a suspension review."
      onBack={() => navigation.goBack()}
    />
  );
}
