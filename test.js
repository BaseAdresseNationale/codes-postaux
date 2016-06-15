var assert = require('assert');

var subject = require('./index');

var actual = subject.find(75002)[0];

assert.equal(actual.codePostal, '75002');
assert.equal(actual.nomCommune, 'PARIS 02');
assert.equal(actual.codeInsee, '75102');
assert.equal(actual.libelleAcheminement, 'PARIS');


assert.ok(subject.dead instanceof Array);
assert.equal(subject.dead.length, 6);
assert.ok(subject.dead[0] instanceof Object);
assert.ok(subject.dead[0].codeInsee.match(/^\d{5}$/));
assert.ok(subject.dead[0].codePostal.match(/^\d{5}$/));
assert.ok(subject.dead[0].nomCommune.match(/^[A-Z ]+$/));
