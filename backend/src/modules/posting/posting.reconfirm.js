// posting.reconfirm.js
// FR-POST-11 criterion 2 / FR-ENG-09 — a material edit after a place is filled asks each
// engaged worker to re-confirm instead of changing the deal silently.
//
// TODO: Engagement owns MaterialChangeRequest. Until its service is on `develop`, Posting
// creates the rows itself, here and only here. When Engagement exports its function,
// call it from requestReconfirmation and delete the body — nothing else changes.

const HOUR_MS = 60 * 60 * 1000;
const MAX_WINDOW_MS = 48 * HOUR_MS;

/**
 * The worker's window to answer: the shorter of 48 hours and half the time left before
 * the (new) start. Example: 36 h to the start gives an 18 h window.
 */
export function reconfirmDeadline(newStartAt, now = new Date()) {
  const untilStart = new Date(newStartAt).getTime() - now.getTime();
  return new Date(now.getTime() + Math.max(0, Math.min(MAX_WINDOW_MS, untilStart / 2)));
}

/**
 * Create one PENDING request per active engagement of the posting.
 *
 * @param {object} args
 * @param {object} args.posting     the posting as stored BEFORE the edit
 * @param {object} args.changes     `{ field: newValue }` for the material fields that changed
 * @param {Date}   args.newStartAt  the posting's start after the edit
 * @param {object} tx               a Prisma transaction client, so it commits with the edit
 * @returns {Promise<number>} how many requests were created
 */
export async function requestReconfirmation({ posting, changes, newStartAt }, tx) {
  const engagements = await tx.engagement.findMany({
    where: { gigPostingId: posting.id, status: { not: 'CANCELLED' } },
    select: { id: true },
  });

  // Old and new value of each changed field, e.g. { payAmount: { from: 6000, to: 7000 } }.
  const changeSummary = {};
  for (const [field, to] of Object.entries(changes)) {
    changeSummary[field] = { from: posting[field] ?? null, to };
  }

  const deadline = reconfirmDeadline(newStartAt);
  for (const engagement of engagements) {
    await tx.materialChangeRequest.create({
      data: {
        gigPostingId: posting.id,
        engagementId: engagement.id,
        changeSummary,
        deadline,
        status: 'PENDING',
      },
    });
  }
  return engagements.length;
}
