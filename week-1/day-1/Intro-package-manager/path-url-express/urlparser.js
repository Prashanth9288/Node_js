const {url}=require('url');

function parseFullUrl(fullUrl){
  const u=new URL(fullUrl);

  const hostname=u.hostname;
  const pathname=u.pathname;

  const query={};

  for(const [key,value] of u.searchParams){
    query[key]=value;
  }
  return {hostname,pathname,query};
}
module.exports={parseFullUrl};