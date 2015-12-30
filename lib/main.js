var spawn = require('npm-execspawn');
var path = require('path');
var args = process.argv.slice(2);
var validOptions = args.some(function(arg) {
  var protocol = arg.substring(0, 4);
  return (protocol === 'file' || protocol === 'http');
});

function main(options) {
  console.log(options, 'main')
  var config = require('./config');
  var appScript = path.join(__dirname, '/app.js');

  if (options) {
    // Reset args because its not being used from the commandline.
    args = [];
    if (options.silent) args.push('-s');
    if (options.window) args.push('-w');
    if (options.url) args.push(options.url);
  }

  var app = spawn('electron "' + appScript
    + '" ' + args.join(' '));

  app.stderr.pipe(process.stderr);
  app.stdout.pipe(process.stdout);
  return app;
}

if (validOptions) {
  main();
}

module.exports = main;
