# mocha-electron

## Introduction

mocha-electron makes integration testing with mocha and electron easy.


### Install

Install it with npm

```sh
npm install --save-dev mocha-electron
```


### Usage

Initialize the script

```javascript
tocbot.init({
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-content',
  // Optionally include reference to smoothScroll.
  smoothScroll: smoothScroll || window.smoothScroll
});
```

If content in the div has changed then trigger a refresh (optionally with new options).

```javascript
tocbot.refresh();
```


## API

### Options

```javascript
var defaultOptions = {
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-content',


  // Reference to smoothScroll
  smoothScroll: undefined,
  // smoothScroll Options
  smoothScrollOptions: {
    easing: 'easeInOutCubic',
    offset: 0,
    speed: 300, // animation duration.
    updateURL: true,
  },


  // Which headings to grab inside of the contentSelector element.
  headingsToSelect: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
  ],
  // Class to add to active links (the link corresponding to the top most heading on the page).
  activeLinkClass: 'is-active-link',
  // Headings that match the excludeSelector will be skipped.
  excludeSelector: '.skip-toc',
  // Fixed position class to add to make sidebar fixed after scrolling down past the fixedSidebarOffset.
  positionFixedClass: 'is-position-fixed',
  // fixedSidebarOffset can be any number but by default is set to auto which sets the fixedSidebarOffset to the sidebar element's offsetTop from the top of the document on init.
  fixedSidebarOffset: 'auto',


  // Main class to add to links.
  linkClass: 'toc-link',
  // Extra classes to add to links.
  extraLinkClasses: 'color--base',
  // Main class to add to lists.
  listClass: 'toc-list',
  // Extra classes to add to lists.
  extraListClasses: 'soft--left',
  // Headings offset between the headings and the top of the document (helps with weird rounding bugs that pop up).
  headingsOffset: 2,


  // Class that gets added when a list should be collapsed.
  isCollapsedClass: 'is-collapsed',
  // Class that gets added when a list should be able to be collapsed but isn't necessarily collpased.
  collapsibleClass: 'collapsible',
  // How many heading levels should not be collpased. For example, number 6 will show everything since there are only 6 heading levels and number 0 will collpase them all.
  collapseDepth: 0,
};
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
