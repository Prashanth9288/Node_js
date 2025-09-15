const express = require('express');
const router = express.Router();
const LearnerCtrl = require('../controllers/learner.controller');
router.post('/', LearnerCtrl.create);
router.post('/:id/soft-delete', LearnerCtrl.softDelete);
router.get('/:id/sessions', LearnerCtrl.activeSessions);
router.get('/:id/mentors', LearnerCtrl.mentorsInteracted);
module.exports = router;
