'use strict';
var config = require('./config');
var program = require('commander');

// Handle command line usage.
program
  .allowUnknownOption()
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .usage('[options] <url>')
  .option('-r, --reporter <name>',       'specify the reporter to use', 'spec')
  .option('-f, --file <filename>',       'specify the file to dump reporter output')
  .option('-t, --timeout <timeout>',     'specify the test startup timeout to use', parseInt)
  .option('-g, --grep <pattern>',        'only run tests matching <pattern>')
  .option('-b, --bail',                  'exit on the first test failure', true)
  .option('-c, --cookies <Object>',      'electron cookie object')
  .option('-h, --header <name>=<value>', 'specify custom header', header)
  .option('-w, --window',                'show window', false);

  // Options taken from mocha-phantomjs that will not be supported yet.
  // .option('-i, --invert',                'invert --grep matches')
  // .option('-A, --agent <userAgent>',     'specify the user agent to use')
  // .option('-k, --hooks <path>',          'path to hooks module', resolveHooks)
  // .option('-s, --setting <key>=<value>', 'specify specific phantom settings', setting)
  // .option('-v, --view <width>x<height>', 'specify phantom viewport size', viewport)
  // .option('-C, --no-color',              'disable color escape codes')
  // .option('-p, --path <path>',           'path to PhantomJS binary')
  // .option('--ignore-resource-errors',    'ignore resource errors');
  // .option('-s, --silent', 'Silently swallow errors', false)
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
