var index = {}

// Index by postalCode value
require('./communes2016.json').forEach(function (commune) {
  commune.codesPostaux.forEach(function (codePostal) {
    if (!(codePostal in index)) {
      index[codePostal] = [];
    }
    index[codePostal].push({
      nomCommune: commune.nom,
      codeInsee: commune.code,
      population: commune.population || 0
    });
  });
});

// Sort by population
for (var codePostal in index) {
  index[codePostal].sort(function (a, b) {
    if (a.population <= b.population) return 1;
    if (a.population >= b.population) return -1;
    return 0;
  });
}

exports.find = function(codePostal) {
    return index[codePostal] || [];
};
