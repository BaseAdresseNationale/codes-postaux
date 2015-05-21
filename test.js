var assert = require('assert');

var subject = require('./index');

var actual = subject.find(75002)[0];

assert.equal(actual.codePostal, '75002');
assert.equal(actual.nomCommune, 'PARIS 02');
assert.equal(actual.codeInsee, '75102');
assert.equal(actual.libelleAcheminement, 'PARIS');
