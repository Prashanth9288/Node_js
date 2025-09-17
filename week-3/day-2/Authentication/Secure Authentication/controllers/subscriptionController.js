const Subscription = require('../models/Subscription')
const User = require('../models/User')
exports.subscribe = async(req,res)=>{
  const {plan} = req.body
  const start = new Date()
  const expiry = new Date()
  expiry.setDate(expiry.getDate()+30)
  const sub = await Subscription.create({user:req.user._id, plan, startDate:start, expiryDate:expiry})
  req.user.subscription = sub._id
  await req.user.save()
  res.json({message:'Subscribed', subscription:sub})
}
exports.status = async(req,res)=>{
  const sub = await Subscription.findById(req.user.subscription)
  if(!sub) return res.json({plan:'free', valid:true})
  const valid = sub.expiryDate>new Date()
  if(!valid){
    sub.plan='free'
    await sub.save()
  }
  res.json({plan:sub.plan, valid})
}
exports.renew = async(req,res)=>{
  const sub = await Subscription.findById(req.user.subscription)
  if(!sub) return res.status(400).json({message:'No subscription'})
  const expiry = new Date(sub.expiryDate)
  expiry.setDate(expiry.getDate()+30)
  sub.expiryDate = expiry
  await sub.save()
  res.json({message:'Renewed', subscription:sub})
}
exports.cancel = async(req,res)=>{
  const sub = await Subscription.findById(req.user.subscription)
  if(sub){
    sub.plan='free'
    sub.expiryDate=new Date()
    await sub.save()
  }
  res.json({message:'Cancelled'})
}
