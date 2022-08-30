#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
  .usage("Usage: -n <name>")
  .option("n", {
    alias: "name",
    describe: "Your name",
    type: "string",
    demandOption: true,
  })
  .option("m", {
    alias: "morning",
    describe: "Morning Greeting",
    type: "string",
  }).argv;

const greeting = `Hello, ${options.name}!`;

console.log(greeting);

if (options.morning) {
  console.log(`Good Morning to you too!`);
} else {
  console.log("Nice Time");
}


