const split = require('split2')
const through = require('through2').obj
const toArray = require('get-stream').array
const {trimStart} = require('lodash')
const intoStream = require('into-stream')

function eachLine(line, enc, cb) {
  if (line.substr(0, 2) !== '20') return cb()
  if (line.substr(12, 7) !== '9999999') return cb()

  const codePostal = line.substr(2, 5)
  const codeCommune = line.substr(19, 2) + line.substr(22, 3)
  const codeVoie = line.substr(25, 4)
  const codeParite = line.substr(29, 1)
  const borneSuperieure = trimStart(line.substr(30, 4).trim(), '0')
  const borneSuperieureRepetition = line.substr(34, 1).trim()
  const libelleAcheminement = line.substr(72, 30).trim()
  const borneInferieure = trimStart(line.substr(103, 4).trim(), '0')
  const borneInferieureRepetition = line.substr(107, 1).trim()
  const indicateurAdressage = line.substr(115, 1).trim()

  if (!codePostal.match(/(\d{5})/)) return cb()
  if (codeCommune.startsWith('B')) return cb() // On ignore les codes postaux de pays étrangers
  if (codeCommune === '06900') return cb() // On ignore Monaco
  if (codeCommune === '97123') return cb() // On ignore Saint-Barthelemy
  if (codeCommune === '97127') return cb() // On ignore Saint-Martin

  const result = {
    codePostal,
    codeCommune,
    libelleAcheminement
  }

  if (indicateurAdressage) result.indicateurAdressage = indicateurAdressage
  if (codeParite !== '2') result.codeParite = codeParite
  if (codeVoie !== '    ') result.codeVoie = codeVoie
  if (borneInferieure) {
    result.borneInferieure = {
      numero: Number.parseInt(borneInferieure, 10),
      repetition: borneInferieureRepetition === '' ? undefined : borneInferieureRepetition
    }
  }
  if (borneSuperieure) {
    result.borneSuperieure = {
      numero: Number.parseInt(borneSuperieure, 10),
      repetition: (borneSuperieureRepetition && borneSuperieureRepetition !== '9') ? borneSuperieureRepetition : undefined
    }
  }

  cb(null, result)
}

function extractFromFIMOCT(buffer) {
  return toArray(
    intoStream(buffer)
      .pipe(split())
      .pipe(through(eachLine))
  )
}

module.exports = {extractFromFIMOCT}
