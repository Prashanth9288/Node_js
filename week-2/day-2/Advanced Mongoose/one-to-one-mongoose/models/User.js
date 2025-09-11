const mongoose=require("mongoose");

const {Schema}=mongoose;

const userSchema=new Schema({
  name:{type:String,required:true,minlength:3},
  email:{type:String,required:true,unique:true,trim:true,lowercase:true}
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);