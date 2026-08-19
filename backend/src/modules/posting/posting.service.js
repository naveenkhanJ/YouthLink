// gigPosting.service.js
// Business logic + data access for gig postings. Controllers should call
// only this layer, never prisma directly, so rules stay in one place.

// gigPosting.service.js
// Business logic + data access for gig postings. Controllers should call
// only this layer, never prisma directly, so rules stay in one place.

import prisma from '../../lib/prisma.js';
import { computeIsUrgent } from './posting.urgency.js';

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
  return posting;
}

export async function getGigPostingById(id) {
  return prisma.gigPosting.findUnique({ where: { id } });
}

export async function listGigPostingsByEmployer(employerId) {
  return prisma.gigPosting.findMany({
    where: { employerId },
    orderBy: { createdAt: 'desc' },
  });
}