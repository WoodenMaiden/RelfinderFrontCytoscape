FROM nginx:alpine

COPY scripts /usr/bin
COPY . /build

WORKDIR /build

RUN apk add --update nodejs npm
RUN npm i 

ENTRYPOINT [ "/docker-entrypoint.sh", "fill-envvar.sh" ]
CMD ["start-nginx.sh"]