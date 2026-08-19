# mobile/src

```
src/
  api/         One file per backend module, plus client.js
  components/  Shared UI used by more than one screen
  config/      API base URL — Firebase has no JS-side config here, see below
  navigation/  RootNavigator — you should never need to edit it
  screens/     One folder per module. Your screens live here
  utils/       Small helpers
```

**Firebase is native modules (`@react-native-firebase/*`), not the JS SDK** — phone auth needs it, since the JS SDK's phone auth relies on a browser reCAPTCHA that doesn't exist in React Native. It auto-initializes from `mobile/google-services.json`/`GoogleService-Info.plist` (git-ignored, see the root README's "Running the mobile app" section for how to get them) — there's no JS-side config object to set up in `src/config/`.

**Screens go under `src/screens/<your-module>/`.** Same reasoning as the backend: four people working in parallel should rarely touch the same file.

**To add a screen, edit only `src/screens/<module>/<module>.screens.js`** — your module's manifest. `RootNavigator` collects them all automatically, so nobody edits the navigator. Prefix screen names with your module (`AccountRegister`, not `Register`); names are global and a duplicate throws at startup.

**Before anything runs, install the navigation packages** — see `src/navigation/README.md`. One command, once.

**Call the API through `src/api/<module>.js`, not `fetch` directly.** The base URL, the auth token and the error shape are handled once in `api/client.js`.

**On the Android emulator, `localhost` is the emulator, not your computer.** `src/config/index.js` uses `10.0.2.2`, which is the emulator's alias for the host machine. On a physical device, replace it with your machine's LAN IP.
