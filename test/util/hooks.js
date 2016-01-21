module.exports = {
  beforeStart: function(opts) {
    if (!opts.config || !opts.config.hooks) {
      console.log('mochatron configuration was not passed in')
    } else {
      console.log('Before start called correctly!')
    }
  },
  afterEnd: function(opts) {
    if (!opts.config || !opts.config.hooks) {
      console.log('mochatron configuration was not passed in')
    } else {
      console.log('After end called correctly!')
    }
  }
}
