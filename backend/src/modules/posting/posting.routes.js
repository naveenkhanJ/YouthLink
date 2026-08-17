
// gigPosting.routes.js
//Mount in server.js with: app.use('/api/gig-postings', require('./gigPosting.routes'));
// Assumes an `authMiddleware` upstream that sets req.user — swap the import
// for your real auth middleware.

const express = require('express');
const { createGigPostingValidators } = require('./gigPosting.validators');
const gigPostingController = require('./gigPosting.controller');
// const authMiddleware = require('./authMiddleware'); // TODO: wire up real auth

const router = express.Router();

// router.use(authMiddleware); // uncomment once auth middleware exists

router.post('/', createGigPostingValidators, gigPostingController.createGigPosting);
router.get('/mine', gigPostingController.listMyGigPostings);
router.get('/:id', gigPostingController.getGigPosting);

module.exports = router;

