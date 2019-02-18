/* eslint unicorn/no-process-exit: off */
const fs = require('fs')
const {join} = require('path')
const {promisify} = require('util')
const {chain, pick, keyBy} = require('lodash')
const communes = require('@etalab/cog/data/communes.json')
const {getCurrentFIMOCTFileBuffer} = require('./download-fimoct')
const {extractFromFIMOCT} = require('./extract-fimoct')

const communesIndex = keyBy(communes, 'code')

const writeFile = promisify(fs.writeFile)

function expandWithCommune(codePostal) {
  if (codePostal.codeCommune in communesIndex) {
    const commune = communesIndex[codePostal.codeCommune]
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

async function main() {
  const buffer = await getCurrentFIMOCTFileBuffer()
  const codesPostaux = await extractFromFIMOCT(buffer)
  codesPostaux.forEach(e => expandWithCommune(e))
  await writeAsJSONFile(join(__dirname, '..', 'codes-postaux-full.json'), codesPostaux)
  const codesPostauxCompact = buildCompact(codesPostaux)
  await writeAsJSONFile(join(__dirname, '..', 'codes-postaux.json'), codesPostauxCompact)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
