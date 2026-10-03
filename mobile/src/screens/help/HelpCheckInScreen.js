/**
 * HF.2 — Check-in codes. docs/prototype/MHF-help.md. Copy is verbatim from
 * the prototype spec — strings are specification here, not placeholder.
 */
import TopicLayout from "./components/TopicLayout";

const STEPS = [
  {
    lead: "Arrival",
    body: "the employer shows a code when the worker gets there, and the worker enters it. That is what records that they turned up.",
  },
  {
    lead: "Completion",
    body: "the employer shows a second code once the work is finished, and the worker enters that one too. It should only be shared when the work is genuinely done.",
  },
  {
    lead: "Payment",
    body: "this code belongs to the worker. It appears once completion has been confirmed, and they share it only after they have been paid. The employer entering it is the receipt.",
  },
];

export default function HelpCheckInScreen({ navigation }) {
  return (
    <TopicLayout
      headerTitle="Check-in codes"
      pageTitle="How check-in codes work"
      lead="A gig has three checkpoints — an unpaid internship has two, with no payment step. Each one is confirmed by a short code — one person shows it, the other types it in. Nothing is marked done because someone simply said so."
      steps={STEPS}
      footnote="The code is always held by whoever can honestly say the thing happened, so confirming a checkpoint takes both people. If one cannot be confirmed, either side can open a dispute from the engagement, and the record of which codes were entered — and when — goes to the moderator with it."
      onBack={() => navigation.goBack()}
    />
  );
}
