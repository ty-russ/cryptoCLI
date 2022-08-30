#!/usr/bin/env node
var arguments = process.argv;

//console.log(arguments);

if (!arguments[2]) {
  return console.error("Altleast two arguments required to perform addition");
}

function add(a, b) {
  return parseInt(a) + parseInt(b);
}

var sum = add(arguments[2], arguments[3]);

console.log(`Sum of ${arguments[2]} , ${arguments[3]} is `, sum);
