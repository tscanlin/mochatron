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

function viewport(val) {
  val = val.split('x');
  return {
    width: parseFloat(val[0]),
    height: parseFloat(val[1])
  };
}

// Handle command line usage.
program
  .allowUnknownOption()
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options] <url>')
  .option('-h, --help',                  'output usage information')
  .option('-d, --debug',                 'output helpful debugging information')
  .option('-V, --version',               'output the version number')
  .option('-R, --reporter <name>',       'specify the reporter to use', 'spec')
  .option('-f, --file <filename>',       'specify the file to dump reporter output')
  .option('-t, --timeout <timeout>',     'specify the test startup timeout to use', parseInt)
  .option('-l, --load-timeout <timeout>','load timeout before the browser window opens so DevTools can load', parseInt)
  .option('-g, --grep <pattern>',        'only run tests matching <pattern>')
  .option('-i, --invert',                'invert --grep matches')
  .option('-b, --bail',                  'exit on the first test failure')
  .option('-A, --agent <userAgent>',     'specify the user agent to use')
  .option('-c, --cookie <name>=<value>', 'specify cookie name and value', cookie)
  .option('-h, --header <name>=<value>', 'specify custom header', header)
  .option('-k, --hooks <path>',          'path to hooks module')
  .option('-v, --view <width>x<height>', 'specify electron window size', viewport)
  .option('-p, --path <path>',           'path to the electron binary')
  .option('-q, --quit',                  'quit once tests finish.')
  .option('-w, --window',                'show window');
  // .option('-s, --setting <key>=<value>', 'specify specific electron settings', setting)
  // .option('--ignore-resource-errors',    'ignore resource errors');

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
