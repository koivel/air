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
RUN yarn nx run original-api:build:production

FROM node:lts-alpine
WORKDIR /app
COPY --from=0 /build/dist/apps/original-api .
RUN npm install --production
EXPOSE 3333
CMD node ./main.js