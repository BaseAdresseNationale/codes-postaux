var request = require('request');
var parse = require('csv-parse');
var JSONStream = require('JSONStream');
var fs = require('fs');

var sourceFile = 'https://www.data.gouv.fr/s/resources/base-officielle-des-codes-postaux/20141106-120608/code_postaux_v201410.csv';

// Override first line
var columns = function() {
    return ['codeInsee', 'nomCommune', 'codePostal', 'libelleAcheminement'];
};

// Request source file
request(sourceFile)
    // Parse CSV as Object
    .pipe(parse({ delimiter: ';', trim: true, columns: columns }))
    // Turn into JSON Array String
    .pipe(JSONStream.stringify())
    // Output
    .pipe(fs.createWriteStream(__dirname + '/codes-postaux.json'));
