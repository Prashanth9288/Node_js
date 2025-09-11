const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');

router.post('/add-profile', async (req, res) => {
  try {
    const { bio, socialMediaLinks, user } = req.body;

    if (!user) return res.status(400).json({ message: 'User id is required.' });

    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: 'User not found.' });

    const existing = await Profile.findOne({ user });
    if (existing) return res.status(409).json({ message: 'Profile for this user already exists.' });

    const profile = new Profile({ bio, socialMediaLinks, user });
    await profile.save();

    return res.status(201).json(profile);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Profile for this user already exists (unique constraint).' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', 'name email');
    return res.json(profiles);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
