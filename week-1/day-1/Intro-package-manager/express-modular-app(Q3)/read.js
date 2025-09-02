const fs=require('fs').promises;

const path=require('path');

const dataFilePath=path.join(__dirname,'Data.txt');

async function readDataFile() {
  const content = await fs.readFile(dataFilePath,'utf-8');
  return content;
}

module.exports={readDataFile};