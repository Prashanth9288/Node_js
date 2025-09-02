const factorial=require("./factorial");

const numbers=[5,7,10,-3,"abc",0];

numbers.forEach(num=>{
  const result=factorial(num);
  console.log(`Factorial of ${num} is : ${result}`)
})