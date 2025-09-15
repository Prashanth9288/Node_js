const mongoose = require('mongoose');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');

exports.createStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'name and email required' });

    const student = await Student.create({ name, email });
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.softDeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid student id' });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!student.isActive) return res.status(400).json({ message: 'Student already inactive' });

    student.isActive = false;
    await student.save();

    await Enrollment.updateMany(
      { studentId: id, isActive: true },
      { $set: { isActive: false } }
    );

    res.json({ message: 'Student soft-deleted and enrollments marked inactive' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid student id' });

    const student = await Student.findById(id);
    if (!student || !student.isActive) return res.status(404).json({ message: 'Active student not found' });

    const enrollments = await Enrollment.find({ studentId: id, isActive: true }).populate('courseId');

    const activeCourses = enrollments
      .map(e => e.courseId)
      .filter(c => c && c.isActive)
      .map(c => ({ id: c._id, title: c.title, description: c.description }));

    res.json({ studentId: id, courses: activeCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
