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
import AccountResetByEmailScreen from "./AccountResetByEmailScreen";
import AccountDisplayNameScreen from "./AccountDisplayNameScreen";
import AccountNicScreen from "./AccountNicScreen";
import AccountEmailScreen from "./AccountEmailScreen";
import AccountDeleteAccountScreen from "./AccountDeleteAccountScreen";
import AccountPostingAsScreen from "./AccountPostingAsScreen";
import AccountBusinessScreen from "./AccountBusinessScreen";

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
    options: { headerShown: false },
  },
  {
    name: "AccountForgotPasswordCode",
    component: AccountForgotPasswordCodeScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountRecoveryConfirm",
    component: AccountRecoveryConfirmScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountRecoveryStatus",
    component: AccountRecoveryStatusScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountResetPassword",
    component: AccountResetPasswordScreen,
    options: { headerShown: false },
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
  {
    name: "AccountResetByEmail",
    component: AccountResetByEmailScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountDisplayName",
    component: AccountDisplayNameScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountNic",
    component: AccountNicScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountEmail",
    component: AccountEmailScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountDeleteAccount",
    component: AccountDeleteAccountScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountPostingAs",
    component: AccountPostingAsScreen,
    options: { headerShown: false },
  },
  {
    name: "AccountBusiness",
    component: AccountBusinessScreen,
    options: { headerShown: false },
  },
];
