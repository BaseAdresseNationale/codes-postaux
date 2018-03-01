const assert = require('assert')

const subject = require('.')

const [actual] = subject.find(75002)

assert.equal(actual.codePostal, '75002')
assert.equal(actual.nomCommune, 'PARIS 02')
assert.equal(actual.codeInsee, '75102')
assert.equal(actual.libelleAcheminement, 'PARIS')
