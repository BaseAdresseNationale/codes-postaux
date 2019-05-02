/* eslint unicorn/no-process-exit: off */
const fs = require('fs')
const {join} = require('path')
const {promisify} = require('util')
const {chain, pick} = require('lodash')
const {getCurrentFIMOCTFileBuffer} = require('./download-fimoct')
const {extractFromFIMOCT} = require('./extract-fimoct')
const {expandWithCommune} = require('./communes')

const writeFile = promisify(fs.writeFile)

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
