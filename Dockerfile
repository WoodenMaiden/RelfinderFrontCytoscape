FROM node:16 as build

WORKDIR /app
ENV JQ_VERSION=1.6

ENV API_URL=http://localhost:8080

RUN wget --no-check-certificate https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 -O /tmp/jq-linux64
RUN cp /tmp/jq-linux64 /usr/bin/jq
RUN chmod +x /usr/bin/jq

COPY . .
RUN jq 'to_entries | map_values({ (.key) : ("$" + .key) }) | reduce .[] as $item ({}; . + $item)' ./src/config.json > ./src/config.tmp.json && mv ./src/config.tmp.json ./src/config.json

RUN npm ci --silent
RUN npm run build


FROM nginx:latest

ENV JSFOLDER=/usr/share/nginx/html/static/js/*.js

COPY ./scripts/start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh
WORKDIR /usr/share/nginx/html

COPY --from=0 /app/build .

ENTRYPOINT [ "start-nginx.sh" ]