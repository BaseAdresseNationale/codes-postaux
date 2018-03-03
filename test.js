const assert = require('assert')

const subject = require('.')

const [actual] = subject.find(75002)

assert.equal(actual.codePostal, '75002')
assert.equal(actual.nomCommune, 'Paris 2e Arrondissement')
assert.equal(actual.codeCommune, '75102')
assert.equal(actual.libelleAcheminement, 'PARIS')
