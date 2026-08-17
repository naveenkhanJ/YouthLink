
// gigPosting.routes.js
// Mount in app.js with: app.use('/api/postings', require('./modules/posting/posting.routes'));

const express = require('express');
const { createGigPostingValidators } = require('./posting.validators');
const postingController = require('./posting.controller');

const router = express.Router();

router.post('/', createGigPostingValidators, postingController.createGigPosting);
router.get('/mine', postingController.listMyGigPostings);
router.get('/:id', postingController.getGigPosting);

module.exports = router;

