'use strict';

var fs = require('fs');
var util = require('util');
var arg = process.argv.slice(2)[0];
var config = JSON.parse(arg);
var runStarted = false;
var configured  = false;

// Start handling electron stuff.
var electron = require('electron');
var app = electron.app;  // Module to control application life.
var ipc = electron.ipcMain;  // Module for inter-process communication.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var preloadURL = 'file://' + __dirname + '/preload.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

// Show current config.
console.log('Config: ' + JSON.stringify(config));

// output
var output = config.file ? fs.createWriteStream(config.file, 'utf-8') : process.stdout;

var fail = function(msg, errno) {
  if (output && config.file) {
    output.close()
  }
  if (msg) {
    process.stderr.writeLine(msg)
  }
  return app.quit(errno || 1);
}

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 1200,
    width: 1600,
    show: config.window,
    webPreferences: {
      preloadURL: preloadURL,
      nodeIntegration: false
    }
  });

  var extraHeaders = '';
  for (var key in config.header) {
    extraHeaders += key + ': ' + config.header[key] + '\n';
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Timeout here so the DevTools has enough time to load and record the first request.
  setTimeout(function(){
    mainWindow.loadURL(config.url, {
      extraHeaders: extraHeaders, // String - Extra headers separated by "\n".
      userAgent: config.agent, // String - User agent.
    });
  }, 500)


  mainWindow.webContents.on('did-get-response-details', function(event, status, newURL, originalURL, httpResponseCode, requestMethod, referrer, headers) {
    // If its the mocha script.
    if (newURL.match(/mocha\.js$/)) {
      mainWindow.webContents.send('execute', 'setConfig', config);
      if (config.cookie) {
        mainWindow.webContents.send('execute', 'addCookie', config.cookie);
      }
      mainWindow.webContents.send('execute', 'checkForMocha');
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('console', function(event, type, message) {
  console[type](message);
});

ipc.on('error', function(event, errorCount) {
  console.error('Errors: ' + errorCount);
  if (config.bail) {
    app.quit();
    // This might be redundant.
    process.exit(errorCount);
  }
});

ipc.on('mocha', function(event, type, data) {
  if (type === 'testRunStarted') {
    if (data.testRunStarted == 0) {
      fail('mocha.run() was called with no tests')
    }
    runStarted = true
  } else if (data.testRunEnded) {
    // if (typeof config.hooks.afterEnd === 'function') {
    //   hookData.runner = data.testRunEnded
    //   config.hooks.afterEnd(hookData)
    // }
    if (config.file) {
      output.close()
    }
    // app.quit();
  }
});

module.exports = app;
