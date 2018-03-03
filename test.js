const test = require('ava')
const codesPostaux = require('.')

test('75002', t => {
  const communes = codesPostaux.find(75002)
  t.is(communes.length, 1)
  const [commune] = communes
  t.is(commune.codePostal, '75002')
  t.is(commune.nomCommune, 'Paris 2e Arrondissement')
  t.is(commune.codeCommune, '75102')
  t.is(commune.libelleAcheminement, 'PARIS')
})
