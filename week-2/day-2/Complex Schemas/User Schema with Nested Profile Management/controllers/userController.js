const User = require('../models/User');

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email already exists" });
    next(err);
  }
};

exports.addProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { profileName, url } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.profiles.some(p => p.profileName === profileName)) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }
    user.profiles.push({ profileName, url });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { profile } = req.query;
    let query = {};
    if (profile) query = { "profiles.profileName": profile };
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { name, profile } = req.query;
    const user = await User.findOne({ name });
    if (!user) return res.status(404).json({ message: "User not found" });
    const foundProfile = user.profiles.find(p => p.profileName === profile);
    if (foundProfile) return res.json(foundProfile);
    res.json({ message: "User found, but profile not found", user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;
    const { url } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const profile = user.profiles.find(p => p.profileName === profileName);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    profile.url = url;
    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const { userId, profileName } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const index = user.profiles.findIndex(p => p.profileName === profileName);
    if (index === -1) return res.status(404).json({ message: "Profile not found" });
    user.profiles.splice(index, 1);
    await user.save();
    res.json({ message: "Profile deleted", user });
  } catch (err) {
    next(err);
  }
};
