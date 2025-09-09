const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Task Management API - working root endpoint' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
