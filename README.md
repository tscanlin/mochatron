# mocha-electron

## Introduction

mocha-electron makes integration testing with mocha and electron easy.


## Install

Install it with npm

```sh
npm install --save-dev mocha-electron
```


## Usage

Use the script from the command line or node.

> Note: by default the electron window isn't shown so that the test runs 'headless', but for debugging it can be helpful to see the window so in the config set 'window' to true or pass the '-w' argument.

```sh
node .\node_modules\mocha-electron -w http://localhost/
```

```javascript
var mochaElectron = require('mocha-electron');

mochaElectron({
  url: 'http://localhost/',
  silent: false,
  window: false
});
```

I haven't gotten around to making plugins for gulp or grunt yet (Contributions is this area would be welcome) but in the meantime here is an example of how the script can be used from a gulp task.

```javascript
var gulp = require('gulp');
var mochaElectron = require('mocha-electron');

gulp.task('test', function() {
  mochaElectron({
    url: 'http://localhost/',
    silent: false,
    window: false
  });
});
```

You also need to make sure you are including the mocha scripts on the page. If you have already been using mocha for browser testing then this step might already be done for you, but if you haven't an example of the HTML code required to include mocha might look like this.

```html
{% if TEST === true %}
  <div id="mocha"></div>
  <link rel="stylesheet" href="/node_modules/mocha/mocha.css">
  <script src="/node_modules/mocha/mocha.js"></script>
  <script src="/node_modules/chai/chai.js"></script>

  <script src="/test/test.js"></script>

  <script>
    if (window.mochaElectron) {
      mochaElectron.run();
    } else {
      mocha.run();
    }
  </script>
{% endif %}
```

Note the call to `mochaElectron` AFTER mocha / chai and your test.js file.

## API

Here's an example of how to call mochaElectron with all of its default options and comments about them.

```javascript
mochaElectron({
  // Url to test.
  url: 'http://localhost/',
  // Silently swallow errors.
  silent: false,
  // Show window.
  window: false,
});
```

For command line usage this should give you an idea of what arguments can be passed.

```javascript
var program = require('commander');

// Handle command line usage.
program
  .version('1.0.2')
  .usage('[options] <url>')
  .option('-w, --window', 'Show window', false)
  .option('-s, --silent', 'Silently swallow errors', false)
  .parse(process.argv);
```

```sh
node .\node_modules\mocha-electron -w -s http://localhost/
```

## Roadmap

- Tests


## Changelog

### v1.0
- Publicly launched


## Contributing

Contributions and suggestions are welcome! Please feel free to open an issue if you run into a problem or have a feature request. I'll do my best to respond in a timely fashion.

If you want to open a pull request just fork the repo but please make sure all tests and lint pass first.


## License

[MIT]('http://opensource.org/licenses/MIT')
