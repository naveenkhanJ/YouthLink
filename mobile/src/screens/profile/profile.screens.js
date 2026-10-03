/**
 * Screen manifest for the FR-PROF module — Afham (minimal slice: the person's own profile).
 *
 * This is the ONLY file you edit to add a screen. RootNavigator collects every
 * module's manifest automatically, so four people can add screens in parallel
 * without ever touching the same file.
 *
 * Each entry:
 *   name      Unique across the whole app. Prefix with the module to guarantee
 *             that — e.g. "ProfileRegister", not "Register".
 *   component The screen component itself.
 *   options   Optional react-navigation screen options, e.g. { title: "..." }.
 *
 * Example:
 *   import ExampleScreen from "./ExampleScreen";
 *   export default [
 *     { name: "ProfileExample", component: ExampleScreen, options: { title: "Example" } },
 *   ];
 */
import ProfileOwnScreen from "./ProfileOwnScreen";

export default [
  // M1 1.18 and its variants: the person's own profile, with the way into Settings.
  { name: "ProfileOwn", component: ProfileOwnScreen, options: { headerShown: false } },
];
