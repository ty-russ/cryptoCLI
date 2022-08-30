#!/usr/bin/env node

const { spawn } = require("child_process");

function command(cmd) {
  const child = spawn(cmd);
  //count number of lines
  const wc = spawn("wc", ["-l"]);
  //take child output as wc input
  child.stdout.pipe(wc.stdin);

  child.stdout.on("data", (data) => {
    console.log(`${data}`);
  });

  wc.stdout.on("data", (data) => {
    console.log(`Total = ${data}`);
  });
  return;
}

command("ls");
