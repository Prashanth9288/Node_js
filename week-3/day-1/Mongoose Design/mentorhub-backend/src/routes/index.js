const express = require('express');
const router = express.Router();
router.use('/mentors', require('./mentors.routes'));
router.use('/learners', require('./learners.routes'));
router.use('/sessions', require('./sessions.routes'));
module.exports = router;
