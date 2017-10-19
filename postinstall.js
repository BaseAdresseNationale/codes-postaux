var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGunzip();

var sourceFile = __dirname + '/communes.json.gz';
var destFile = __dirname + '/communes.json';

// Just inflate json file
fs.createReadStream(sourceFile)
    .pipe(gzip)
    .pipe(fs.createWriteStream(destFile))
    .on('finish', function () {
        console.log('Dataset has been successfully inflated');
    });
