var index = {}

// Index by postalCode value
require('./communes.json').forEach(function (commune) {
  commune.codesPostaux.forEach(function (codePostal) {
    if (!(codePostal in index)) {
      index[codePostal] = [];
    }
    index[codePostal].push({
      nomCommune: commune.nom,
      codeInsee: commune.code,
      codePostal: codePostal,
      population: commune.population
    });
  });
});

// Sort by population
for (var codePostal in index) {
  index[codePostal].sort(function (a, b) {
    var aPopulation = a.population || 0;
    var bPopulation = b.population || 0;
    if (aPopulation <= bPopulation) return 1;
    if (aPopulation >= bPopulation) return -1;
    return 0;
  });
}

exports.find = function(codePostal) {
    return index[codePostal] || [];
};
