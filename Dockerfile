FROM node:16 as build

# https://developers.redhat.com/blog/2021/03/04/making-environment-variables-accessible-in-front-end-containers#inject_the_environment_variables

WORKDIR /app
ENV JQ_VERSION=1.6

ENV RFR_API_URL=http://localhost:8080

RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq

COPY . .
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/config.json > ./src/config.tmp.json && mv ./src/config.tmp.json ./src/config.json

RUN npm ci --silent
RUN npm run build


FROM bitnami/nginx:1.25.5-debian-12-r0

COPY ./scripts/run.sh /opt/bitnami/scripts/nginx/run.sh

COPY --from=build /app/build .

USER root
RUN chown 1001 -R /app
USER 1001

CMD [ "/opt/bitnami/scripts/nginx/run.sh" ]