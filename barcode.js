const fs = require('fs');
// const readline = require("readline");
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// let count = 1;

// rl
// .on("line", function(line) {
//   console.log(`${count++} : ${line}`);
// }).on("close", function() {
//   process.exit();
// });

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) =>{
  process.stdout.write('data : ' + chunk);
});
