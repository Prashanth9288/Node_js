const express = require('express');
const router = express.Router();
const MentorCtrl = require('../controllers/mentor.controller');
router.post('/', MentorCtrl.create);
router.post('/:id/soft-delete', MentorCtrl.softDelete);
router.get('/:id/sessions', MentorCtrl.activeSessions);
router.get('/no-active', MentorCtrl.mentorsNoActive);
module.exports = router;
