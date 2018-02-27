var fs = require('fs');

var csvParse = require('csv-parse');
var JSONStream = require('JSONStream');

var sourceFile = __dirname + '/code_postaux_v201410_corr.csv';
var destFile = __dirname + '/codes-postaux.json';

// Override first line
var COLUMNS_NAMES = ['codeInsee', 'nomCommune', 'codePostal', 'libelleAcheminement'];

// Read source file
module.exports = fs.createReadStream(sourceFile)
    // Parse CSV as Object
    .pipe(csvParse({ delimiter: ';', trim: true, columns: COLUMNS_NAMES }))
    // Turn into JSON Array String
    .pipe(JSONStream.stringify())
    // Write JSON file
    .pipe(fs.createWriteStream(destFile))
    // Finished!
    .on('finish', function () {
        console.log('Dataset has been successfully converted');
    });
