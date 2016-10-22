var spawn = require('cross-spawn');
var defaultConfig = require('./config.js');
var xtend = require('xtend');
var fs = require('fs');
var path = require('path');
var fileUrl = require('file-url');
var pathElectronPrebuild = require('electron-prebuilt');
var exists = fs.existsSync || path.existsSync;

var appScript = path.join(__dirname, '/app.js');

module.exports = function(conf) {
  var config = {};
  Object.assign(config, defaultConfig, conf);

  // Resolve to a file URL if its not http*.
  var urlArg = conf.args ? conf.args[0] : conf.url;
  if (urlArg.indexOf('http') !== 0) {
    urlArg = fileUrl(urlArg);
  }
  config.url = urlArg;

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
  var electronCommand = config.path || pathElectronPrebuild;
  var app = spawn(electronCommand, [
    appScript,
    JSON.stringify(config) // Stringify the config so it is easier to parse from electron.
  ]);

  app.stderr.pipe(process.stderr);
  app.stdout.pipe(process.stdout);

  process.on('exit', function () {
    app.kill();
  });

  return app;
};
