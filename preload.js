'use strict';
var electron = require('electron');
// var reporter = require('./reporter');
// var ipcRenderer = electron.ipcRenderer;

var mochaElectron = {
  run: function() {
    var mocha = window.mocha;
    mocha.setup({
      // reporter: 'spec'
      reporter: 'spec'
    })
    mocha.run();
    // sendMsg('stdout', 'test');
  }
}

if (window) {
  // window.reporter = reporter;
  window.electron = electron;
  window.mochaElectron = mochaElectron;
}

function sendMsg(type, message) {
  electron.ipcRenderer.send(type, message);
}

// Taken from nightmare-js
(function(){
  // listen for console.log
  var defaultLog = console.log;
  console.log = function() {
    electron.ipcRenderer.send('console', 'log', [].slice.call(arguments));
    return defaultLog.apply(this, arguments);
  };

  // listen for console.warn
  var defaultWarn = console.warn;
  console.warn = function() {
    electron.ipcRenderer.send('console', 'warn', [].slice.call(arguments));
    return defaultWarn.apply(this, arguments);
  };

  // listen for console.error
  var defaultError = console.error;
  console.error = function() {
    electron.ipcRenderer.send('console', 'error', [].slice.call(arguments));
    return defaultError.apply(this, arguments);
  };

  // overwrite the default alert
  window.alert = function(message){
    electron.ipcRenderer.send('page', 'alert', message);
  };

  // overwrite the default prompt
  window.prompt = function(message, defaultResponse){
    electron.ipcRenderer.send('page', 'prompt', message, defaultResponse);
  }

  // overwrite the default confirm
  window.confirm = function(message, defaultResponse){
    electron.ipcRenderer.send('page', 'confirm', message, defaultResponse);
  }
})()
