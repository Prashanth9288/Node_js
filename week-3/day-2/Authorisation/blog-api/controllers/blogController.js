const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user._id });
  res.json(blogs);
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true }
  );
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
};

exports.getStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const blogsPerUser = await Blog.aggregate([
      { $group: { _id: '$createdBy', count: { $sum: 1 } } }
    ]);
    const commonTags = await Blog.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json({ totalBlogs, blogsPerUser, commonTags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
