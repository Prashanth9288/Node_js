const express=require('express');

const router=express.Router();
const User=require('../models/User');

router.post('/add-user',async(req,res)=>{
  try{
    const {name,email}=req.body;
    if(!name || !email){
      return res.status(400).json({message:"Name and email are required"});
    }
    const user=new User({name,email}); 
    await user.save();
    return res.status(201).json(user);
  }catch(err){
    if(err.code===11000){
      return res.status(409).json({message:"Email already in use."});
    }
    return res.status(500).json({message:"server error",errror:err.message});
  }
})

module.exports=router;