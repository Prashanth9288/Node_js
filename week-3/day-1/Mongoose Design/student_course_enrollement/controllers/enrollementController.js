const mongoose = require('mongoose');
const Enrollment = require('../models/Enrollment');
const Student = require('../models/Student');
const Course = require('../models/Course');

exports.enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) return res.status(400).json({ message: 'studentId and courseId required' });

    if (!mongoose.Types.ObjectId.isValid(studentId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid id(s)' });
    }

    const student = await Student.findById(studentId);
    if (!student || !student.isActive) return res.status(400).json({ message: 'Student not found or inactive' });

    const course = await Course.findById(courseId);
    if (!course || !course.isActive) return res.status(400).json({ message: 'Course not found or inactive' });

    const existing = await Enrollment.findOne({ studentId, courseId, isActive: true });
    if (existing) return res.status(400).json({ message: 'Student already actively enrolled in this course' });

    const enrollment = await Enrollment.create({ studentId, courseId });
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(409).json({ message: 'Duplicate active enrollment' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
