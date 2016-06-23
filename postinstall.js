var fs = require('fs');
var zlib = require('zlib');

var gzip = zlib.createGunzip();

var sourceFile = __dirname + '/codes-postaux.json.gz';
var destFile = __dirname + '/codes-postaux.json';


if (fs.existsSync(sourceFile)) {
    inflateDataset();
} else {  // we're added as a dependency
    require('./prepublish.js').on('finish', inflateDataset);
}


function inflateDataset() {
    fs.createReadStream(sourceFile)
        .pipe(gzip)
        .pipe(fs.createWriteStream(destFile))
        .on('finish', function () {
            console.log('Dataset has been successfully inflated');
        });
}
