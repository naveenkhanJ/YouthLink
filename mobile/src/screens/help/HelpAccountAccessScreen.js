/**
 * HF.5 — Account access. docs/prototype/MHF-help.md. Copy is verbatim.
 *
 * Reached from HF.1 AND the logged-out screens — this is "the point of
 * HF.5" per the spec itself: someone locked out of their account can't
 * read a help page that requires being in it, so this one has to work
 * signed out. Four steps, not three, because four distinct causes (lockout,
 * forgotten password, unreachable phone/email, suspension) would strand
 * someone if conflated.
 */
import TopicLayout from "./components/TopicLayout";

const STEPS = [
  {
    lead: "Too many password attempts",
    body: 'your password is paused for 15 minutes. Sign-in locks after 5 wrong passwords in a row. Only the password is paused: “Log in with a code instead” still works, and it is the fastest way back in.',
  },
  {
    lead: "You've forgotten your password",
    body: 'tap “Forgot password?”. We send a reset code to your phone, or a reset link to your email if you added and confirmed one.',
  },
  {
    lead: "Your phone and email no longer reach you",
    body: "tell us on the Forgot password screen. We will ask for your NIC, legal name and birthdate, and a YouthLink Admin checks them against the account before restoring your access. The outcome appears in the app on this device, so keep it installed.",
  },
  {
    lead: "Your account was suspended",
    body: "this is not a lockout. Suspension is a decision made by YouthLink staff after reports or warnings, it takes effect straight away, and it cannot be lifted by signing in again. Any engagements you had already agreed are not cancelled by it.",
  },
];

export default function HelpAccountAccessScreen({ navigation }) {
  return (
    <TopicLayout
      headerTitle="Account access"
      pageTitle="How to get back into your account"
      lead="Four different things stop you signing in, and they have different ways out. This page is the difference between them."
      steps={STEPS}
      footnote="The first two assume your phone or email still reaches you. Changing your number in Settings while you can still sign in is far easier than recovering the account afterwards."
      onBack={() => navigation.goBack()}
    />
  );
}
