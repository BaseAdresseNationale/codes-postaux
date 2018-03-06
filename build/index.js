/* eslint unicorn/no-process-exit: off */
const fs = require('fs')
const {join} = require('path')
const {promisify} = require('util')
const {chain, pick} = require('lodash')
const {getCurrentFIMOCTFileBuffer} = require('./download-fimoct')
const {extractFromFIMOCT} = require('./extract-fimoct')
const {getIndexedCommunes} = require('./cog')

const writeFile = promisify(fs.writeFile)

function expandWithCommune(codePostal, indexedCommunes) {
  if (codePostal.codeCommune in indexedCommunes) {
    const commune = indexedCommunes[codePostal.codeCommune]
    codePostal.nomCommune = commune.nom
  } else {
    console.log('Code commune inconnu')
    console.log(codePostal)
    process.exit(1)
  }
}

function writeAsJSONFile(path, codesPostaux) {
  const data = codesPostaux.map(cp => JSON.stringify(cp)).join(',\n')
  return writeFile(path, '[\n' + data + '\n]')
}

const COMPACT_KEYS = ['codePostal', 'codeCommune', 'nomCommune', 'libelleAcheminement']

function buildCompact(codesPostaux) {
  return chain(codesPostaux)
    .map(cp => pick(cp, ...COMPACT_KEYS))
    .uniqBy(cp => `${cp.codePostal}-${cp.codeCommune}`)
    .value()
}

async function doStuff() {
  const buffer = await getCurrentFIMOCTFileBuffer()
  const codesPostaux = await extractFromFIMOCT(buffer)
  const communes = await getIndexedCommunes()
  codesPostaux.forEach(e => expandWithCommune(e, communes))
  await writeAsJSONFile(join(__dirname, '..', 'codes-postaux-full.json'), codesPostaux)
  const codesPostauxCompact = buildCompact(codesPostaux)
  await writeAsJSONFile(join(__dirname, '..', 'codes-postaux.json'), codesPostauxCompact)
}

doStuff().catch(err => {
  console.error(err)
  process.exit(1)
})
