require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

connectDB().catch(err => {
  console.error('DB connection failed:', err);
  process.exit(1);
});

app.use('/api', authRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
