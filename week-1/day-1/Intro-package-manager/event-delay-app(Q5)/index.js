const express=require('express');

const logger=require('./eventLogger');

const delayMessage=require('./delay');

const app=express();
const PORT=3000;

app.get('/test',(req,res)=>{
  res.send('Test route is working!');
});

app.get('/emit',(req,res)=>{
  const {message}=req.query;
  if(!message){
    return res.status(400).json({error:'Missing message parameter'});
  }
  logger.emit('log',message);
  res.json({
    status:'Event logged',
    timestamp:new Data().toISOString()
  });
});

app.get('/delay',async(req,res)=>{
  const {message,time}=req.query;
  const delayTime=parseInt(time);

  if(!message || isNaN(delayTime)){
    return res.status(400).json({error:"Missing or Invalid parameters"});
  }
  const result=await delayMessage(message,delayTime);

  res.json({
    message:result,
    delay:`${delayTime}ms`
  });
});

app.listen(PORT,()=>{
  console.log(`server running on http://localhost:${PORT}`);
})