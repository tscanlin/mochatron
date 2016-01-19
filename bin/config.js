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

  // Cookie object(s).
  cookie: null,
  // Customer header(s).
  header: null,
  // Custom userAgent, leave as null for default.
  agent: null
};
