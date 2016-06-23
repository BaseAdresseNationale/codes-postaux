var fs = require('fs');
var zlib = require('zlib');

var csvParse = require('csv-parse');
var JSONStream = require('JSONStream');

var gzip = zlib.createGzip();

var sourceFile = __dirname + '/code_postaux_v201410_corr.csv';
var destFile = __dirname + '/codes-postaux.json.gz';

if (fs.existsSync(sourceFile)) {  // else, we're added as a dependency
    // Override first line
    var COLUMNS_NAMES = ['codeInsee', 'nomCommune', 'codePostal', 'libelleAcheminement'];

    // Read source file
    fs.createReadStream(sourceFile)
        // Parse CSV as Object
        .pipe(csvParse({ delimiter: ';', trim: true, columns: COLUMNS_NAMES }))
        // Turn into JSON Array String
        .pipe(JSONStream.stringify())
        // Deflate
        .pipe(gzip)
        // Write gzipped json file
        .pipe(fs.createWriteStream(destFile))
        // Finished!
        .on('finish', function () {
            console.log('Dataset has been successfully converted and deflated');
        });
}
