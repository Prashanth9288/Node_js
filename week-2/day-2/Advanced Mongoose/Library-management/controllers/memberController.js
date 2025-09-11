const Member = require('../models/Member');
exports.addMember = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const member = await Member.create({ name, email });
    res.status(201).json({ message: 'Member created', member });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};
exports.getMemberBorrowedBooks = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId).populate({ path: 'borrowedBooks', select: 'title author status' });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ member });
  } catch (err) {
    next(err);
  }
};
