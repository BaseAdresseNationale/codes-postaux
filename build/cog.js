const request = require('superagent')
const decompress = require('decompress')
const parse = require('csv-parser')
const pumpify = require('pumpify').obj
const through = require('through2').obj
const {decodeStream} = require('iconv-lite')
const toArray = require('get-stream').array
const {trimStart, trimEnd, keyBy} = require('lodash')
const {bufferToStream} = require('./buffer-stream')

const COMMUNES_2017_URL = 'https://www.insee.fr/fr/statistiques/fichier/2666684/france2017-txt.zip'

async function getCommunesBuffer() {
  const response = await request.get(COMMUNES_2017_URL)
    .buffer(true)
    .parse(request.parse['application/octet-stream'])
  const archiveBuffer = response.body
  const decompressedFiles = await decompress(archiveBuffer)
  return decompressedFiles[0].data
}

function buildNom(NCCENR, ARTMIN) {
  if (!ARTMIN) return NCCENR
  const trimmedArticle = trimStart(trimEnd(ARTMIN, ')'), '(')
  return trimmedArticle.endsWith('\'') ? trimmedArticle + NCCENR : trimmedArticle + ' ' + NCCENR
}

function eachCommune(commune, enc, cb) {
  const {ACTUAL, DEP, COM, NCCENR, ARTMIN} = commune
  if (ACTUAL === '9') return cb() // On ignore les fractions cantonales
  const code = DEP + COM
  const nom = buildNom(NCCENR, ARTMIN)
  cb(null, {code, nom, status: ACTUAL})
}

async function getCommunes() {
  const communesBuffer = await getCommunesBuffer()
  return toArray(
    pumpify(
      bufferToStream(communesBuffer),
      decodeStream('win1252'),
      parse({separator: '\t', strict: true}),
      through(eachCommune)
    )
  )
}

async function getIndexedCommunes() {
  const communes = await getCommunes()
  return keyBy(communes, 'code')
}

module.exports = {getCommunes, getIndexedCommunes}
