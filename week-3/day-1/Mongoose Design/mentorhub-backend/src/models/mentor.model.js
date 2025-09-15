const mongoose = require('mongoose');
const { Schema } = mongoose;
const MentorSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, bio: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
module.exports = mongoose.model('Mentor', MentorSchema);
