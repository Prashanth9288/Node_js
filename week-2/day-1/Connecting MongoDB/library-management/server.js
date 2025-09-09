

const express=require("express")
const dotenv=require("dotenv")
const connectdb = require("./config/db")
dotenv.config()
const app=express();

app.use(express.json());
connectdb()
const PORT=process.env.PORT
app.listen(PORT, ()=>{
  console.log(`Server running on ${PORT}`)

})