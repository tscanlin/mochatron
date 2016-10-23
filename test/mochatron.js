// (chai && chai.expect) ||
var expect = require('chai').expect;
var Mochatron = require('../lib/index.js');
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var mochatron;

var TEST_FILE = 'test-results.txt';

function checkExists(val) {
  return val !== undefined;
}

function run(conf) {
  return new Promise(function(resolve, reject) {
    var stdout = '';
    var stderr = '';
    mochatron = Mochatron(conf);

    mochatron.stdout.on('data', function(data) {
      stdout = stdout.concat(data.toString());
    })
    mochatron.stderr.on('data', function(data) {
      stderr = stderr.concat(data.toString());
    })
    mochatron.once('close', function(code) {
      resolve({
        code: code,
        stdout: stdout,
        stderr: stderr
      });
    })
    mochatron.once('exit', function(code) {
      mochatron.kill();
      resolve({
        code: code,
        stdout: stdout,
        stderr: stderr
      });
    })
    mochatron.once('error', function(err) {
      reject(err);
    })
  });
}


describe('mochatron tests', function() {
  this.timeout(8000);

  afterEach(function() {
    mochatron.kill();
  });

  xit('Running with nothing should show command usage', function(done) {
    run().then(function(result) {
      // expect(result.code).to.equal(1);
      expect(result.stdout).to.contain('Usage: mochatron-cli [options] <url>');
      done();
    }).catch(done);
  });

  xit('Running with --help should show command usage', function(done) {
    run(PROGRAM, '--help').then(function(result) {
      // expect(result.code).to.equal(1);
      expect(result.stdout).to.contain('Usage: mochatron-cli [options] <url>');
      done();
    }).catch(done);
  });

  it('Running with a url should run the tests for that page', function(done) {
    run({
      quit: true,
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('Basic HTML Tests');
      expect(result.stdout).to.contain('Test H1');
      expect(result.stdout).to.contain('should contain "Test"');
      expect(result.stdout).to.contain('should not contain "It"');
      expect(result.stdout).to.contain('2 passing');
      done();
    }).catch(done);
  });

  it('Running with --hooks should run hooks in the specified file before and after the test', function(done) {
    run({
      quit: true,
      hooks: 'test/util/hooks.js',
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('Before start called correctly!');
      expect(result.stdout).to.contain('Basic HTML Tests');
      expect(result.stdout).to.contain('Test H1');
      expect(result.stdout).to.contain('should contain "Test"');
      expect(result.stdout).to.contain('should not contain "It"');
      expect(result.stdout).to.contain('2 passing');
      expect(result.stdout).to.contain('After end called correctly!');
      done();
    }).catch(done);
  });

  it('Running with --reporter should let users change the reporter to use', function(done) {
    run({
      quit: true,
      reporter: 'dot',
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('2 passing');
      done();
    }).catch(done);
  });

  xit('Running with --file should dump test results to a file', function(done) {
    run({
      quit: true,
      file: TEST_FILE,
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('2 passing');
      var file = fs.readFileSync(TEST_FILE);
      expect(file.toString()).to.contain('2 passing');
      fs.unlinkSync(TEST_FILE);
      done();
    });
  });

  it('Running with --grep should selectively run tests that match the grep pattern', function(done) {
    run({
      quit: true,
      grep: 'should not',
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('should not');
      expect(result.stdout).to.not.contain('should contain');
      expect(result.stdout).to.contain('1 passing');
      done();
    }).catch(done);
  });

  it('Running with --grep and --invert should selectively run tests that DO NOT match the grep pattern', function(done) {
    run({
      quit: true,
      grep: 'should not',
      invert: true,
      url: 'test/index.html'
    }).then(function(result) {
      // expect(result.code).to.not.be.above(0);
      expect(result.stdout).to.contain('should contain');
      expect(result.stdout).to.not.contain('should not contain "It"');
      expect(result.stdout).to.contain('1 passing');
      done();
    }).catch(done);
  });


  // bail: false,
  // quit: false,

  // window: false,

  // timeout: 2000,
  // loadTimeout: 500,

  // cookie: null,
  // header: null,
  // agent: null,

  // view: null,
  // path: null

  // url


  // --bail',
  // --agent <userAgent>',
  // --cookie <name>=<value>'
  // --header <name>=<value>'
  // --hooks <path>',
  // --view <width>x<height>'
  // --path <path>',
  // --quit',
  // --window'

});
