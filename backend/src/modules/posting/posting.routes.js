
// gigPosting.routes.js
// Mount in app.js with: app.use('/api/postings', postingRoutes);

import express from 'express';
import { createGigPostingValidators } from './posting.validators.js';
import * as postingController from './posting.controller.js';

const router = express.Router();

router.post('/', createGigPostingValidators, postingController.createGigPosting);
router.get('/mine', postingController.listMyGigPostings);
router.get('/:id', postingController.getGigPosting);

export default router;

