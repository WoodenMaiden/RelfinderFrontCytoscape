FROM node:22 as build

WORKDIR /app
COPY . .

RUN npm ci --silent
RUN npm run build


FROM bitnami/nginx:1.25.5-debian-12-r0

ENV RFR_API_URL="http://localhost:8080/"

WORKDIR /app
COPY --from=0 /app/build .

COPY ./scripts/run.sh /opt/bitnami/scripts/nginx/run.sh
CMD [ "/opt/bitnami/scripts/nginx/run.sh" ]