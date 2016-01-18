'use strict';

var electron = require('electron');
// Use sprintf because the browser console.log does it, but node does not.
var util = require('util');
// var sprintf = require('sprintf-js').sprintf;



// if (window) {
//   var mocha = window.mocha;
//   try {
//     var origMochaRun = mocha.run;
//     var origMochaSetup = mocha.setup;
//     mocha.run = function() {
//       origMochaRun(doneCallback);
//     }
//     mocha.setup = function() {
//       origMochaSetup({
//         reporter: 'spec'
//       });
//     }
//   } catch (e) {
//     // console.log(e);
//   }
// }

function sendMsg(channel, type, message) {
  electron.ipcRenderer.send(channel, type, message);
}

function doneCallback(errorCount) {
  if (errorCount > 0) {
    sendMsg('error', errorCount);
  }
}




// Taken from nightmare-js
(function(){
  // sendMsg('console', 'log', 'test!')
  var config = {};

  function configureMocha(config, env, columns) {
    // Mocha.reporters.Base.window.width = columns
    mocha.env = env
    // console.log('a')
    // console.log(config)

    mocha.useColors(config.useColors)
    mocha.bail(config.bail)
    if (config.timeout) {
      mocha.timeout(config.timeout)
    }
    if (config.grep) {
      mocha.grep(config.grep)
    }
    if (config.invert) {
      mocha.invert()
    }

    mocha.setup({
      reporter: config.reporter || Mocha.reporters.Custom
    })
  }


  // console.log(mocha)
  electron.ipcRenderer.on('execute', function(event, command, opts, env) {
    if (command === 'setConfig') {
      config = opts;
    } else if (command === 'checkForMocha') {
      window.checkForMocha();
    } else if (command === 'configureMocha') {
      configureMocha(opts, env);
    } else if (command === 'eval') {
      eval(opts);
    }
    // console.log(command, opts)
  })


  // listen for console.log
  var defaultLog = console.log;
  console.log = function() {
    var message = util.format.apply(util.format, [].slice.call(arguments));
    // This 'if' is kind hacky, not sure why 'stdout:' is being output to the console, maybe it's ANSI related?
    if (message !== 'stdout:') {
      sendMsg('console', 'log', message);
      return defaultLog.apply(this, arguments);
    }
  };

  // listen for console.warn
  var defaultWarn = console.warn;
  console.warn = function() {
    var message = util.format.apply(util.format, [].slice.call(arguments));
    sendMsg('console', 'warn', message);
    return defaultWarn.apply(this, arguments);
  };

  // listen for console.error
  var defaultError = console.error;
  console.error = function() {
    var message = util.format.apply(util.format, [].slice.call(arguments));
    sendMsg('console', 'error', message);
    return defaultError.apply(this, arguments);
  };

  // overwrite the default alert
  window.alert = function(message){
    sendMsg('page', 'alert', message);
  };

  // overwrite the default prompt
  window.prompt = function(message, defaultResponse){
    sendMsg('page', 'prompt', message, defaultResponse);
  }

  // overwrite the default confirm
  window.confirm = function(message, defaultResponse){
    sendMsg('page', 'confirm', message, defaultResponse);
  }



  function isFileReady(readyState) {
      // Check to see if any of the ways a file can be ready are available as properties on the file's element
      return (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized')
    }

    Object.defineProperty(window, 'initMochatron', {
      value: function () {
        console.format = util.format;
        var mocha = window.mocha;
        // Mocha needs a process.stdout.write in order to change the cursor position.
        Mocha.process = Mocha.process || {}
        Mocha.process.stdout = Mocha.process.stdout || process.stdout
        // console.log('2')
        Mocha.process.stdout.write = function(s) { sendMsg('mocha', 'stdout', { stdout: s }) }

        var origRun = mocha.run, origUi = mocha.ui
        mocha.ui = function() {
          var retval = origUi.apply(mocha, arguments)
          configureMocha(config)
          // sendMsg('mocha', 'configureMocha', { configureMocha: mocha })
          mocha.reporter = function() {}
          return retval
        }
        mocha.run = function() {
          console.log('abc');
          sendMsg('mocha', 'testRunStarted', { testRunStarted: mocha.suite.suites.length })
          mocha.runner = origRun.apply(mocha, arguments)
          if (mocha.runner.stats && mocha.runner.stats.end) {
            sendMsg('mocha', 'testRunEnded', { testRunEnded: mocha.runner })
          } else {
            mocha.runner.on('end', function() {
              sendMsg('mocha', 'testRunEnded', { testRunEnded: mocha.runner })
            })
          }
          return mocha.runner
        }

        delete window.initMochatron
      },
      configurable: true
    })

    Object.defineProperty(window, 'checkForMocha', {
      value: function() {
        var scriptTags = document.querySelectorAll('script');
        var mochaScript = Array.prototype.filter.call(scriptTags, function(s) {
          // console.log(s.innerHTML)
          var src = s.getAttribute('src')
          return src && src.match(/mocha\.js$/)
        })[0]

        // console.log(scriptTags)

        if (mochaScript) {
          mochaScript.onreadystatechange = mochaScript.onload = function () {
            if (isFileReady(mochaScript.readyState)) {
              window.initMochatron()
            }
          }
        }
      }
    })


    //
    // var scriptTags = document.querySelectorAll('script');
    // // Remove mocha.run() script tag from the DOM.
    // var mochaRunner = Array.prototype.filter.call(scriptTags, function(s) {
    //   var code = s.innerHTML
    //   console.log(code.split('mocha.run()').length === 2
    //     ? true
    //     : false)
    //   return code.split('mocha.run()').length === 2
    //     ? true
    //     : false;
    //   // return code && code.match(/mocha\.run/)
    // })[0];
    // console.log(mochaRunner)
    // mochaRunner.innerHTML = '';


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
    //     sendMsg('console', 'error', message);
    //     origError.call(console, console.format.apply(console, arguments));
    //   };
    //   var origLog = console.log;
    //   console.log = function(){
    //     var message = [].slice.call(arguments); //sprintf.apply(this,
    //       // This 'if' is kind hacky, not sure why 'stdout:' is being output to the console, maybe it's ANSI related?
    //     sendMsg('console', 'log', message);
    //     return origLog.call(console, console.format.apply(console, arguments));
    //   };
    // }
})()
