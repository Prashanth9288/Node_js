const boxen=require("boxen");

const message='I am using my first external module!';

const title="Hurray!!!";

const classicBox=boxen(message,{
  title:title,
  titleAlignment:'center',
  borderStyle:'classic',
  padding:0
});
const singleDobleBox=boxen(message,{
  title,
  titleAlignment:'center',
  borderStyle:'singleDouble'
});

const roundBox=boxen(message,{
  title,
  titleAlignment:'center',
  borderStyle:'round',
  padding:1,
  backgroundColor:'cyan'
});

const coloredBox = boxen(message, {
  title,
  titleAlignment: 'center',
  borderStyle: 'round',
  padding: 1,
  backgroundColor: 'cyan'
});
console.log(classicBox)

console.log("\n");
console.log(singleDobleBox);

console.log('\n');

console.log(roundBox);

console.log('\n')

console.log(coloredBox)