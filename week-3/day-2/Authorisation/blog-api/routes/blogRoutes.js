const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBlog,
  getBlogs,
  updateBlog,
  deleteBlog,
  getStats
} = require('../controllers/blogController');

router.post('/', auth, createBlog);
router.get('/', auth, getBlogs);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.get('/stats', auth, getStats);

module.exports = router;
