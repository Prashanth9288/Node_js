const Content = require('../models/Content')
exports.getFree = async(req,res)=>{
  const data = await Content.find({type:'free'})
  res.json(data)
}
exports.getPremium = async(req,res)=>{
  const sub = await req.user.populate('subscription')
  if(!sub.subscription || !['premium','pro'].includes(sub.subscription.plan)) return res.status(403).json({message:'Forbidden'})
  const data = await Content.find({type:'premium'})
  res.json(data)
}
exports.create = async(req,res)=>{
  const {title, body, type} = req.body
  const content = await Content.create({title, body, type})
  res.json(content)
}
exports.delete = async(req,res)=>{
  await Content.findByIdAndDelete(req.params.id)
  res.json({message:'Deleted'})
}
