var Mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = 'test'

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function(file){
  // Only keep the .js files
  return file.substr(-3) === '.js' && file !== 'index.js';

}).forEach(function(file){
  mocha.addFile(
    path.join(testDir, file)
  );
});

// Run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);
  });
});
