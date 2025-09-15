const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

enrollmentSchema.index({ studentId: 1, courseId: 1 }, {
  unique: true,
  partialFilterExpression: { isActive: true }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
