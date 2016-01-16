// (chai && chai.expect) ||
var expect = require('chai').expect;
var spawn = require('npm-execspawn');
var mochatron;

// var program = require('../bin/program');
// console.log(spawn('../bin/program --help'));

function run(args) {
  return new Promise(function(resolve, reject) {
    var stdout = '';
    var stderr = '';
    var cwd = process.cwd();
    var spawnArgs = ['node', 'bin/program'].concat(args).join(' ');
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
  it('Running with --help should show example usage', function(done) {
    run('--help').then(function(result) {
      expect(result.code).to.equal(0);
      expect(result.stdout).to.contain('Usage: program [options] <url>');
      done();
    });
  });

  xit('passes 1', function() {
    expect(1).to.be.ok;
  });
  xit('passes 2', function() {
    expect(2).to.be.ok;
  });
  xit('passes 3', function() {
    expect(3).to.be.ok;
  });
});
