module.exports = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const key in err.errors) {
      errors[key] = err.errors[key].message;
    }
    return res.status(400).json({ message: 'Validation Error', errors });
  }
  if (err.code && err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error', keyValue: err.keyValue });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
};
