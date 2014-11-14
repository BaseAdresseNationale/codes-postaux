var _ = require('lodash');
var data = require('./codes-postaux.json');
var index = _.groupBy(data, 'codePostal');

exports.listByCodePostal = function(codePostal) {
    var key = codePostal.toString();
    return (key in index) ? index[key] : [];
};
