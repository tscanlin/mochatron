#!/usr/bin/env node
var spawn = require('npm-execspawn');
var defaultConfig = require('./config.js');
var xtend = require('xtend');
var fs = require('fs');
var path = require('path');
var exists = fs.existsSync || path.existsSync;

var appScript = path.join(__dirname, '/app.js');
var args = process.argv.slice(2);

function main(conf) {
  var keys = Object.keys(defaultConfig);
  var config = {};
  keys.forEach(function(key) {
    config[key] = conf[key] || defaultConfig[key];
  });

  // Determine if valid options were passed in.
  var urlArg = args.filter(function(arg) {
    var protocol = arg.substring(0, 4);
    return (protocol === 'file' || protocol === 'http');
  })[0];

  // Set the url option
  config.url = urlArg;
  if (!urlArg) {
    console.log('No url passed.');
    return;
  }

  // Resolve hooks.
  if (config.hooks) {
    function resolveHooks(val) {
      var absPath = path.resolve(process.cwd(), val);
      if (!exists(absPath)) {
        for (var i = 0; i < module.paths.length - 1; i++) {
          absPath = path.join(module.paths[i], val);
          if (exists(absPath)) return absPath;
        };
      }
      return absPath;
    }
    config.hooks = resolveHooks(config.hooks);
  }


  // Spawn the electron process.
  var electronCommand = config.path || 'electron';
  var command = [
    electronCommand,
    '"' + appScript + '"',
    "'" + JSON.stringify(config) + "'" // Stringify the config so it is easier to parse from electron.
  ].join(' ');
  var app = spawn(command);

  app.stderr.pipe(process.stderr);
  app.stdout.pipe(process.stdout);

  return app;
}

module.exports = main;
