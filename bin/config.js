// Default config / options.
module.exports = {
  // Url to test.
  url: 'http://localhost/',
  // Exit on the first test failure.
  bail: false,
  // Show window.
  window: true,

  // Specify the reporter to use.
  reporter: 'spec',
  // Only run tests matching <pattern>.
  grep: null,
  // Specify the test startup timeout to use.
  timeout: 2000,
  // Invert --grep matches.
  invert: false,

  // Specify cookie name and value.
  cookie: null,
  // Specify custom header.
  header: null,
  // Specify the user agent to use.
  agent: null,
  // Path to hooks module.
  hooks: null,
  // Specify the file to dump reporter output.
  file: null
};
