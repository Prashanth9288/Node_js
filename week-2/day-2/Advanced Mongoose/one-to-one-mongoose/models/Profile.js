const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  bio: { type: String },
  socialMediaLinks: [{ type: String }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
