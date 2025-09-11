require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});
mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
