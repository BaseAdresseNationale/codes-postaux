const index = {}

for (const entry of require('./codes-postaux.json')) {
  if (!(entry.codePostal in index)) {
    index[entry.codePostal] = []
  }

  index[entry.codePostal].push(entry)
}

exports.find = function (postalCode) {
  return index[postalCode] || []
}
