FROM node:14.0-alpine3.11

WORKDIR /usr/app

COPY package.json .

COPY package-lock.json .

RUN npm install --production --quiet && npm cache clean --force

COPY .next/ ./.next/

COPY public/ ./public/

CMD npm run start
