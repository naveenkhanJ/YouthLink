// posting.controller.js
// Thin HTTP layer: pull the validated input off req, call the service, shape the
// response. No Prisma calls or business rules live here.
//
// Failures are thrown as AppError and answered by the shared errorHandler as
// { error, fields? } — the shape mobile/src/api/client.js reads, so a rejected
// field reaches the form as a per-field message.

import { validationResult } from 'express-validator';
import AppError from '../../utils/AppError.js';
import asyncHandler from '../../utils/asyncHandler.js';
import * as postingService from './posting.service.js';
import { listAreas } from './posting.areas.js';

// One message per field, keyed by field name, so the client can highlight
// exactly what's missing or invalid (FR-POST-01 acceptance criteria).
function throwIfInvalid(req) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const fields = {};
    for (const err of result.array({ onlyFirstError: true })) {
      fields[err.path] = err.msg;
    }
    throw AppError.badRequest('Some details need fixing.', fields);
  }
}

export const createGigPosting = asyncHandler(async (req, res) => {
  throwIfInvalid(req);

  // employerId always comes from the verified token, never the request body.
  const posting = await postingService.createGigPosting(req.user.id, req.body);
  res.status(201).json({ posting });
});

export const getGigPosting = asyncHandler(async (req, res) => {
  const posting = await postingService.getGigPostingById(req.params.id, req.user.id);
  if (!posting) throw AppError.notFound('Posting not found.');
  res.json({ posting });
});

export const listMyGigPostings = asyncHandler(async (req, res) => {
  const postings = await postingService.listGigPostingsByEmployer(req.user.id);
  res.json({ postings });
});

// FR-POST-08: GET /api/postings/areas — the areas a posting can be placed in, sorted by name.
export const listPostingAreas = asyncHandler(async (req, res) => {
  res.json({ areas: listAreas() });
});

// FR-POST-11
export const updateGigPosting = asyncHandler(async (req, res) => {
  throwIfInvalid(req);
  const posting = await postingService.updateGigPosting(req.user.id, req.params.id, req.body);
  res.json({ posting });
});

// FR-POST-12
export const withdrawGigPosting = asyncHandler(async (req, res) => {
  const posting = await postingService.withdrawGigPosting(req.user.id, req.params.id);
  res.json({ posting });
});
