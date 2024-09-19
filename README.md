Codes postaux
------

Ce dépôt contient les scripts permettant de générer le [fichier des codes postaux](https://www.data.gouv.fr/fr/datasets/5a9ac6b9c751df4caed2b133/) ainsi qu'un module [Node.js](https://nodejs.org) permettant de l'interroger facilement.

## Données

### Sources

Les données de base sont produites à partir du [Code Officiel Géographique](https://www.data.gouv.fr/fr/datasets/58c984b088ee386cdb1261f3/) de l'INSEE et du  [FIMOCT](https://www.data.gouv.fr/fr/datasets/5a3cc6b588ee3858d95178fc/) de la DGFiP.

[!WARNING]
Les fichiers FIMOCT ne sont plus générés depuis 2023.

### Production

```bash
npm install
npm run build
```

## Module JavaScript

### Installation

`$ npm install codes-postaux --save`

### Utilisation
```js
const codesPostaux = require('codes-postaux');

codesPostaux.find(75001);
codesPostaux.find('75001');
```

Retourne
```js
[ { codeCommune: '75101',
    nomCommune: 'Paris 1er Arrondissement',
    codePostal: '75001',
    libelleAcheminement: 'PARIS' } ]
```


## Communes mortes pour la France

6 communes ont une population municipale nulle. Il s'agit des communes _mortes pour la France_.

```js
const COMMUNES_MORTES_POUR_LA_FRANCE = [
  '55039',
  '55050',
  '55239',
  '55307',
  '55139',
  '55189'
];
```

## Autres bibliothèques connues

| Nom de la bibliothèque | Langage | Auteur |
| --- | --- | --- |
| [codes_postaux](https://github.com/Kleak/code_postaux) | Dart | [Kleak](https://github.com/Kleak) |

## Et les données de La Poste ?

__Pourquoi ne pas utiliser la [base officielle des codes postaux](https://www.data.gouv.fr/fr/datasets/545b55e1c751df52de9b6045/) produite par La Poste ?__

Les données produites par La Poste sont diffusées sous [licence ODbL](https://fr.wikipedia.org/wiki/Open_Database_License), ce qui implique que toute base de données dérivée doit être diffusée sous cette même licence.

Par ailleurs le fichier diffusé par La Poste est moins complet puisqu'il n'indique pas quelles sont les voies ou les numéros concernés par un code postal, lorsque plusieurs postaux sont associés à une même commune.
