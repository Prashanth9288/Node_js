const express=require("express");
const { default: mongoose } = require("mongoose");

const connectdb= async ()=>{
  try {
    await mongoose.connect(process.env.MONGOURI)
    console.log("connected to mongodb")
  } catch (error) {
    console.log("Failed to connect DB",error)
    process.exit(1)//incase of it should not connected to mongodb it will exit
  }

}
module.exports=connectdb;