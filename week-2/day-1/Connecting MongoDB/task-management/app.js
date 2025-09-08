require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TaskDB';

(async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(' Connected to MongoDB');
  } catch (err) {
    console.error(' MongoDB connection error:', err);
    process.exit(1);
  }
})();

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({ title, description, status, dueDate });
    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const { status, dueBefore, dueAfter } = req.query;
    const query = {};
    if (status) query.status = status;
    if (dueBefore || dueAfter) {
      query.dueDate = {};
      if (dueBefore) query.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) query.dueDate.$gte = new Date(dueAfter);
    }
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    return res.json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid task id' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const update = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    return res.json(task);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    return res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: 'Invalid task id' });
  }
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
