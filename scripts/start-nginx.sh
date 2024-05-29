#!/usr/bin/env bash
# https://developers.redhat.com/blog/2021/03/04/making-environment-variables-accessible-in-front-end-containers#inject_the_environment_variables
cp /usr/share/nginx/html/static/js/*.js /tmp

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in /tmp/*.js;
do
cat $file | envsubst $EXISTING_VARS | tee /usr/share/nginx/html/static/js/$(basename $file) &> /dev/null;
done
nginx -g 'daemon off;'