const mongoose = require('mongoose');
const { Schema } = mongoose;
const LearnerSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, profile: { type: String }, isActive: { type: Boolean, default: true } }, { timestamps: true });
module.exports = mongoose.model('Learner', LearnerSchema);
