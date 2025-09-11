const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema({
  title: { type: String, required: [true, 'Title required'], minlength: [3, 'Title must be at least 3 characters'] },
  author: { type: String, required: [true, 'Author required'] },
  status: { type: String, enum: ['available', 'borrowed'], required: true, default: 'available' },
  borrowers: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
  createdAt: { type: Date, default: Date.now }
});
bookSchema.pre('save', function (next) {
  if (this.borrowers && this.borrowers.length > 0) {
    this.status = 'borrowed';
  } else {
    this.status = 'available';
  }
  next();
});
bookSchema.pre('findOneAndDelete', async function (next) {
  const query = this.getQuery();
  const doc = await this.model.findOne(query);
  if (doc) {
    const Member = mongoose.model('Member');
    await Member.updateMany({ borrowedBooks: doc._id }, { $pull: { borrowedBooks: doc._id } });
  }
  next();
});
module.exports = mongoose.model('Book', bookSchema);
