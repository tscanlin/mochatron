'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const ipc = electron.ipcMain;  // Module to control application life.
// const ipc = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const preloadURL = 'file://' + __dirname + '/preload.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
// console.log(ipc);

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
    webPreferences: {
      preloadURL: preloadURL,
      nodeIntegration: false
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.loadURL('http://localhost:4000/index.html');

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

ipc.on('stdout', function(stdout, msg) {
  console.log(stdout, msg);
})

ipc.on('console', function(event, type, data) {
  console.log(type, data);
})

module.exports = app;
