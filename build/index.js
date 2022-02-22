#!/usr/bin/env node
const path = require('path')
const {writeJson} = require('fs-extra')
const {chain, pick} = require('lodash')
const {getLatestFIMOCTFileBuffer} = require('./download-fimoct')
const {extractFromFIMOCT} = require('./extract-fimoct')
const {expandWithCommune} = require('./communes')

const COMPACT_KEYS = ['codePostal', 'codeCommune', 'nomCommune', 'libelleAcheminement']

function buildCompact(codesPostaux) {
  return chain(codesPostaux)
    .map(cp => pick(cp, ...COMPACT_KEYS))
    .uniqBy(cp => `${cp.codePostal}-${cp.codeCommune}`)
    .value()
}

function expandWithDefault(codesPostaux) {
  return chain(codesPostaux)
    .groupBy('codeCommune')
    .map((codesPostauxCommune, codeCommune) => {
      if (!codesPostauxCommune.some(cp => cp.codeVoie === 'XXXX')) {
        const codePostal = chain(codesPostauxCommune)
          .countBy('codePostal')
          .toPairs()
          .maxBy(p => p[1])
          .value()[0]

        const libelleAcheminement = chain(codesPostauxCommune)
          .countBy('libelleAcheminement')
          .toPairs()
          .maxBy(p => p[1])
          .value()[0]

        codesPostauxCommune.push({
          codeCommune,
          codePostal,
          libelleAcheminement,
          codeVoie: 'XXXX'
        })
      }

      return codesPostauxCommune
    })
    .flatten()
    .value()
}

async function main() {
  const buffer = await getLatestFIMOCTFileBuffer()
  const codesPostaux = expandWithDefault(await extractFromFIMOCT(buffer))
  for (const item of codesPostaux) expandWithCommune(item)
  await writeJson(path.join(__dirname, '..', 'codes-postaux-full.json'), codesPostaux)
  const codesPostauxCompact = buildCompact(codesPostaux)
  await writeJson(path.join(__dirname, '..', 'codes-postaux.json'), codesPostauxCompact)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
