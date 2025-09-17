const mongoose = require('mongoose')
const contentSchema = new mongoose.Schema({
  title: String,
  body: String,
  type: {type:String, enum:['free','premium']}
})
module.exports = mongoose.model('Content', contentSchema)
