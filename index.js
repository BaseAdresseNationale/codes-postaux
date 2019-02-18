const index = {}

require('./codes-postaux.json').forEach(entry => {
  if (!(entry.codePostal in index)) {
    index[entry.codePostal] = []
  }

  index[entry.codePostal].push(entry)
})

exports.find = function (postalCode) {
  return index[postalCode] || []
}
