const express=require('express');

const {getFileInfo}=require('./fileinfo');
const {parseFullUrl}=require('./urlparser');

const app=express();

const PORT=process.env.PORT || 3000;

app.get('/test',(req,res)=>{
  res.send("Test route is working")
})

app.get('/fileinfo',(req,res)=>{
  const {filepath}=req.query;

  if(!filepath){
    return res.status(400).json({
      error:'Missing "filepath" query parameter. Example: /fileinfo?filepath=folder/sample.text'
    });
  }

  try{
    const info=getFileInfo(filepath);
    return res.json(info);
  }catch(err){
    console.error('fileinfo error:',err);
    return res.status(400).json({error:'Invalid filepath provided'});
  }
});

app.get('/parseurl',(req,res)=>{
  const {url}=req.query;

  if(!url){
    return res.status(400).json({
      error:'Missing "url" query parameter. Example:/parseurl?url=https%3A%2F%2Fexample.com%2Fpath%3Fa%3D1%26b%3D2'
    });
  }
  try{
    const parts=parseFullUrl(url);
    return res.json(parts);
  }catch(err){
    console.error('parseurl error:',err);
    return res.status(400).json({
      error:'Missing "url" query parameter. Example: /parseurl?url=https%3A%2F%2Fexample.com%2Fpath%3Fa%3D1%26b%3D2'
    });
  }
  try{
    const parts=parseFullUrl(url);
    return res.json(parts);
  }catch(err){
    console.error('parseurl error:',err);
    return res.status(400).json({
      error:'Invalid URL provided. Ensure it includes protocol (e.g., https://...) and is URL-encoded.'
    });
  }
});

app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
})