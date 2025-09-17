const jwt = require('jsonwebtoken');

function createAccessToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { createAccessToken, createRefreshToken };
