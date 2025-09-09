const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const { validateCreateTask, validateUpdateTask } = require('../middleware/task.middleware');

router.post('/tasks', validateCreateTask, controller.createTask);
router.get('/tasks', controller.getTasks);
router.patch('/tasks/:id', validateUpdateTask, controller.updateTask);
router.delete('/tasks', controller.deleteTasks);

module.exports = router;
