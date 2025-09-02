const path=require('path');

function getFileInfo(filePath){
  const fileName=path.basename(filePath);

  const extension=path.extname(filePath);

  const dirFull=path.dirname(filePath);

  const directory=path.basename(dirFull);

  return {fileName,extension,directory};
}

module.exports={getFileInfo};