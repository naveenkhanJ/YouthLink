/**
 * Picking a dispute photo (FR-DISPUTE-05) — the checks that must happen BEFORE upload.
 *
 * FR-DISPUTE-05's criterion: "Given a party attempts to attach a 4th image or a file exceeding
 * 5MB, when attempted, then the system blocks it." The 4th image is blocked by
 * Display/PhotoPicker itself (its add tile disappears at three, and pickEvidencePhoto refuses a
 * fourth as a second guard); a photo over 5 MB is refused here, with the server's own sentence, so
 * the screen and the API say the same thing and nothing oversized is ever sent.
 *
 * The photo is read as base64 because the backend takes evidence inside JSON. The picker
 * re-encodes at quality 0.7, so the size checked is the size actually sent — the decoded byte
 * count of that base64 — which is also exactly what the server measures.
 */
import { KeyboardController } from "react-native-keyboard-controller";
import * as ImagePicker from "expo-image-picker";

export const EVIDENCE_LIMIT = 3;
export const EVIDENCE_MAX_BYTES = 5 * 1024 * 1024; // 5 MB, as the server (5242880)

// The server's sentences (dispute.service.js MESSAGES), reused word for word.
export const MESSAGES = {
  tooLarge: "Each photo can be up to 5MB.",
  tooMany: "You can add up to 3 photos.",
  wrongType: "Photos must be JPEG, PNG or WebP images.",
  unreadable: "This photo couldn't be read. Try choosing it again.",
};

/** Bytes a base64 string decodes to, without decoding it. */
function decodedBytes(base64) {
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return (base64.length * 3) / 4 - padding;
}

/**
 * The real type, read from the data's first bytes rather than trusted from the picker: after
 * re-encoding, the asset's reported mimeType can describe the original file, not the data.
 */
function sniffMimeType(base64) {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64.startsWith("UklGR")) return "image/webp";
  return null;
}

/**
 * Opens the photo library for one image.
 * @param {number} alreadyChosen - photos already on the form
 * @returns {Promise<{ photo: { uri: string, mimeType: string, dataBase64: string } } | { error: string } | null>}
 *   null when the person backed out of the picker.
 */
export async function pickEvidencePhoto(alreadyChosen) {
  if (alreadyChosen >= EVIDENCE_LIMIT) return { error: MESSAGES.tooMany };

  // Close the keyboard, and let Android finish closing it, before the system picker covers the app.
  // Found on the emulator (2026-10-18): with the keyboard closed less than ~1 s before the picker
  // opened, the app came back with a keyboard-sized gap at the bottom — every pinned action bar
  // stranded mid-screen until the keyboard was next used. Waiting only when it was actually open
  // keeps the usual tap instant.
  const keyboardWasOpen = KeyboardController.isVisible();
  await KeyboardController.dismiss();
  if (keyboardWasOpen) await new Promise((resolve) => setTimeout(resolve, 1500));

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: false,
    base64: true,
    quality: 0.7,
  });
  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const base64 = asset.base64?.replace(/\s/g, "");
  if (!base64) return { error: MESSAGES.unreadable };
  if (decodedBytes(base64) > EVIDENCE_MAX_BYTES) return { error: MESSAGES.tooLarge };
  const mimeType = sniffMimeType(base64);
  if (!mimeType) return { error: MESSAGES.wrongType };

  return { photo: { uri: asset.uri, mimeType, dataBase64: base64 } };
}
