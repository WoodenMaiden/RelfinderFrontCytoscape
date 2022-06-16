#!/bin/sh

set -e 

npm run build
#usermod -aG 'www' root

echo 'Pass production build to nginx & start nginx'
rm /usr/share/nginx/html/index.html
mv build/* /usr/share/nginx/html

nginx -g "daemon off;"