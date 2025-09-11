const Book = require('../models/Book');
const Member = require('../models/Member');
exports.addBook = async (req, res, next) => {
  try {
    const { title, author } = req.body;
    const book = await Book.create({ title, author });
    res.status(201).json({ message: 'Book created', book });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    next(err);
  }
};
exports.borrowBook = async (req, res, next) => {
  try {
    const { memberId, bookId } = req.body;
    if (!memberId || !bookId) return res.status(400).json({ error: 'memberId and bookId required' });
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);
    if (!member || !book) return res.status(404).json({ error: 'Member or Book not found' });
    if (member.borrowedBooks.some(id => id.toString() === bookId)) {
      return res.status(400).json({ error: 'Member already borrowed this book' });
    }
    member.borrowedBooks.push(book._id);
    book.borrowers.push(member._id);
    await member.save();
    await book.save();
    res.json({ message: 'Book borrowed', member, book });
  } catch (err) {
    next(err);
  }
};
exports.returnBook = async (req, res, next) => {
  try {
    const { memberId, bookId } = req.body;
    if (!memberId || !bookId) return res.status(400).json({ error: 'memberId and bookId required' });
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);
    if (!member || !book) return res.status(404).json({ error: 'Member or Book not found' });
    member.borrowedBooks = member.borrowedBooks.filter(id => id.toString() !== bookId);
    book.borrowers = book.borrowers.filter(id => id.toString() !== memberId);
    await member.save();
    await book.save();
    res.json({ message: 'Book returned', member, book });
  } catch (err) {
    next(err);
  }
};
exports.getBookBorrowers = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId).populate({ path: 'borrowers', select: 'name email' });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ book });
  } catch (err) {
    next(err);
  }
};
exports.updateBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const updates = req.body;
    const updated = await Book.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated', book: updated });
  } catch (err) {
    next(err);
  }
};
exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findByIdAndDelete(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};
