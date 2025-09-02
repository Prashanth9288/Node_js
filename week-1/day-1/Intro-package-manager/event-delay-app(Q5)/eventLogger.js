const EventEmitter=require('events');

const fs=require('fs');
const path=require('path');

class Logger extends EventEmitter{}
const logger=new Logger();

logger.on('log',(message)=>{
  const timestamp=new Data().toISOString();
  const logEntry=`${timestamp} - ${message}\n`;
  console.log(logEntry);

  fs.appendFile(path.join(__dirname,'logs.txt'),logEntry,(err)=>{
    if(err) console.error('Failed to write log',err);
  });
});

module.exports=logger;