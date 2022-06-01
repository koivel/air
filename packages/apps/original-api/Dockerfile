FROM node:lts-alpine
WORKDIR /app
COPY dist/packages/apps/original-api .
EXPOSE 3333
RUN npm install --production
CMD node ./main.js