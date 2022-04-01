FROM node:lts-alpine3.14

WORKDIR /usr/app

COPY . .

RUN npm ci --quiet && npm cache clean --force

CMD npm run start
