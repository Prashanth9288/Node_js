const mongoose = require('mongoose')
const subscriptionSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  plan: {type:String, enum:['free','premium','pro'], default:'free'},
  startDate: Date,
  expiryDate: Date
})
module.exports = mongoose.model('Subscription', subscriptionSchema)
