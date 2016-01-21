// (chai && chai.expect) ||
var expect = require('chai').expect;
var spawn = require('npm-execspawn');
var path = require('path');
var fileUrl = require('file-url');
var cwd = process.cwd();
var mochatron;
var PROGRAM = 'bin/mochatron-cli';

function run() {
  var args = arguments;
  return new Promise(function(resolve, reject) {
    var stdout = '';
    var stderr = '';
    var argsArray = [].slice.call(args);
    var spawnArgs = ['node'].concat(argsArray).join(' ');
    mochatron = spawn(spawnArgs);

    mochatron.stdout.on('data', function(data) {
      stdout = stdout.concat(data.toString());
    })
    mochatron.stderr.on('data', function(data) {
      stderr = stderr.concat(data.toString());
    })
    mochatron.on('exit', function(code) {
      resolve({
        code: code,
        stdout: stdout,
        stderr: stderr
      });
    })
    mochatron.on('error', function(err) {
      reject(err);
    })
  });
}


describe('Program Tests', function() {
  it('Running with nothing should show command usage', function(done) {
    run(PROGRAM).then(function(result) {
      expect(result.code).to.equal(1);
      expect(result.stdout).to.contain('Usage: mochatron-cli [options] <url>');
      done();
    });
  });

  it('Running with --help should show command usage', function(done) {
    run(PROGRAM, '--help').then(function(result) {
      expect(result.code).to.equal(1);
      expect(result.stdout).to.contain('Usage: mochatron-cli [options] <url>');
      done();
    });
  });

  it('Running with a url should run the tests for that page', function(done) {
    console.log(path.join('test/index.html'))
    run(PROGRAM, 'test/index.html').then(function(result) {
      console.log(result)
      expect(result.code).to.equal(0);
      expect(result.stdout).to.contain('Basic HTML Tests');
      // expect(result.stdout).to.contain('Test H1');
      // expect(result.stdout).to.contain('should contain "Test"');
      // expect(result.stdout).to.contain('should not contain "It"');
      // expect(result.stdout).to.contain('2 passing');
      done();
    });
  });
  // also do timeout case.

  xit('Running with --reporter should let users change the reporter to use', function(done) {
    run(PROGRAM, '--reporter', 'dot').then(function(result) {
      expect(result.code).to.equal(1);
      expect(result.stdout).to.contain('Usage: mochatron-cli [options] <url>');
      done();
    });
  });

});
