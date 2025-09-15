const express = require('express');
const router = express.Router();
const SessionCtrl = require('../controllers/session.controller');
router.post('/', SessionCtrl.createSession);
router.get('/recent', SessionCtrl.getRecent);
router.get('/:id/learners', SessionCtrl.listLearners);
router.post('/:id/archive', SessionCtrl.archive);
module.exports = router;
