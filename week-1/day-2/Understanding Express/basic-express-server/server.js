const express=require("express");

const app=express();

const PORT=process.env.PORT || 3000;

app.use(express.json());

app.get("/home",(req,res)=>{
  res.status(200).send("<h1>Welcome to Home Page </h1>");
})

app.get("/aboutus",(req,res)=>{
  res.status(200).json({message:"Welcome to About us"});
})

app.get("/contactus",(req,res)=>{
  const contact={
    phone:"+91 987654321",
    email:"contact@example.com",
    address:"123 main Street, Anytown"
  };
  res.status(200).json(contact);
});

app.use((req,res)=>{
  res.status(404).send("404 Not Found");
})

app.use((err,req,res,next)=>{
  console.error("Server error:",err);
  res.status(500).json({error:"Internal Server Error"});
})

app.listen(PORT,()=>{
  console.log(`server is running at http://localhost:${PORT}`);

})