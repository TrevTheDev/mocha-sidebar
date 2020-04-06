"use strict";

const CustomReporter = require("./customreporterInProcess"),
  Mocha = require("mocha");

const args = JSON.parse(process.argv[process.argv.length - 1]),
  options = args.options;

for (let file of args.requires) require(file);

if (Object.keys(options || {}).length) {
  console.log(`Applying Mocha options:\n${indent(JSON.stringify(options, null, 2))}`);
} else {
  console.log(`No Mocha options are configured. You can set it under File > Preferences > Workspace Settings.`);
}

const mocha = new Mocha(options);

console.log();
console.log("Test file(s):");

args.files.forEach((file) => {
  console.log(`  ${file}`);
  mocha.addFile(file);
});

const grep = args.grep;

if (grep) {
  console.log();
  console.log("Grep pattern:");
  console.log("  " + grep);

  mocha.grep(new RegExp(grep, "i"));
}

mocha.reporter(CustomReporter);

mocha.run();

function indent(lines) {
  return lines
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}
