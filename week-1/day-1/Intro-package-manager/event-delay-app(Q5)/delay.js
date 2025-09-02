function delayMessage(message,time){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve(message);
    },time);
  });
}
module.exports=delayMessage;