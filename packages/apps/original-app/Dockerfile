FROM eclipse-temurin:17-jre-alpine

RUN apk -U upgrade \
  && apk add --no-cache \
    nodejs \
    npm \
    yarn \
    curl

WORKDIR /build
COPY . .
RUN rm -rf /dist
RUN rm -rf /tmp
RUN yarn install
RUN yarn nx run original-app:build:production


FROM nginx:latest
COPY --from=0 /build/packages/apps/original-app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /build/dist/packages/apps/original-app /usr/share/nginx/html
EXPOSE 80