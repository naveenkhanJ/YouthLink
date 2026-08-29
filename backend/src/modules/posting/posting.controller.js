// gigPosting.controller.js
// Thin HTTP layer: pull the validated input off req, call the service,
// shape the response. No Prisma calls or business rules live here.

// DEMO WIRING (integration branch), two changes throughout this file:
//   1. Error responses now use the app-wide { error, fields } shape that
//      middleware/errorHandler.js produces and mobile/src/api/client.js reads.
//      The original { status:'error', errors } shape meant every validation
//      message rendered on the phone as a bare "Request failed (400)".
//   2. Reads run through sanitizePostingLocation, so FR-POST-08's
//      coarse-vs-precise address rule actually applies. posting.location.js
//      was fully written but imported by nothing except its own tests.
import { validationResult } from 'express-validator';
import * as gigPostingService from './posting.service.js';
import { sanitizePostingLocation, sanitizePostingList } from './posting.location.js';

export async function createGigPosting(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // One error per field, keyed by field name, so the client can
    // highlight exactly what's missing/invalid — per the acceptance criteria.
    const fieldErrors = {};
    for (const err of result.array({ onlyFirstError: true })) {
      fieldErrors[err.path] = err.msg;
    }
    return res.status(400).json({
      error: 'Please correct the highlighted fields.',
      fields: fieldErrors,
    });
  }

  // Assumes auth middleware upstream sets req.user; employerId is never
  // trusted from the request body.
  const employerId = req.user?.id;
  if (!employerId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const posting = await gigPostingService.createGigPosting(employerId, req.body);
    return res.status(201).json({ status: 'ok', posting });
  } catch (err) {
    console.error('createGigPosting failed:', err);
    return res.status(500).json({ error: 'Could not create posting.' });
  }
}

export async function getGigPosting(req, res) {
  try {
    const posting = await gigPostingService.getGigPostingById(req.params.id);
    if (!posting) {
      return res.status(404).json({ error: 'Posting not found.' });
    }
    // FR-POST-08: the employer who owns it and any selected worker get the
    // precise street address; everyone else gets the coarse area label only.
    return res
      .status(200)
      .json({ status: 'ok', posting: sanitizePostingLocation(posting, req.user?.id) });
  } catch (err) {
    console.error('getGigPosting failed:', err);
    return res.status(500).json({ error: 'Could not fetch posting.' });
  }
}

export async function listMyGigPostings(req, res) {
  const employerId = req.user?.id;
  if (!employerId) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    const postings = await gigPostingService.listGigPostingsByEmployer(employerId);
    // Own postings, so the sanitizer always releases the precise address here.
    // Routed through it anyway so one rule governs every posting response.
    return res
      .status(200)
      .json({ status: 'ok', postings: sanitizePostingList(postings, employerId) });
  } catch (err) {
    console.error('listMyGigPostings failed:', err);
    return res.status(500).json({ error: 'Could not fetch postings.' });
  }
}