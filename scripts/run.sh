#!/usr/bin/env bash
# Copyright VMware, Inc.
# SPDX-License-Identifier: APACHE-2.0

# shellcheck disable=SC1091

set -o errexit
set -o nounset
set -o pipefail
# set -o xtrace # Uncomment this line for debugging purposes

# Load libraries
. /opt/bitnami/scripts/liblog.sh
. /opt/bitnami/scripts/libnginx.sh

# Load NGINX environment variables
. /opt/bitnami/scripts/nginx-env.sh

mkdir -p /opt/bitnami/nginx/conf/server_blocks

cat << EOF > /opt/bitnami/nginx/conf/server_blocks/rfr_server.conf
server {
    listen 0.0.0.0:8080;
    server_name _;

    root /app;

    location /api {
        proxy_pass ${RFR_API_URL};
    }
}

EOF

info "** Starting NGINX **"
exec "${NGINX_SBIN_DIR}/nginx" -c "$NGINX_CONF_FILE" -g "daemon off;"