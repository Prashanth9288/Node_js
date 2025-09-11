const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('User & Address Management API is running');
});
connectDB().catch(err => {
  console.error('DB connection failed:', err);
  process.exit(1);
});
app.use('/users', userRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
