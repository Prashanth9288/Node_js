const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/token');

async function signup(req, res, next) {
  try {
    const { username, email, password, role, adminKey } = req.body;
    let userRole = 'user';
    if (role === 'admin') {
      if (adminKey && adminKey === process.env.ADMIN_SIGNUP_KEY) {
        userRole = 'admin';
      } else {
        return res.status(403).json({ message: 'Admin creation requires ADMIN_SIGNUP_KEY' });
      }
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role: userRole });
    await user.save();
    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshTokens.push(refreshToken);
    await user.save();
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
}

async function refreshTokenHandler(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    const user = await User.findById(payload.userId);
    if (!user) return res.status(403).json({ message: 'User not found' });
    if (!user.refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ message: 'Refresh token revoked' });
    }
    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    user.refreshTokens.push(newRefreshToken);
    await user.save();
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
    let payload;
    try {
      payload = jwt.decode(refreshToken);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid token' });
    }
    const user = await User.findById(payload.userId);
    if (!user) return res.status(200).json({ message: 'Logged out' });
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    await user.save();
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, login, refreshTokenHandler, logout };
