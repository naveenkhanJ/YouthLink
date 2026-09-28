/**
 * HF.3 — Endorsement. docs/prototype/MHF-help.md. Copy is verbatim.
 */
import TopicLayout from "./components/TopicLayout";

const STEPS = [
  {
    lead: "Who can vouch",
    body: "someone registered as a Community Verifier who actually knows the person — a former teacher, a neighbour, someone they have worked for. They vouch using the person's endorsement code, or by searching their phone number.",
  },
  {
    lead: "What it shows",
    body: "the endorsement appears on the profile and beside the name in an employer's applicant list, naming the voucher and the traits they vouched for. Employers see applicants ordered by trust: rating history first, then endorsed, then new.",
  },
  {
    lead: "When it ends",
    body: "the chance to be vouched for closes the moment the person receives their first rating: no one new can vouch for them, by code or by phone search, and their own record comes first from then on. Endorsements they already have stay on their profile.",
  },
];

export default function HelpEndorsementScreen({ navigation }) {
  return (
    <TopicLayout
      headerTitle="Endorsement"
      pageTitle="How endorsement works"
      lead="Someone new has no ratings, and no ratings means no work — which is how they stay new. An endorsement lends them somebody else's standing until they have their own."
      steps={STEPS}
      footnote="A voucher can revoke an endorsement at any time, and the person is told. An endorsement is a starting push, not a guarantee — it never overrides what someone's own ratings say."
      onBack={() => navigation.goBack()}
    />
  );
}
