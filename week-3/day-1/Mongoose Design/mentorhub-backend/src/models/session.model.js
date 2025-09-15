const mongoose = require('mongoose');
const { Schema } = mongoose;
const AttendeeSubSchema = new Schema({ learner: { type: Schema.Types.ObjectId, ref: 'Learner', required: true }, status: { type: String, enum: ['registered', 'attended', 'cancelled'], default: 'registered' }, attendedAt: { type: Date }, feedback: { type: String } }, { _id: false });
const SessionSchema = new Schema({ mentor: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true }, topic: { type: String, required: true }, description: { type: String }, startTime: { type: Date, required: true }, endTime: { type: Date }, notes: { type: String }, isActive: { type: Boolean, default: true }, isArchived: { type: Boolean, default: false }, attendees: { type: [AttendeeSubSchema], default: [] } }, { timestamps: true });
SessionSchema.index({ mentor: 1, startTime: 1 });
module.exports = mongoose.model('Session', SessionSchema);
