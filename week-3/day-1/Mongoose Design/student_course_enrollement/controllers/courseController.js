const mongoose = require('mongoose');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const course = await Course.create({ title, description });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.softDeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid course id' });

    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (!course.isActive) return res.status(400).json({ message: 'Course already inactive' });

    course.isActive = false;
    await course.save();

    await Enrollment.updateMany(
      { courseId: id, isActive: true },
      { $set: { isActive: false } }
    );

    res.json({ message: 'Course soft-deleted and enrollments marked inactive' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid course id' });

    const course = await Course.findById(id);
    if (!course || !course.isActive) return res.status(404).json({ message: 'Active course not found' });

    const enrollments = await Enrollment.find({ courseId: id, isActive: true }).populate('studentId');

    const activeStudents = enrollments
      .map(e => e.studentId)
      .filter(s => s && s.isActive)
      .map(s => ({ id: s._id, name: s.name, email: s.email }));

    res.json({ courseId: id, students: activeStudents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
