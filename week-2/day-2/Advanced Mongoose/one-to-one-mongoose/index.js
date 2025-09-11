const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oneToOneDemo';

mongoose.connect(MONGO_URI)

  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });

app.use('/api', userRoutes);
app.use('/api', profileRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
