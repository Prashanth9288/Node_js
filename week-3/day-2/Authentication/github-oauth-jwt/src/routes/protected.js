const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/profile', auth, (req, res) => {
  const { githubId, username, name, email, avatarUrl, createdAt } = req.user;
  res.json({ githubId, username, name, email, avatarUrl, createdAt });
});

module.exports = router;
