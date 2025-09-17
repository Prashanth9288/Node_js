const Note = require('../models/Note');

exports.createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.create({ title, content, createdBy: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { title, content },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
