var _ = require('lodash');

var data = require('./codes-postaux.json');

var index = _.groupBy(data, 'codePostal');

exports.find = function(postalCode) {
    return index[postalCode] || [];
};
