const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL,
  JWT_SECRET
} = process.env;

router.get('/github', (req, res) => {
  const redirect = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(redirect);
});

router.get('/github/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code supplied');
  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code
      },
      { headers: { Accept: 'application/json' } }
    );
    const accessToken = tokenRes.data.access_token;
    if (!accessToken) return res.status(400).json({ error: 'No access token' });

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `token ${accessToken}` }
    });
    const emailsRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `token ${accessToken}` }
    });

    const profile = userRes.data;
    const emails = emailsRes.data || [];
    const primaryEmailObj = emails.find(e => e.primary) || emails[0];
    const email = profile.email || (primaryEmailObj && primaryEmailObj.email) || null;

    let dbUser = await User.findOne({ githubId: profile.id });
    if (!dbUser) {
      dbUser = await User.create({
        githubId: profile.id,
        username: profile.login,
        name: profile.name,
        email,
        avatarUrl: profile.avatar_url
      });
    } else {
      dbUser.username = profile.login;
      dbUser.name = profile.name;
      dbUser.email = email;
      dbUser.avatarUrl = profile.avatar_url;
      dbUser.updatedAt = new Date();
      await dbUser.save();
    }

    const token = jwt.sign(
      { userId: dbUser._id, githubId: dbUser.githubId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const accept = req.headers.accept || '';
    if (accept.includes('application/json')) {
      return res.json({ token, user: dbUser });
    }

    return res.redirect(`${FRONTEND_URL}/success.html?token=${token}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: 'GitHub OAuth failed' });
  }
});

module.exports = router;
