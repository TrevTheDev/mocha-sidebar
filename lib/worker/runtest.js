'use strict';

const fs = require('fs');

const path = require('path');

const args = JSON.parse(process.argv[process.argv.length - 1]);
const options = args.options;
const Mocha = require(args.mochaPath);
const CustomReporter = require('./customreporter');
const reporter = CustomReporter.init(args.mochaPath);
module.paths.push(args.rootPath, path.join(args.rootPath, 'node_modules'));
for (let file of args.requires) {
  // let pt = `${args.rootPath}/node_modules/${file}`;
  const abs = fs.existsSync(file) || fs.existsSync(file + '.js') || fs.existsSync(file + '.mjs');
  if (abs) file = path.resolve(file);

  require(file);
}
if (Object.keys(options || {}).length) {
  console.log(`Applying Mocha options:\n${indent(JSON.stringify(options, null, 2))}`);
} else {
  console.log(
    `No Mocha options are configured. You can set it under File > Preferences > Workspace Settings.`
  );
}

const mocha = new Mocha(options);

console.log();
console.log('Test file(s):');

args.files.forEach(file => {
  console.log(`  ${file}`);
  mocha.addFile(file);
});

const grep = args.grep;

if (grep) {
  console.log();
  console.log('Grep pattern:');
  console.log('  ' + grep);

  mocha.grep(new RegExp(grep, 'i'));
}

mocha.reporter(reporter);

mocha
  .loadFilesAsync()
  .then(() => {
    mocha.run(failures => {
      console.log('------------------------------------');
      console.log(`finish failure amount:${failures}`);
      console.log('------------------------------------');
      process.exit(0);
    });
  })
  .catch(() => (process.exitCode = 1));

function indent(lines) {
  return lines
    .split('\n')
    .map(line => `  ${line}`)
    .join('\n');
}
