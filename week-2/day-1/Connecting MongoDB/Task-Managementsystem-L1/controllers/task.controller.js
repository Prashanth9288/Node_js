const Task = require('../models/task.model');

async function createTask(req, res) {
  try {
    const { title, description, priority, dueDate } = req.body;
    const existing = await Task.findOne({ title: title.trim() });
    if (existing) {
      return res.status(409).json({ message: 'Task with this title already exists' });
    }
    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null
    });
    await task.save();
    return res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Task with this title already exists' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function getTasks(req, res) {
  try {
    const filter = {};
    const { priority, status } = req.query;
    if (priority) filter.priority = priority;
    if (status === 'completed') filter.isCompleted = true;
    else if (status === 'pending') filter.isCompleted = false;
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json({ tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = {};
    const allowed = ['title', 'description', 'priority', 'isCompleted', 'dueDate'];
    for (const key of allowed) {
      if (req.body.hasOwnProperty(key)) updates[key] = req.body[key];
    }
    if (updates.hasOwnProperty('isCompleted')) {
      if (updates.isCompleted === true) updates.completionDate = new Date();
      else updates.completionDate = null;
    }
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    const updated = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    return res.json({ message: 'Task updated', task: updated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Task with this title already exists' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function deleteTasks(req, res) {
  try {
    const { priority } = req.query;
    if (!priority) {
      return res.status(400).json({ message: 'Please provide priority query parameter to delete tasks' });
    }
    const result = await Task.deleteMany({ priority });
    return res.json({ message: `Deleted ${result.deletedCount} task(s)` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { createTask, getTasks, updateTask, deleteTasks };
