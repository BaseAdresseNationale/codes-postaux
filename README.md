French postal codes API for Node.js
------

> Recherche de nom de commune et code INSEE à partir d'un code postal.

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


## Architecture

A source CSV file is converted to JSON and compressed on `prepublish` for faster distribution.
On `postinstall`, it is unzipped.
On `require`, it is indexed and loaded into memory. Finding postal codes is just an object lookup.

## You don't use Node.js ?

Here is a list of librairies based on the same dataset.
-   [Dart](https://github.com/Kleak/code_postaux)

