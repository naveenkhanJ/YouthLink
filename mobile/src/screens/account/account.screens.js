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
import RegisterScreen from "./RegisterScreen";

export default [
  {
    name: "AccountLogin",
    component: LoginScreen,
    options: { title: "Log in" },
  },
  {
    name: "AccountRegister",
    component: RegisterScreen,
    options: { title: "Create account" },
  },
];
