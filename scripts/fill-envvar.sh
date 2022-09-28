#!/bin/sh
set -e

variable=/build/src/variables.js

echo 'Fill env variables'

if [ -n "${API_URL}" ]; then 
    # comma can be used as a separator
    sed -i "/const API_URL/ s,\bnull\b,'$API_URL'," "$variable"
fi 

exec "$@"