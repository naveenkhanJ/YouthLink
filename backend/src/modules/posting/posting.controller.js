// gigPosting.controller.js
// Thin HTTP layer: pull the validated input off req, call the service,
// shape the response. No Prisma calls or business rules live here.

const { validationResult } = require('express-validator');
const gigPostingService = require('./posting.service');

async function createGigPosting(req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // One error per field, keyed by field name, so the client can
    // highlight exactly what's missing/invalid — per the acceptance criteria.
    const fieldErrors = {};
    for (const err of result.array({ onlyFirstError: true })) {
      fieldErrors[err.path] = err.msg;
    }
    return res.status(400).json({ status: 'error', errors: fieldErrors });
  }

  // Assumes auth middleware upstream sets req.user; employerId is never
  // trusted from the request body.
  const employerId = req.user?.id;
  if (!employerId) {
    return res.status(401).json({ status: 'error', message: 'Authentication required.' });
  }

  try {
    const posting = await gigPostingService.createGigPosting(employerId, req.body);
    return res.status(201).json({ status: 'ok', posting });
  } catch (err) {
    req.log?.error?.(err);
    return res.status(500).json({ status: 'error', message: 'Could not create posting.' });
  }
}

async function getGigPosting(req, res) {
  try {
    const posting = await gigPostingService.getGigPostingById(req.params.id);
    if (!posting) {
      return res.status(404).json({ status: 'error', message: 'Posting not found.' });
    }
    return res.status(200).json({ status: 'ok', posting });
  } catch (err) {
    req.log?.error?.(err);
    return res.status(500).json({ status: 'error', message: 'Could not fetch posting.' });
  }
}

async function listMyGigPostings(req, res) {
  const employerId = req.user?.id;
  if (!employerId) {
    return res.status(401).json({ status: 'error', message: 'Authentication required.' });
  }
  try {
    const postings = await gigPostingService.listGigPostingsByEmployer(employerId);
    return res.status(200).json({ status: 'ok', postings });
  } catch (err) {
    req.log?.error?.(err);
    return res.status(500).json({ status: 'error', message: 'Could not fetch postings.' });
  }
}

module.exports = { createGigPosting, getGigPosting, listMyGigPostings };