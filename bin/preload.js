'use strict';

var electron = require('electron');
// Use sprintf because the browser console.log does it, but node does not.
var sprintf = require('sprintf-js').sprintf;

function hookMocha() {
  if (window) {
    var mocha = window.mocha;
    // console.log(mocha)
    try {
      var origMochaRun = mocha.run;
      var origMochaSetup = mocha.setup;
      mocha.run = function(doneCallback) {
        return origMochaRun(doneCallback);
      }
      mocha.setup = function() {
        return origMochaSetup({
          reporter: 'spec'
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}

function sendMsg(type, message) {
  electron.ipcRenderer.send(type, message);
}

function doneCallback(errorCount) {
  if (errorCount > 0) {
    sendMsg('error', errorCount);
  }
}


  function isFileReady(readyState) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized')
  }

  Object.defineProperty(window, 'initMochatron', {
    value: function () {
      // Mocha needs a process.stdout.write in order to change the cursor position.
      Mocha.process = Mocha.process || {}
      Mocha.process.stdout = Mocha.process.stdout || process.stdout
      Mocha.process.stdout.write = function(s) {
        var out = {
          stdout: s
        };
        // console.log(out)
        // sendMsg(out)
      };

      var origRun = mocha.run, origUi = mocha.ui
      mocha.ui = function() {
        var retval = origUi.apply(mocha, arguments)
        // window.callPhantom({ configureMocha: true }) ////////////////////////////////////////
        mocha.reporter = function() {}
        return retval
      }
      mocha.run = function() {
        console.log('AAAAAAAAAAAA')
        // window.callPhantom({ testRunStarted: mocha.suite.suites.length })  ///////////////////////////////////////////////////////////////////
        mocha.runner = origRun.apply(mocha, arguments)
        if (mocha.runner.stats && mocha.runner.stats.end) {
          // window.callPhantom({ testRunEnded: mocha.runner })  ///////////////////////////////////////////////////////////////////
        } else {
          mocha.runner.on('end', function(err) {
            console.log(err)
            // window.callPhantom({ testRunEnded: mocha.runner })  ///////////////////////////////////////////////////////////////////
          })
        }
        return mocha.runner
      }

      delete window.initMochatron
    },
    configurable: true
  })

  // var mochaInterval
  Object.defineProperty(window, 'checkForMocha', {
    value: function() {
      var scriptTags = document.querySelectorAll('script');
      var mochaScript = Array.prototype.filter.call(scriptTags, function(s) {
        var src = s.getAttribute('src')
        console.log(src)
        return src && src.match(/mocha\.js$/)
      })[0];

      if (mochaScript) {
        mochaScript.onreadystatechange = mochaScript.onload = function () {
          console.log(isFileReady(mochaScript.readyState))
          if (isFileReady(mochaScript.readyState)) {
            clearInterval(mochaInterval)
            debugger;
            initMochatron()
          }
        }
      }
    }
  })

var mochaInterval = window.setInterval(function() {
  window.checkForMocha();
}, 0)

// Mocha needs the formating feature of console.log so copy node's format function and
// monkey-patch it into place. This code is copied from node's, links copyright applies.
// https://github.com/joyent/node/blob/master/lib/util.js
if (!console.format) {
  console.format = function(f) {
    if (typeof f !== 'string') {
      return Array.prototype.map.call(arguments, function(arg) {
        try {
          return JSON.stringify(arg)
        }
        catch (_) {
          return '[Circular]'
        }
      }).join(' ')
    }
    var i = 1;
    var args = arguments;
    var len = args.length;
    var str = String(f).replace(/%[sdj%]/g, function(x) {
      if (x === '%%') return '%';
      if (i >= len) return x;
      switch (x) {
        case '%s': return String(args[i++]);
        case '%d': return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
        default:
          return x;
      }
    });
    for (var x = args[i]; i < len; x = args[++i]) {
      if (x === null || typeof x !== 'object') {
        str += ' ' + x;
      } else {
        str += ' ' + JSON.stringify(x);
      }
    }
    return str;
  };
  var origError = console.error;
  console.error = function(){ origError.call(console, console.format.apply(console, arguments)); };
  var origLog = console.log;
  console.log = function(){ origLog.call(console, console.format.apply(console, arguments)); };
}


// hookMocha();
// window.hookMocha = hookMocha;
// document.addEventListener('DOMContentLoaded', function(event) {
//   hookMocha()
// });
//
// sendMsg('log', 'done');
// // Taken from nightmare-js
// (function(){
//   // listen for console.log
//   var defaultLog = console.log;
//   console.log = function() {
//     var message = sprintf.apply(this, [].slice.call(arguments));
//     // This 'if' is kind hacky, not sure why 'stdout:' is being output to the console, maybe it's ANSI related?
//     if (message !== 'stdout:') {
//       electron.ipcRenderer.send('console', 'log', message);
//       return defaultLog.apply(this, arguments);
//     }
//   };
//
//   // listen for console.warn
//   var defaultWarn = console.warn;
//   console.warn = function() {
//     var message = sprintf.apply(this, [].slice.call(arguments));
//     electron.ipcRenderer.send('console', 'warn', message);
//     return defaultWarn.apply(this, arguments);
//   };
//
//   // listen for console.error
//   var defaultError = console.error;
//   console.error = function() {
//     var message = sprintf.apply(this, [].slice.call(arguments));
//     electron.ipcRenderer.send('console', 'error', message);
//     return defaultError.apply(this, arguments);
//   };
//
//   // overwrite the default alert
//   window.alert = function(message){
//     electron.ipcRenderer.send('page', 'alert', message);
//   };
//
//   // overwrite the default prompt
//   window.prompt = function(message, defaultResponse){
//     electron.ipcRenderer.send('page', 'prompt', message, defaultResponse);
//   }
//
//   // overwrite the default confirm
//   window.confirm = function(message, defaultResponse){
//     electron.ipcRenderer.send('page', 'confirm', message, defaultResponse);
//   }
// })()
