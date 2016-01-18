'use strict';

var config = {};
// try {
  var arg = process.argv.slice(2)[0];
  console.log(arg)
  config = JSON.parse(arg);
// } catch (e) {}
console.log('args', config)

// Show current config.
console.log('Config: ' + JSON.stringify(config));

// Start handling electron stuff.
var electron = require('electron');
var app = electron.app;  // Module to control application life.
var ipc = electron.ipcMain;  // Module for inter-process communication.
var BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var preloadURL = 'file://' + __dirname + '/preload.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

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

  // and load the index.html of the app.
  mainWindow.loadURL(config.url);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

ipc.on('console', function(event, type, message) {
  // Skip the type for now.
  console.log(message);
});

ipc.on('error', function(event, errorCount) {
  console.error('Errors: ' + errorCount);
  if (!config.silent) {
    app.quit();
    // This might be redundant.
    process.exit(errorCount);
  }
});

module.exports = app;
