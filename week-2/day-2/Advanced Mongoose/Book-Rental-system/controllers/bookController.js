const Book = require('../models/Book');
const User = require('../models/User');
exports.addBook = async (req, res, next) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    return res.status(201).json({ message: 'Book created', book });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};
exports.updateBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const updated = await Book.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    return res.json({ message: 'Book updated', book: updated });
  } catch (err) {
    next(err);
  }
};
exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await User.updateMany({ rentedBooks: bookId }, { $pull: { rentedBooks: bookId } });
    return res.json({ message: 'Book deleted and references removed' });
  } catch (err) {
    next(err);
  }
};
exports.rentBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) return res.status(400).json({ error: 'userId and bookId required' });
    const user = await User.findById(userId);
    const book = await Book.findById(bookId);
    if (!user || !book) return res.status(404).json({ error: 'User or Book not found' });
    if (!user.rentedBooks.some(id => id.toString() === bookId)) {
      user.rentedBooks.push(bookId);
      await user.save();
    }
    if (!book.rentedBy.some(id => id.toString() === userId)) {
      book.rentedBy.push(userId);
      await book.save();
    }
    return res.json({ message: 'Book rented', user, book });
  } catch (err) {
    next(err);
  }
};
exports.returnBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) return res.status(400).json({ error: 'userId and bookId required' });
    const user = await User.findByIdAndUpdate(userId, { $pull: { rentedBooks: bookId } }, { new: true });
    const book = await Book.findByIdAndUpdate(bookId, { $pull: { rentedBy: userId } }, { new: true });
    if (!user || !book) return res.status(404).json({ error: 'User or Book not found' });
    return res.json({ message: 'Book returned', user, book });
  } catch (err) {
    next(err);
  }
};
exports.getBookRenters = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate('rentedBy', 'name email');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    return res.json({ book });
  } catch (err) {
    next(err);
  }
};
