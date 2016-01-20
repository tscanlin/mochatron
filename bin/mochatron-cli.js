'use strict';
var program = require('commander');
var mochatron = require('./mochatron.js');
var path = require('path');
var fs = require('fs');
var cookies = {};
var headers = {};
// var settings = {}; // unused for now.

function keyValue(val, store) {
  val = val.split('=');
  var key = val.shift();
  val = val.join('=');
  if (val === 'true') {
    val = true;
  } else if (val === 'false') {
    val = false;
  }
  store[key] = val;
  return store;
}

function header(val) {
  return keyValue(val, headers);
}

function cookie(val) {
  return keyValue(val, cookies);
}

function setting(val) {
  return keyValue(val, settings);
}

// Handle command line usage.
program
  .allowUnknownOption()
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options] <url>')
  .option('-R, --reporter <name>',       'specify the reporter to use', 'spec')
  .option('-g, --grep <pattern>',        'only run tests matching <pattern>')
  .option('-t, --timeout <timeout>',     'specify the test startup timeout to use', parseInt)
  .option('-i, --invert',                'invert --grep matches')
  .option('-b, --bail',                  'exit on the first test failure', true)
  .option('-c, --cookie <name>=<value>', 'specify cookie name and value', cookie)
  .option('-k, --hooks <path>',          'path to hooks module')
  .option('-h, --header <name>=<value>', 'specify custom header', header)
  .option('-f, --file <filename>',       'specify the file to dump reporter output')
  .option('-A, --agent <userAgent>',     'specify the user agent to use')
  .option('-w, --window',                'show window', false);

  // Options taken from mocha-phantomjs that are not supported yet.
  // .option('-s, --setting <key>=<value>', 'specify specific electron settings', setting)
  // .option('-v, --view <width>x<height>', 'specify phantom viewport size', viewport)
  // .option('-C, --no-color',              'disable color escape codes')
  // .option('-p, --path <path>',           'path to PhantomJS binary')
  // .option('--ignore-resource-errors',    'ignore resource errors');
  // .parse(process.argv);

program.on('--help', function() {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ mochatron http://example.com/test/index.html');
  console.log('    $ mochatron -r dot test/index.html');
  console.log('');
});

program.parse(process.argv);

if (!program.args.length) { program.outputHelp(); process.exit(1); };

mochatron(program);
