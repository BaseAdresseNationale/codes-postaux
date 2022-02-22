const {groupBy, keyBy, maxBy} = require('lodash')
const historiqueCommunes = require('@etalab/decoupage-administratif/data/historique-communes.json')
const arrondissementsMunicipaux = require('@etalab/decoupage-administratif/data/communes.json')
  .filter(c => c.type === 'arrondissement-municipal')
  .map(c => ({code: c.code, nom: c.nom, type: 'COM'}))

function connectGraph(historiqueCommunes) {
  const byId = keyBy(historiqueCommunes, 'id')
  for (const h of historiqueCommunes) {
    if (h.successeur) {
      h.successeur = byId[h.successeur]
    }

    if (h.predecesseur) {
      h.predecesseur = byId[h.predecesseur]
    }

    if (h.pole) {
      h.pole = byId[h.pole]
    }

    if (h.membres) {
      h.membres = h.membres.map(m => byId[m])
    }
  }
}

connectGraph(historiqueCommunes)

const byCodeCommune = groupBy(historiqueCommunes.concat(arrondissementsMunicipaux), h => `${h.type}${h.code}`)

function getCommuneActuelle(communeEntry) {
  if (typeof communeEntry === 'string') {
    const candidates = byCodeCommune[`COM${communeEntry}`]

    if (candidates) {
      return getCommuneActuelle(maxBy(candidates, c => c.dateFin || '9999-99-99'))
    }

    return
  }

  if (!communeEntry.dateFin && communeEntry.type === 'COM') {
    return communeEntry
  }

  if (!communeEntry.dateFin) {
    return getCommuneActuelle(communeEntry.pole)
  }

  if (communeEntry.successeur) {
    return getCommuneActuelle(communeEntry.successeur)
  }
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
