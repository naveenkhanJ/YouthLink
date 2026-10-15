# Navigation — decided

**React Navigation, native stack.** Decided 2026-08-15. Nothing here is left open.

## Install first — one command, once

```bash
cd mobile
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

Use `npx expo install`, not `npm install` — it resolves versions compatible with Expo SDK 57. Until this runs, the app will not start.

> **`react-native-screens` and `react-native-safe-area-context` contain native code.** Whoever's dev-client build you're using — your own or one someone shared with you — needs to have been built _after_ these were installed, same as for any other native dependency (Firebase included). See the root README's "Running the mobile app" section for building your own; a rebuild is only needed when a native dependency changes, not for ordinary JS/UI work.

## How to add a screen

Edit **one file — your own module's manifest**:

```js
// src/screens/account/account.screens.js
import RegisterScreen from "./RegisterScreen";

export default [
  {
    name: "AccountRegister",
    component: RegisterScreen,
    options: { title: "Create account" },
  },
];
```

`RootNavigator.js` collects every module's manifest automatically. **You never edit it**, so four people can add screens in parallel without touching the same file.

**Prefix screen names with your module** — `AccountRegister`, not `Register`. Names are global. `RootNavigator` throws at startup on a duplicate rather than failing silently later.

Navigate with `navigation.navigate("AccountRegister")`.

## Transitions

- **Moving deeper** (a list to its detail, a form step, back) slides in from the right: `animation: "slide_from_right"`, set once on the navigator in `RootNavigator.js`. Do not leave it at the library default: on Android 13+ that is a slow (450 ms) fade with a small sideways shift, which looks unfinished.
- **Switching tabs** has no animation. The tab bar is drawn inside every tab screen (`ShellTabBar`), so any push animation would move the bar with the page. Tab screens are `animation: "none"`, so the bar stays put and only the content changes. The list of tab screens is `TAB_HUB_ROUTES` in `components/ShellTabBar.js`, derived from `ROUTE_BY_TAB`, so a hub added there is covered without touching the navigator. A cross-fade is not an alternative: the window behind the app is brand blue and shows through mid-fade.
- **Press feedback** follows a few rules, all in `pressed` in `theme/tokens.js`: a white row, field, option or chip darkens (the tint follows its rounded corners); a brand-filled control dims, as `Button` does; a text link dims; a card that opens something shrinks slightly (`components/PressableScale.js`); a tab tints inside its pill, Material 3 style. Android's ripple is used only for icon buttons (`iconRipple`, a circle): on this React Native it ignores rounded corners, so on anything rounded it showed a hard rectangle.
- **Reduce motion**: every decorative animation (loading pulse, toast, card press) checks `hooks/useReducedMotion.js` and stays still when the phone asks for less motion.

## Why React Navigation and not expo-router

`expo-router` was the serious alternative and was rejected for one decisive reason plus three supporting ones.

**Decisive: it would break the module-first structure.** `expo-router` requires an `app/` directory where the folder tree _is_ the route tree. Screens would be organised by URL path rather than by module — directly against the ownership model the whole repository is built around, where each person works inside one folder. We would have had to choose between file-based routing and module ownership.

**Supporting:**

- **Its main advantages don't apply.** `expo-router` exists for deep linking, URL-based navigation and web. We are Android-only for Sprints 1–2, have no web surface, and no requirement asks for deep links.
- **It's a larger change mid-sprint.** It replaces the entry point (`package.json` `main` → `expo-router/entry`), removes `App.js`, and needs a `scheme` in `app.json`. React Navigation leaves all of that alone.
- **The team is new to React Native.** React Navigation has far more tutorials and answers than `expo-router`'s file conventions (`_layout`, route groups, dynamic segments).

The one real advantage of file-based routing — no shared navigator file for four people to collide in — is recovered here by the per-module manifests.

Worth revisiting only if a web dashboard in Expo or real deep-linking is ever added. Neither is in scope.
