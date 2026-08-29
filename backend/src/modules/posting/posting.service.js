// gigPosting.service.js
// Business logic + data access for gig postings. Controllers should call
// only this layer, never prisma directly, so rules stay in one place.

// gigPosting.service.js
// Business logic + data access for gig postings. Controllers should call
// only this layer, never prisma directly, so rules stay in one place.

import prisma from '../../lib/prisma.js';
import { computeIsUrgent } from './posting.urgency.js';
// DEMO WIRING: see the call site in createGigPosting below.
import notificationService from '../notification/notification.service.js';

/**
 * Creates a new gig posting for the given employer.
 * Assumes `data` has already passed posting.validators.js.
 */
export async function createGigPosting(employerId, data) {
  const posting = await prisma.gigPosting.create({
    data: {
      employerId,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      arrangementType: data.arrangementType,
      payKind: data.payKind,
      payAmount: data.payAmount != null ? data.payAmount : null,
      payRateUnit: data.payRateUnit ?? null,
      postedAsType: data.postedAsType,
      postedBusinessName: data.postedBusinessName?.trim() || null,
      postedBusinessBio: data.postedBusinessBio?.trim() || null,
      locationAddress: data.locationAddress.trim(),
      locationLat: Number(data.locationLat),
      locationLng: Number(data.locationLng),
      locationAreaLabel: data.locationAreaLabel.trim(),
      workersNeeded: data.workersNeeded != null ? Number(data.workersNeeded) : 1,
      startAt: new Date(data.startAt),
      schedule: data.schedule?.trim() || null,
      // FR-POST-07: always derived from startAt — never taken from client input,
      // even if data.isUrgent was sent. No manual override.
      isUrgent: computeIsUrgent(data.startAt),
      // status defaults to OPEN per schema; filledCount defaults to 0.
    },
  });

  // DEMO WIRING: FR-NOTIF-01/02 fire "when a posting is published", and
  // notification.service.js implements that fan-out in full — but nothing in
  // backend/src ever called it, so it was dead code and notification history
  // stayed empty after posting a gig. This is the trigger point the two
  // requirements describe. Owner note: this belongs in the real integration
  // between Gig Posting and Notifications, decided by those two owners.
  //
  // Deliberately not awaited: a notification failure must not fail the
  // posting the employer just created, and the fan-out loops over every
  // eligible worker. Errors are logged, never surfaced to the client.
  notificationService
    .notifyNewGigPosted({ gigPostingId: posting.id })
    .catch((err) => console.error('notifyNewGigPosted failed:', err));

  return posting;
}

export async function getGigPostingById(id) {
  // DEMO WIRING: engagements are included so posting.location.js can decide
  // whether this viewer is a selected worker and may see the precise address
  // (FR-POST-08 / FR-APPLY-07). sanitizePostingLocation strips this array back
  // out before the posting reaches the client.
  return prisma.gigPosting.findUnique({
    where: { id },
    include: { engagements: { select: { workerId: true, status: true } } },
  });
}

export async function listGigPostingsByEmployer(employerId) {
  return prisma.gigPosting.findMany({
    where: { employerId },
    orderBy: { createdAt: 'desc' },
  });
}