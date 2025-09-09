const allowedPriorities = ['low', 'medium', 'high'];

function validateCreateTask(req, res, next) {
  const { title, description, priority } = req.body;
  if (!title || !description || !priority) {
    return res.status(400).json({ message: 'Incomplete Data Received' });
  }
  if (typeof priority !== 'string' || !allowedPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Invalid priority — allowed values: 'low', 'medium', 'high'"
    });
  }
  next();
}

function validateUpdateTask(req, res, next) {
  const allowedFields = ['title', 'description', 'priority', 'isCompleted', 'dueDate'];
  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.length === 0) {
    return res.status(400).json({ message: 'Incomplete Data Received' });
  }
  const invalidField = bodyKeys.find((k) => !allowedFields.includes(k));
  if (invalidField) {
    return res.status(400).json({ message: `Invalid field in update: ${invalidField}` });
  }
  if (req.body.priority) {
    if (typeof req.body.priority !== 'string' || !allowedPriorities.includes(req.body.priority)) {
      return res.status(400).json({
        message: "Invalid priority — allowed values: 'low', 'medium', 'high'"
      });
    }
  }
  if (req.body.hasOwnProperty('isCompleted') && typeof req.body.isCompleted !== 'boolean') {
    return res.status(400).json({ message: 'isCompleted must be a boolean' });
  }
  next();
}

module.exports = { validateCreateTask, validateUpdateTask };
