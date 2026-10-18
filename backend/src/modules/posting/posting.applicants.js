// posting.applicants.js
// The seam between Gig Posting and Applying & Selection (YL-174 / FR-APPLY-09, FR-APPLY-10).
//
// When a posting stops accepting applications — withdrawn (FR-POST-12), expired
// (FR-POST-13) or filled (FR-POST-18) — its Pending applicants must be set to
// "Not selected" and told; when its material details change, its Pending applicants
// are told what changed. That logic belongs to Applying & Selection (Naveenkhan), who
// exposes the two functions; Gig Posting only calls them, through this file, so every
// call site in this module stays exactly as it was while the seam was a no-op.
//
//   resolvePendingApplicants(postingId, "WITHDRAWN" | "EXPIRED" | "FILLED") → { resolved }
//   notifyPendingApplicantsOfChange(postingId, changedFields)             → { notified }
//
// Wired on integration/viva-demo (docs/workflow/agent-protocol.md §8.4). The import is a
// cycle (application.service imports posting.service); it is safe because neither side
// calls the other while the modules are still loading.

import prisma from '../../lib/prisma.js';
import {
  resolvePendingApplicants,
  notifyPendingApplicantsOfChange as notifyThroughApplying,
} from '../application/application.service.js';
import { applicationTermsChanged } from '../application/application.notifications.js';

export { resolvePendingApplicants };

// The material fields Applying & Selection's notifyPendingApplicantsOfChange can describe. It
// drops every other field (and reads only those columns), so a category or location change —
// both material (FR-POST-11) — would reach no pending applicant through it.
const DESCRIBED_BY_APPLYING = ['startAt', 'payAmount', 'workersNeeded', 'schedule'];

/**
 * FR-APPLY-10: tell every Pending applicant that the posting's material details changed.
 *
 * Changes Applying's function can describe go to it unchanged. A change that includes the
 * category or the location is written here instead, as ONE notification per applicant covering
 * every changed field, built by Applying's own `applicationTermsChanged` — so the type, title,
 * body and payload are exactly what Applying would have written. The body names only the public
 * area, never the precise address (FR-POST-08): a pending applicant has not been selected.
 *
 * TODO (Applying & Selection): add category and location to that module's MATERIAL_FIELDS and
 * its posting select, then delete everything here except the re-export.
 *
 * @param {string} postingId
 * @param {string[]} changedFields - stored column names, e.g. ["payAmount", "locationAreaLabel"]
 * @returns {Promise<{ notified: number }>}
 */
export async function notifyPendingApplicantsOfChange(postingId, changedFields = []) {
  const fields = changedFields ?? [];
  if (fields.every((field) => DESCRIBED_BY_APPLYING.includes(field))) {
    return notifyThroughApplying(postingId, fields);
  }

  const posting = await prisma.gigPosting.findUnique({
    where: { id: postingId },
    select: {
      id: true,
      title: true,
      startAt: true,
      payKind: true,
      payAmount: true,
      payRateUnit: true,
      workersNeeded: true,
      schedule: true,
      category: true,
      locationAreaLabel: true,
    },
  });
  if (!posting) return { notified: 0 };

  const pending = await prisma.application.findMany({
    where: { gigPostingId: postingId, status: 'PENDING' },
    select: { id: true, workerId: true },
  });
  if (pending.length === 0) return { notified: 0 };

  await prisma.notification.createMany({
    data: pending.map((application) => applicationTermsChanged({ application, posting, changedFields: fields })),
  });
  return { notified: pending.length };
}
