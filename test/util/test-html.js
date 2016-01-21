var expect = (chai && chai.expect) || require('chai').expect;

describe('Basic HTML Tests', function() {
  describe('Test H1', function() {
    it('should contain "Test"', function() {
      var testH1 = document.querySelector('#test-h1');
      expect(testH1.textContent).to.equal('Test');
    });
    it('should not contain "It"', function() {
      var testH1 = document.querySelector('#test-h1');
      expect(testH1.textContent).to.not.equal('It');
    });
  });
});
