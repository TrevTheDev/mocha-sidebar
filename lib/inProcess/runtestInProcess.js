"use strict";

const CustomReporter = require("./customreporterInProcess"),
  Mocha = require("mocha");

const runTests = (params) => {
  for (let param of params.requires) require(param);

  if (Object.keys(params.options || {}).length) console.log(`Applying Mocha options:\n${indent(JSON.stringify(params.options, null, 2))}`);
  else console.log(`No Mocha options are configured. You can set it under File > Preferences > Workspace Settings.`);

  const mocha = new Mocha(params.options);

  console.log();
  console.log("Test file(s):");

  params.files.forEach((file) => {
    console.log(`  ${file}`);
    mocha.addFile(file);
  });

  const grep = params.grep;

  if (grep) {
    console.log();
    console.log("Grep pattern:");
    console.log("  " + grep);

    mocha.grep(new RegExp(grep, "i"));
  }

  mocha.reporter(CustomReporter);

  mocha.run();
};

function indent(lines) {
  return lines
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

module.exports = runTests;
