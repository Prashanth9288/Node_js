const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
  street: { type: String, required: [true, 'street is required'] },
  city: { type: String, required: [true, 'city is required'] },
  state: { type: String, required: [true, 'state is required'] },
  country: { type: String, default: 'India' },
  pincode: { type: String, required: [true, 'pincode is required'] }
}, { _id: true });
const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'name is required'] },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  age: { type: Number, min: [0, 'age cannot be negative'] },
  addresses: { type: [AddressSchema], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
