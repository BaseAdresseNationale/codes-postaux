const {groupBy, pick} = require('lodash')
const codesPostaux = require('./codes-postaux-full.json')

const voiesIndex = groupBy(codesPostaux, item => buildIdVoie(item.codeAncienneCommune || item.codeCommune, item.codeVoie))

function buildIdVoie(codeCommune, codeVoie) {
  return `${codeCommune}-${codeVoie}`
}

function parseIdVoie(idVoie) {
  if (!idVoie) {
    return {codeVoie: 'XXXX'}
  }

  if (idVoie.length === 4) {
    return {codeVoie: idVoie}
  }

  return {codeAncienneCommune: idVoie.substr(0, 5), codeVoie: idVoie.substr(6, 4)}
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
  return pick(entry, 'codePostal', 'libelleAcheminement', 'codeCommune', 'nomCommune', 'codeAncienneCommune')
}

function findCodePostal(codeCommune, idVoie, numero, repetition) {
  if (!codeCommune) {
    throw new Error('codeCommune is required')
  }

  if (idVoie && idVoie.length !== 10 && idVoie.length !== 4) {
    throw new Error('codeVoie doit être de la forme XXXX ou YYYYY-XXXX')
  }

  const {codeVoie, codeAncienneCommune} = parseIdVoie(idVoie)
  const codeCommuneVoie = codeAncienneCommune || codeCommune

  const idVoieMatch = buildIdVoie(codeCommuneVoie, codeVoie)

  if (idVoieMatch in voiesIndex) {
    const entries = voiesIndex[idVoieMatch]
    if (entries.length === 1) return formatResult(entries[0])
    const parsedNumero = Number.parseInt(numero, 10)
    const candidate = entries.find(entry => {
      return pariteOK(parsedNumero, entry.codeParite) &&
        superieurBorneInf(parsedNumero, repetition, entry.borneInferieure) &&
        inferieurBorneSup(parsedNumero, repetition, entry.borneSuperieure)
    })
    if (candidate) return formatResult(candidate)
  }

  // Si on ne trouve pas on réessaie dans l'ancienne commune mais sans précision de codeVoie
  if (!idVoieMatch.endsWith('XXXX') && codeAncienneCommune) {
    return findCodePostal(codeCommune, buildIdVoie(codeAncienneCommune, 'XXXX'))
  }

  // Si on ne trouve toujours pas on essaye sur la commune parente
  if (idVoieMatch !== buildIdVoie(codeCommune, 'XXXX')) {
    return findCodePostal(codeCommune)
  }
}

module.exports = {findCodePostal}
