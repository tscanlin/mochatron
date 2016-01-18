// Default config / options.

module.exports = {
  // Url to test.
  url: 'http://localhost/',
  // Bail on errors.
  bail: true,
  // Show window.
  window: true,

  // 'specify the reporter to use'.
  reporter: 'spec'

  // .option('-R, --reporter <name>',       'specify the reporter to use', 'spec')
  // .option('-f, --file <filename>',       'specify the file to dump reporter output')
  // .option('-t, --timeout <timeout>',     'specify the test startup timeout to use', parseInt)
  // .option('-g, --grep <pattern>',        'only run tests matching <pattern>')
  // .option('-i, --invert',                'invert --grep matches')
  // .option('-b, --bail',                  'exit on the first test failure')
  // .option('-A, --agent <userAgent>',     'specify the user agent to use')
  // .option('-c, --cookies <Object>',      'phantomjs cookie object http://git.io/RmPxgA', cookiesParser) // http://git.io/RmPxgA
  // .option('-h, --header <name>=<value>', 'specify custom header', header)
  // .option('-k, --hooks <path>',          'path to hooks module', resolveHooks)
  // .option('-s, --setting <key>=<value>', 'specify specific phantom settings', setting)
  // .option('-v, --view <width>x<height>', 'specify phantom viewport size', viewport)
  // .option('-C, --no-color',              'disable color escape codes')
  // .option('-p, --path <path>',           'path to PhantomJS binary')
};
