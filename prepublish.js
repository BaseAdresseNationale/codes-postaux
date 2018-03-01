const fs = require('fs')

const csvParse = require('csv-parse')
const JSONStream = require('JSONStream')

const sourceFile = 'code_postaux_v201410_corr.csv'
const destFile = 'codes-postaux.json'

// Override first line
const COLUMNS_NAMES = ['codeInsee', 'nomCommune', 'codePostal', 'libelleAcheminement']

// Read source file
module.exports = fs.createReadStream(sourceFile)
  // Parse CSV as Object
  .pipe(csvParse({delimiter: ';', trim: true, columns: COLUMNS_NAMES}))
  // Turn into JSON Array String
  .pipe(JSONStream.stringify())
  // Write JSON file
  .pipe(fs.createWriteStream(destFile))
  // Finished!
  .on('finish', () => {
    console.log('Dataset has been successfully converted')
  })
