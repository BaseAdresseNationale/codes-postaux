const {createReadStream} = require('fs')
const getStream = require('get-stream')
const csvParse = require('csv-parser')

async function readCsv(filePath) {
  return getStream.array(
    createReadStream(filePath)
      .pipe(csvParse())
  )
}

module.exports = readCsv
