var spawn = require('npm-execspawn');
var args = process.argv.slice(2);

function main(options) {
  var config = require('./config');

  var app = spawn('electron ./lib/app.js ' + args.join(' '));

  app.stderr.pipe(process.stderr);
  app.stdout.pipe(process.stdout);
}

if (args.length > 0) {
  main();
}

module.exports = main;
