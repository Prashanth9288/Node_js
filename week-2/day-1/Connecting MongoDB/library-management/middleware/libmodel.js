const incompletedatares=(res)=>
  res.status(400).json({message:"Incomplete data",detainls:"req fields af missing "})







const validateBook=(req,res,next)=>{
  const {title,author}=req.body()
  if(!title || !author){
    return incompletedatares(res)
  }
}


module.exports ={
  validateBook
}