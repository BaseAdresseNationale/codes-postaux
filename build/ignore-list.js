const {createReadStream} = require('fs')
const {join} = require('path')
const getStream = require('get-stream')
const csvParse = require('csv-parser')
const {groupBy} = require('lodash')

const IGNORE_LIST_PATH = join(__dirname, '..', 'ignore-list.csv')

async function loadIgnoreList() {
  const rows = await getStream.array(
    createReadStream(IGNORE_LIST_PATH)
      .pipe(csvParse())
  )

  return groupBy(rows, 'codeCommune')
}

module.exports = {loadIgnoreList}
