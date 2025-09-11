const User = require('../models/User');
exports.addUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    return res.status(201).json({ message: 'User created', user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};
exports.getUserRentals = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({ path: 'rentedBooks', select: 'title author genre' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};
