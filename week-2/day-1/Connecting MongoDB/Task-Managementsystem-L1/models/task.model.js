const mongoose=require('mongoose');

const TaskSchema=new mongoose.Schema({
  title:{type:String,unique:true,trim:true},
  description:{type:String,trim:true},
  priority:{type:String},
  iscompleted:{type:Boolean,default:false},
  completionDate:const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true, trim: true },
    description: { type: String, trim: true },
    priority: { type: String },
    isCompleted: { type: Boolean, default: false },
    completionDate: { type: Date, default: null },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
{type:Date,default:null},
  dueDate:{type:Date,default:null},
},
{timestamps:true}
)

module.exports=mongoose.model('Task',TaskSchema);