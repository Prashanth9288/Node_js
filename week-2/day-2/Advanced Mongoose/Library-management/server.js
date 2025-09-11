require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Library API running' });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});
mongoose.connect(process.env.MONGO_URI).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}).catch(err => {
  console.error('Mongo connection failed:', err.message);
  process.exit(1);
});
