const express=require("express");

const bookRouter=express.Router();

bookRouter.post("/create",async(req,res)=>{
  try {
    const {title,author}=req.body
    const book=new lin
  } catch (error) {
    res.status(500).json({error:"Internal sever Error"})
  }
})