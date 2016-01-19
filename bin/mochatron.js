#!/usr/bin/env node
var spawn = require('npm-execspawn');
var defaultConfig = require('./config.js');
var xtend = require('xtend');
var fs = require('fs');
var path = require('path');
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

  // Spawn the electron process.
  var command = [
    'electron',
    '"' + appScript + '"',
    "'" + JSON.stringify(config) + "'" // Stringify the config so it is easier to parse from electron.
  ].join(' ');
  var app = spawn(command);

  app.stderr.pipe(process.stderr);
  app.stdout.pipe(process.stdout);

  return app;
}

module.exports = main;
