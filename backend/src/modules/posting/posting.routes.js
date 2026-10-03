// posting.routes.js
// Mounted in app.js at /api/postings, behind the shared requireAuth.

import express from 'express';
import AppError from '../../utils/AppError.js';
import { createGigPostingValidators, updateGigPostingValidators } from './posting.validators.js';
import * as postingController from './posting.controller.js';

const router = express.Router();

// Role check (docs/module-ownership.md): only a Local Business/Employer creates
// or manages postings (FR-POST-01). requireAuth proves who is calling; it says
// nothing about what they may do, so a worker with a valid token stops here.
function requireEmployer(req, res, next) {
  if (req.user.role !== 'EMPLOYER') {
    return next(AppError.forbidden('Only employers can manage postings.'));
  }
  next();
}

router.post('/', requireEmployer, createGigPostingValidators, postingController.createGigPosting);
// '/mine' must be declared before '/:id', or "mine" would be read as an id.
router.get('/mine', requireEmployer, postingController.listMyGigPostings);
// FR-POST-08: the list of areas the Location step picks from. Open to any signed-in user (it is
// not private), and declared before '/:id' for the same reason as '/mine'.
router.get('/areas', postingController.listPostingAreas);
router.get('/:id', postingController.getGigPosting);
router.patch('/:id', requireEmployer, updateGigPostingValidators, postingController.updateGigPosting);
router.post('/:id/withdraw', requireEmployer, postingController.withdrawGigPosting);

export default router;
