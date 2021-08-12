FROM node:lts-alpine3.14

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .

RUN npm ci --production --quiet && npm cache clean --force

COPY .next/ ./.next/

COPY public/ ./public/

CMD npm run start
