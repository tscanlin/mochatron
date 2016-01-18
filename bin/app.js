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

// output
var output = config.file ? fs.open(config.file, 'w') : process.stdout;
var fail = function(msg, errno) {
  if (output && config.file) {
    output.close()
  }
  if (msg) {
    process.stderr.writeLine(msg)
  }
  return app.quit(errno || 1);
}

// Show current config.
console.log('Config: ' + JSON.stringify(config));


    //
    // // Mocha needs the formating feature of console.log so copy node's format function and
    // // monkey-patch it into place. This code is copied from node's, links copyright applies.
    // // https://github.com/joyent/node/blob/master/lib/util.js
    // if (!console.format) {
    //   console.format = function(f) {
    //     if (typeof f !== 'string') {
    //       return Array.prototype.map.call(arguments, function(arg) {
    //         try {
    //           return JSON.stringify(arg)
    //         }
    //         catch (_) {
    //           return '[Circular]'
    //         }
    //       }).join(' ')
    //     }
    //     var i = 1;
    //     var args = arguments;
    //     var len = args.length;
    //     var str = String(f).replace(/%[sdj%]/g, function(x) {
    //       if (x === '%%') return '%';
    //       if (i >= len) return x;
    //       switch (x) {
    //         case '%s': return String(args[i++]);
    //         case '%d': return Number(args[i++]);
    //         case '%j':
    //           try {
    //             return JSON.stringify(args[i++]);
    //           } catch (_) {
    //             return '[Circular]';
    //           }
    //         default:
    //           return x;
    //       }
    //     });
    //     for (var x = args[i]; i < len; x = args[++i]) {
    //       if (x === null || typeof x !== 'object') {
    //         str += ' ' + x;
    //       } else {
    //         str += ' ' + JSON.stringify(x);
    //       }
    //     }
    //     return str;
    //   };
    //   var origError = console.error;
    //   console.error = function(){
    //     var message = [].slice.call(arguments); //sprintf.apply(this,
    //     origError.call(console, console.format.apply(console, arguments));
    //   };
    //   var origLog = console.log;
    //   console.log = function(){
    //     var message = [].slice.call(arguments); //sprintf.apply(this,
    //       // This 'if' is kind hacky, not sure why 'stdout:' is being output to the console, maybe it's ANSI related?
    //     return origLog.call(console, console.format.apply(console, arguments));
    //   };
    // }




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
  mainWindow.loadURL(config.url, {
    httpReferrer: config.referrer, // String - A HTTP Referrer url.
    userAgent: config.userAgent, // String - A user agent originating the request.
    extraHeaders: config.extraHeaders, // String - Extra headers separated by "\n".
  });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  mainWindow.webContents.on('did-get-response-details', function(event, status, url) {
    if (url.match(/mocha\.js$/)) {
      mainWindow.webContents.send('execute', 'setConfig' , config);
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

ipc.on('mocha', function(event, type, data) {
  console.log(type)
  if (type === 'stdout') {
    output.write(data.stdout)
  // } else if (typeof data.screenshot === 'string') {
  //   page.render(data.screenshot + '.png')
  } else if (type === 'configureMocha') {
    configureMocha(data)
  } else if (type === 'testRunStarted') {
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
  // Skip the type for now.
  // console.log(event);
  // console.log(obj);
});


function configureMocha() {
  mainWindow.webContents.send('execute', 'configureMocha', config, process.env)
  // setup a the reporter
  // , config, process.env, parseInt(process.env.COLUMNS || 75) * .75 | 0

  // setup a the reporter
  // if (page.evaluate(setupReporter, reporter) !== true) {
  //   // we failed to set the reporter - likely a 3rd party reporter than needs to be wrapped
  //   var customReporter = fs.read(reporter),
  //   wrapper = function() {
  //     var exports, module, process, require;
  //     require = function(what) {
  //       what = what.replace(/[^a-zA-Z0-9]/g, '')
  //       for (var r in Mocha.reporters) {
  //         if (r.toLowerCase() === what) {
  //           return Mocha.reporters[r]
  //         }
  //       }
  //       throw new Error("Your custom reporter tried to require '" + what + "', but Mocha is not running in Node.js in mocha-phantomjs, so Node modules cannot be required - only other reporters");
  //     };
  //     module = {};
  //     exports = undefined;
  //     process = Mocha.process;
  //     'customreporter';
  //     return Mocha.reporters.Custom = exports || module.exports;
  //   },
  //   wrappedReporter = wrapper.toString().replace("'customreporter'", "(function() {" + (customReporter.toString()) + "})()")
  //
  //   page.evaluate(wrappedReporter)
  //   if (page.evaluate(function() { return !Mocha.reporters.Custom }) ||
  //       page.evaluate(setupReporter) !== true) {
  //     fail('Failed to use load and use the custom reporter ' + reporter)
  //   }
  // }

  // if (typeof config.hooks.beforeStart === 'function') {
  //   config.hooks.beforeStart(hookData)
  // }
  configured = true
}

//
//
// function setupReporter(reporter) {
//   try {
//     mocha.setup({
//       reporter: reporter || Mocha.reporters.Custom
//     })
//     return true
//   } catch (error) {
//     return error
//   }
// }


module.exports = app;
