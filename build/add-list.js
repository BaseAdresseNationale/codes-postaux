const {join} = require('path')
const {pick} = require('lodash')
const readCsv = require('./read-csv')

const IGNORE_LIST_PATH = join(__dirname, '..', 'add-list.csv')

async function loadAddList() {
  const rows = await readCsv(IGNORE_LIST_PATH)
  return rows.map(row => ({
    ...pick(row, 'codePostal', 'codeCommune', 'libelleAcheminement', 'nomCommune'),
    codeVoie: 'XXXX'
  }))
}

module.exports = {loadAddList}
