const test = require('ava')
const {findCodePostal} = require('../full')

test('Marseille 4', t => {
  t.is(findCodePostal('13204').codePostal, '13004')
})

test('Saint-Maur-des-Fossés 1', t => {
  t.is(findCodePostal('94068', '3580', '60', 'B').codePostal, '94210')
})

test('Saint-Maur-des-Fossés 2', t => {
  t.is(findCodePostal('94068', '3580', '58', 'B').codePostal, '94210')
})

test('Saint-Maur-des-Fossés 3', t => {
  t.is(findCodePostal('94068', '3580', '58', 'A').codePostal, '94100')
})

test('Saint-Maur-des-Fossés 4', t => {
  t.is(findCodePostal('94068', '3580', '63').codePostal, '94210')
})

test('Saint-Maur-des-Fossés 5', t => {
  t.is(findCodePostal('94068', '3580', '1').codePostal, '94100')
})

test('Mont-Bonvillers', t => {
  t.is(findCodePostal('54084').codePostal, '54111')
})

test('Commune inconnue', t => {
  t.is(findCodePostal('54999'), undefined)
})
