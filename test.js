var assert = require('assert');

var subject = require('./index');
var actual;

// Lookup
actual = subject.find(75002)[0];
assert.equal(actual.nomCommune, 'Paris');
assert.equal(actual.codeInsee, '75056');
assert.ok('population' in actual);

// Population sort
actual = subject.find(54490);
assert.equal(actual.length, 7);
for (var i = 0; i < actual.length; i++) {
  if (i !== (actual.length - 1)) {
    assert.ok(actual[i] <= actual[i + 1]);
  }
}
