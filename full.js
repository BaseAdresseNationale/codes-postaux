const {keyBy, groupBy, pick} = require('lodash')
const codesPostaux = require('./codes-postaux-full.json')

const typeCommune = codesPostaux.filter(cp => !cp.codeVoie)
const typeVoie = codesPostaux.filter(cp => Boolean(cp.codeVoie))

const communesIndex = keyBy(typeCommune, 'codeCommune')
const voiesIndex = groupBy(typeVoie, e => buildIdVoie(e.codeCommune, e.codeVoie))

function buildIdVoie(codeCommune, codeVoie) {
  return `${codeCommune}-${codeVoie}`
}

function superieurBorneInf(numero, repetition, borneInferieure) {
  if (numero === borneInferieure.numero) {
    if (!repetition && !borneInferieure.repetition) return true
    if (!repetition && borneInferieure.repetition) return false
    if (repetition && !borneInferieure.repetition) return true
    return repetition >= borneInferieure.repetition
  }
  if (numero > borneInferieure.numero) return true
  if (numero < borneInferieure.numero) return false
}

function inferieurBorneSup(numero, repetition, borneSuperieure) {
  if (numero === borneSuperieure.numero) {
    if (!repetition && !borneSuperieure.repetition) return true
    if (!repetition && borneSuperieure.repetition) return true
    if (repetition && !borneSuperieure.repetition) return false
    return repetition <= borneSuperieure.repetition
  }
  if (numero > borneSuperieure.numero) return false
  if (numero < borneSuperieure.numero) return true
}

function pariteOK(numero, codeParite) {
  const modulo = numero % 2
  return (modulo === 0 && codeParite === '0') || (modulo === 1 && codeParite === '1')
}

function formatResult(entry) {
  return pick(entry, 'codePostal', 'libelleAdressage')
}

function findCodePostal(codeCommune, codeVoie, numero, repetition) {
  if (codeCommune in communesIndex) return formatResult(communesIndex[codeCommune])
  const idVoie = buildIdVoie(codeCommune, codeVoie)
  if (idVoie in voiesIndex) {
    const entries = voiesIndex[idVoie]
    if (entries.length === 1) return formatResult(entries[0])
    const parsedNumero = Number.parseInt(numero, 10)
    const candidate = entries.find(e => {
      return pariteOK(parsedNumero, e.codeParite) &&
        superieurBorneInf(parsedNumero, repetition, e.borneInferieure) &&
        inferieurBorneSup(parsedNumero, repetition, e.borneSuperieure)
    })
    if (candidate) return formatResult(candidate)
  }
}

module.exports = {findCodePostal}
