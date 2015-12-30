var spawn = require('npm-execspawn');
var path = require('path');
var args = process.argv.slice(2);
var noOptions = true;

function main(options) {
  var config = require('./config');
  var appScript = path.join(__dirname, '/app.js');

  if (options) {
    noOptions = false;
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

if (noOptions) {
  main();
}

module.exports = main;
