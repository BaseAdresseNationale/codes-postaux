var request = require('request');
var fs = require('fs');


request('https://geo.api.gouv.fr/communes', {
    qs: {
        boost: 'population',
        fields: 'nom,code,codesPostaux,population',
    },
}).pipe(fs.createWriteStream('communes.json'));
