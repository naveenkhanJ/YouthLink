
// gigPosting.routes.js
// Mount in app.js with: app.use('/api/postings', postingRoutes);

import express from 'express';
import requireAuth from '../../middleware/requireAuth.js';
import { createGigPostingValidators } from './posting.validators.js';
import * as postingController from './posting.controller.js';

const router = express.Router();

// DEMO WIRING (integration branch): the controller already reads req.user?.id
// and 401s without it, but nothing ever set req.user — so every route below
// was unreachable. requireAuth is the shared Account Management middleware
// (docs/module-ownership.md); this module always intended to sit behind it.
//
// Applied to every route, including GET /:id, because the location-privacy
// rule in posting.location.js needs a viewer identity to decide whether the
// precise address is released. An "optional auth" variant would mean a second
// auth middleware, which AGENTS.md explicitly forbids.
router.use(requireAuth);

router.post('/', createGigPostingValidators, postingController.createGigPosting);
router.get('/mine', postingController.listMyGigPostings);
router.get('/:id', postingController.getGigPosting);

export default router;

