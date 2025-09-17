const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../models/TokenBlacklist')
const User = require('../models/User')
const auth = async(req,res,next)=>{
  const token = req.headers['authorization']?.split(' ')[1]
  if(!token) return res.status(401).json({message:'Unauthorized'})
  const blacklisted = await TokenBlacklist.findOne({token})
  if(blacklisted) return res.status(401).json({message:'Token blacklisted'})
  try{
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  }catch{
    return res.status(401).json({message:'Invalid Token'})
  }
}
module.exports = auth
