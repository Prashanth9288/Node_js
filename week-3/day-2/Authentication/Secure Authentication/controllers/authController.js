const bcrypt = require('bcryptjs')
const User = require('../models/User')
const TokenBlacklist = require('../models/TokenBlacklist')
const {createTokens} = require('../utils/jwt')
const jwt = require('jsonwebtoken')
exports.signup = async(req,res)=>{
  const {username,email,password} = req.body
  const hashed = await bcrypt.hash(password,10)
  const user = await User.create({username,email,password:hashed})
  res.json({message:'User created'})
}
exports.login = async(req,res)=>{
  const {email,password} = req.body
  const user = await User.findOne({email})
  if(!user) return res.status(400).json({message:'Invalid'})
  const match = await bcrypt.compare(password,user.password)
  if(!match) return res.status(400).json({message:'Invalid'})
  const tokens = createTokens(user)
  res.json(tokens)
}
exports.logout = async(req,res)=>{
  const token = req.headers['authorization']?.split(' ')[1]
  const refreshToken = req.body.refreshToken
  if(token) await TokenBlacklist.create({token, expiry: new Date(Date.now()+15*60000)})
  if(refreshToken) await TokenBlacklist.create({token:refreshToken, expiry: new Date(Date.now()+7*24*60*60000)})
  res.json({message:'Logged out'})
}
exports.refresh = async(req,res)=>{
  const {refreshToken} = req.body
  if(!refreshToken) return res.status(401).json({message:'No token'})
  const blacklisted = await TokenBlacklist.findOne({token:refreshToken})
  if(blacklisted) return res.status(401).json({message:'Blacklisted'})
  try{
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
    const user = await User.findById(decoded.id)
    const tokens = createTokens(user)
    res.json(tokens)
  }catch{
    res.status(401).json({message:'Invalid'})
  }
}
