var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGunzip();

var sourceFile = __dirname + '/codes-postaux.json.gz';
var destFile = __dirname + '/codes-postaux.json';

// Just inflate json file
fs.createReadStream(sourceFile)
    .pipe(gzip)
    .pipe(fs.createWriteStream(destFile))
    .on('finish', function () {
        console.log('Dataset has been successfully inflated');
    });
