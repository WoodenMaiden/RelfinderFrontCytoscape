#!/usr/bin/env bash
# Copyright VMware, Inc.
# SPDX-License-Identifier: APACHE-2.0

# shellcheck disable=SC1091

set -o errexit
# set -o nounset
set -o pipefail
# set -o xtrace # Uncomment this line for debugging purposes

# Load libraries
. /opt/bitnami/scripts/liblog.sh
. /opt/bitnami/scripts/libnginx.sh

# Load NGINX environment variables
. /opt/bitnami/scripts/nginx-env.sh

mkdir -pv /opt/bitnami/nginx/conf/server_blocks

if [ -z "${DISABLE_REDIRECT}" ]; then
    info "Configuring NGINX to redirect /api requests to ${RFR_API_URL}"

    if [ -z "${RFR_API_URL}" ]; then 
        error "env variable RFR_API_URL is not set. Please set it to the URL you want to redirect /api requests to."
        error "if the api is on the same host as the frontend, set the DISABLE_REDIRECT env variable."
        exit 1
    fi

    cat << EOF > /opt/bitnami/nginx/conf/server_blocks/rfr_server.conf
server {
    listen 0.0.0.0:${NGINX_HTTP_PORT_NUMBER:-8080};
    server_name _;

    root /app;

    location /api {
        rewrite ^/api(.*)\$ \$1 break;
        return 301 ${RFR_API_URL:-"http://localhost:8080/"}\$1;
    }
}

EOF
else
    info "/api will target the same host, as DISABLE_REDIRECT is set"
fi


info "** Starting NGINX **"
exec "${NGINX_SBIN_DIR}/nginx" -c "$NGINX_CONF_FILE" -g "daemon off;"