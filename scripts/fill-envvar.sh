#!/bin/sh
set -e

variable=/build/src/variables.js
#variable=/ird/RelfinderFrontCytoscape/src/variables.js

echo 'Fill env variables'

if [ -n "${API_URL}" ]; then 
    sed -i "/const toreplace_API_URL/ s/\bnull\b/'$API_URL'/" "$variable"
fi 

exec "$@"