/**
 * The unsent posting form, kept on the device only (FR-POST-15 as amended 2026-09-16, E9).
 *
 * FR-POST-15 rules out a *draft feature*: no server copy, no list of drafts, no
 * lifecycle. NFR-USE-01 asks the app to tolerate losing signal. The two are
 * reconciled by keeping what the employer just typed on the phone itself, unsent,
 * until it is submitted or explicitly discarded — so a poor connection never costs
 * someone the whole form, and nothing partial is recoverable *from the system*.
 *
 * Stored in expo-secure-store, the only on-device storage the app already ships (adding
 * another storage package is a dependency change, which is not a module owner's call).
 * One entry per signed-in account, so two people sharing a phone never see each other's
 * form. A form is at most about 1.5 KB — a title, a 1000-character description and a
 * few short fields — well inside what SecureStore holds.
 *
 * Every function swallows storage errors: a form that can't be remembered must never
 * stop the employer typing or posting.
 */
import * as SecureStore from 'expo-secure-store';

// SecureStore keys allow letters, digits, ".", "-" and "_" — a uuid user id is fine.
const keyFor = (userId) => `youthlink.postingForm.${userId}`;

/** The saved form fields, or null when nothing is kept for this account. */
export async function loadPostingDraft(userId) {
  if (!userId) return null;
  try {
    const raw = await SecureStore.getItemAsync(keyFor(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Keeps the form as it stands now. `keptOffline` marks a publish that failed with no signal. */
export async function savePostingDraft(userId, draft) {
  if (!userId) return;
  try {
    await SecureStore.setItemAsync(keyFor(userId), JSON.stringify(draft));
  } catch {
    // Not remembering is acceptable; blocking the form is not.
  }
}

/** Flags the kept form as "a publish failed with no signal", so reopening says so (prototype 2.1rst). */
export async function markDraftKeptOffline(userId) {
  const draft = await loadPostingDraft(userId);
  if (draft) await savePostingDraft(userId, { ...draft, keptOffline: true });
}

/** Forgets the form — on a successful post, or when the employer explicitly discards it. */
export async function clearPostingDraft(userId) {
  if (!userId) return;
  try {
    await SecureStore.deleteItemAsync(keyFor(userId));
  } catch {
    // Nothing to do.
  }
}

/** Whether a form holds anything worth keeping (an untouched blank form isn't saved). */
export function hasDraftContent(draft) {
  if (!draft) return false;
  return Boolean(
    draft.title?.trim() ||
      draft.description?.trim() ||
      draft.category ||
      draft.payAmount ||
      draft.schedule?.trim() ||
      draft.locationAddress?.trim() ||
      draft.startDate ||
      draft.startTime,
  );
}
