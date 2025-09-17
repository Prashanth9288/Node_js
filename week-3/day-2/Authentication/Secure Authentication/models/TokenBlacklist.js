const mongoose = require('mongoose')
const tokenBlacklistSchema = new mongoose.Schema({
  token: String,
  expiry: Date
})
module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema)
