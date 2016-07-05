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

## GéoAPI

Just want to quickly put together a small service? The hosted [GéoAPI](https://api.gouv.fr/api/geoapi) is a great way to build your service quickly!

However, it won't scale if you start handling lots of traffic. This module makes it easy for you to access the same database that powers the GéoAPI, on your own premises, with no centralization.

Think of the GéoAPI and this `codes-postaux` module as ways to increase the use of OpenData: they are just easier paths to an open database  :)


## Alternatives in other languages

These community-maintained libraries are based on the same dataset and offer equivalent features in other languages:

- [Dart](https://pub.dartlang.org/packages/code_postaux) by @Kleak ([source](https://github.com/Kleak/code_postaux)).
- Missing your favourite language? [Add your implementation](https://github.com/sgmap/codes-postaux/blob/master/CONTRIBUTING.md)!


## Notes

### Notable subset

A sensible dataset to use for testing in any application that has a precondition where postal codes should map to a physical person is the “communes mortes pour la France” (“dead communes”). All of them have a population of 0, and you could thus safely remove them from your logs.

```js
const DEAD_INSEE_CODES = [ '55039', '55050', '55239', '55307', '55139', '55189' ];
```

> An implementation with a getter is available in b23725be5908c0ab202103935c03062582067f84. It was reverted to limit the API surface to its minimum.

### Architecture

A source CSV file is converted to JSON and compressed on `prepublish` for faster distribution.
On `postinstall`, it is unzipped.
On `require`, it is indexed and loaded into memory. Finding postal codes is just an object lookup.
