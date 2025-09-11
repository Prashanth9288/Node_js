const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3
    },
    author: {
      type: String,
      required: true
    },
    genre: {
      type: String
    },
    rentedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);
module.exports = mongoose.model('Book', bookSchema);
