require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/vehicles', vehicleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
