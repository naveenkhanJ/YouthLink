/**
 * Screen manifest for the FR-ACC module — Afham.
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Each entry:
 *   name      Unique across the whole app. Prefix with the module to guarantee
 *             that — e.g. "AccountRegister", not "Register".
 *   component The screen component itself.
 *   options   Optional react-navigation screen options, e.g. { title: "..." }.
 *
 * Example:
 *   import ExampleScreen from "./ExampleScreen";
 *   export default [
 *     { name: "AccountExample", component: ExampleScreen, options: { title: "Example" } },
 *   ];
 */
import LoginScreen from "./LoginScreen";
import AccountLoginOtpScreen from "./AccountLoginOtpScreen";
import RegisterScreen from "./RegisterScreen";
import AccountForgotPasswordScreen from "./AccountForgotPasswordScreen";
import AccountForgotPasswordCodeScreen from "./AccountForgotPasswordCodeScreen";
import AccountRecoveryConfirmScreen from "./AccountRecoveryConfirmScreen";
import AccountRecoveryStatusScreen from "./AccountRecoveryStatusScreen";
import AccountResetPasswordScreen from "./AccountResetPasswordScreen";
import AccountPhoneChangeScreen from "./AccountPhoneChangeScreen";
import AccountTermsScreen from "./AccountTermsScreen";
import AccountSettingsScreen from "./AccountSettingsScreen";
import AccountChangePasswordScreen from "./AccountChangePasswordScreen";

export default [
  {
    name: "AccountLogin",
    component: LoginScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountLoginOtp",
    component: AccountLoginOtpScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountRegister",
    component: RegisterScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountForgotPassword",
    component: AccountForgotPasswordScreen,
    options: { title: "Forgot password" },
  },
  {
    name: "AccountForgotPasswordCode",
    component: AccountForgotPasswordCodeScreen,
    options: { title: "Verify code" },
  },
  {
    name: "AccountRecoveryConfirm",
    component: AccountRecoveryConfirmScreen,
    options: { title: "Recover account" },
  },
  {
    name: "AccountRecoveryStatus",
    component: AccountRecoveryStatusScreen,
    options: { title: "Recovery status" },
  },
  {
    name: "AccountResetPassword",
    component: AccountResetPasswordScreen,
    options: { title: "Reset password" },
  },
  {
    name: "AccountPhoneChange",
    component: AccountPhoneChangeScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountTerms",
    component: AccountTermsScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountSettings",
    component: AccountSettingsScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountChangePassword",
    component: AccountChangePasswordScreen,
    options: { headerShown: false },
  },
];
