#!/bin/bash

set -e
cd `dirname $0`

curl --silent --output communes.json https://geo.api.gouv.fr/communes\?fields\=nom,code,codesPostaux,departement,population,region\&boost\=population
gzip --force communes.json
