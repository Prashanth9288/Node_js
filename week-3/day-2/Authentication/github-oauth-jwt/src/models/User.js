const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: Number, required: true, unique: true },
  username: { type: String },
  name: { type: String },
  email: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
