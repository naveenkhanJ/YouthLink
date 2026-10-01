/**
 * Runs `refresh` whenever the app returns to the foreground. A screen that already refreshes on
 * navigation focus does not hear about the person coming back from another app (the browser after
 * confirming an email link, say), because the screen never lost focus inside the app.
 */
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

/** @param {() => void} refresh - Latest version is always the one called. */
export default function useForegroundRefresh(refresh) {
  const latest = useRef(refresh);
  latest.current = refresh;
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") latest.current();
    });
    return () => sub.remove();
  }, []);
}
