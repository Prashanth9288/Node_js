const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const memberSchema = new Schema({
  name: { type: String, required: [true, 'Name required'], minlength: [3, 'Name must be at least 3 characters'] },
  email: { type: String, required: [true, 'Email required'], unique: true, match: [/^\S+@\S+\.\S+$/, 'Enter a valid email'] },
  borrowedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
}, { timestamps: true });
memberSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});
module.exports = mongoose.model('Member', memberSchema);
