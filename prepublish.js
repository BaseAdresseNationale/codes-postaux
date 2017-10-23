var request = require('request');
var fs = require('fs');
var assert = require('assert');


request('https://geo.api.gouv.fr/communes', {
    json: true,
    qs: {
        boost: 'population',
        fields: 'nom,code,codesPostaux,population',
    },
}, function (error, response, body) {
    assert.ok(response.statusCode == 200, `Response status code should be 200 (not ${response.statusCode}).`);
    assert.ok(500 < body.length, `Too few cities (${body.length})`);
    assert.ok(body.length < 40000, `Too many cities (${body.length})`);

    fs.writeFileSync('communes.json', JSON.stringify(body, null, 1));
});

