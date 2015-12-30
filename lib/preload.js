'use strict';
var electron = require('electron');
var sprintf = require('sprintf-js').sprintf;

var mochaElectron = {
  run: function() {
    var mocha = window.mocha;
    mocha.setup({
      reporter: 'spec'
    })
    mocha.run(doneCallback);
  }
}

if (window) {
  window.mochaElectron = mochaElectron;
}

function sendMsg(type, message) {
  electron.ipcRenderer.send(type, message);
}

function doneCallback(errorCount) {
  if (errorCount > 0) {
    sendMsg('error', errorCount);
  }
}

// Taken from nightmare-js
(function(){
  // listen for console.log
  var defaultLog = console.log;
  console.log = function() {
    defaultLog.apply(this, mocha);
    var message = sprintf.apply(this, [].slice.call(arguments));
    // This 'if' is kind hacky, not sure why 'stdout:' is being output to the console, maybe it's ANSI related?
    if (message !== 'stdout:') {
      electron.ipcRenderer.send('console', 'log', message);
      return defaultLog.apply(this, arguments);
    }
  };

  // listen for console.warn
  var defaultWarn = console.warn;
  console.warn = function() {
    var message = sprintf.apply(this, [].slice.call(arguments));
    electron.ipcRenderer.send('console', 'warn', message);
    return defaultWarn.apply(this, arguments);
  };

  // listen for console.error
  var defaultError = console.error;
  console.error = function() {
    var message = sprintf.apply(this, [].slice.call(arguments));
    electron.ipcRenderer.send('console', 'error', message);
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