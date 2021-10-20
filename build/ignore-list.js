const {join} = require('path')
const {groupBy} = require('lodash')
const readCsv = require('./read-csv')

const IGNORE_LIST_PATH = join(__dirname, '..', 'ignore-list.csv')

async function loadIgnoreList() {
  const rows = await readCsv(IGNORE_LIST_PATH)
  return groupBy(rows, 'codeCommune')
}

module.exports = {loadIgnoreList}
