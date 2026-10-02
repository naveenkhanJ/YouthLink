/**
 * Makes the round launcher icon adaptive as well.
 *
 * Expo's prebuild writes an adaptive icon (`mipmap-anydpi-v26/ic_launcher.xml`: background,
 * foreground, monochrome layers) but the manifest's `android:roundIcon` points at
 * `ic_launcher_round`, which prebuild generates as a plain pre-masked bitmap (a dark disc with
 * transparent corners). Launchers that use the round icon on the home screen treat a bitmap as a
 * legacy icon and put it on a light plate of their own, which showed up as a light-blue ring around
 * the icon on the home screen only (the app drawer uses the adaptive icon and had no ring).
 *
 * This adds `mipmap-anydpi-v26/ic_launcher_round.xml` with the same three layers. On Android 8 and
 * later that file takes priority over the bitmap, so the home screen and the drawer draw the same
 * adaptive icon. The bitmaps stay in place for older Android versions.
 */
const { withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const ROUND_ICON_XML = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`;

module.exports = function withAdaptiveRoundIcon(config) {
  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const dir = path.join(cfg.modRequest.platformProjectRoot, "app/src/main/res/mipmap-anydpi-v26");
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "ic_launcher_round.xml"), ROUND_ICON_XML);
      return cfg;
    },
  ]);
};
