const {keyBy} = require('lodash')

const communes = require('@etalab/decoupage-administratif/data/communes.json')
  .filter(c => ['commune-actuelle', 'arrondissement-municipal'].includes(c.type))

const communesIndex = keyBy(communes, 'code')

const anciensCodesIndex = new Map()

for (const commune of communes) {
  if (commune.anciensCodes) {
    for (const ancienCode of commune.anciensCodes) {
      anciensCodesIndex.set(ancienCode, commune)
    }
  }
}

function getCommuneActuelle(codeCommune) {
  if (codeCommune in communesIndex) {
    return communesIndex[codeCommune]
  }

  return anciensCodesIndex.get(codeCommune)
}

function expandWithCommune(codePostal) {
  const codeCommuneSource = codePostal.codeCommune
  const communeActuelle = getCommuneActuelle(codeCommuneSource)

  if (!communeActuelle) {
    throw new Error(`Code commune inconnu : ${codeCommuneSource}`)
  }

  if (communeActuelle.code !== codeCommuneSource) {
    codePostal.codeAncienneCommune = codeCommuneSource
    codePostal.codeCommune = communeActuelle.code
  }

  codePostal.nomCommune = communeActuelle.nom
}

module.exports = {expandWithCommune}
