const Library = require('../model/book');

const incompleteDataResponse = (res) =>
  res.status(400).json({ message: 'Incomplete Data', details: 'Required fields are missing' });

const validateAddBook = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) return incompleteDataResponse(res);
  next();
};

const validateBorrow = async (req, res, next) => {
  const { borrowerName } = req.body;
  if (!borrowerName) {
    return res.status(400).json({ message: 'Incomplete Data', details: 'borrowerName is required' });
  }
  next();
};

const borrowingLimit = async (req, res, next) => {
  try {
    const { borrowerName } = req.body;
    const count = await Library.countDocuments({ status: 'borrowed', borrowerName });
    if (count >= 3) {
      return res.status(409).json({ message: 'Borrowing limit exceeded', details: 'A user may not borrow more than 3 books at a time' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateAddBook,
  validateBorrow,
  borrowingLimit
};