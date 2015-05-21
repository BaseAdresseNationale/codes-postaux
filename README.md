French postal codes API for Node.js
------

Based on the [official postal codes database](https://www.data.gouv.fr/fr/datasets/base-officielle-des-codes-postaux/) from [La Poste](http://www.laposte.fr/) and fixed by [Christian Quest](https://github.com/cquest).

## Usage
```js
var codesPostaux = require('codes-postaux');

codesPostaux.find(75001);
codesPostaux.find('75001');
```

Will return
```js
[ { codeInsee: '75101',
    nomCommune: 'PARIS 01',
    codePostal: '75001',
    libelleAcheminement: 'PARIS' } ]
```