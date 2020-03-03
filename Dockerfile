FROM node:10.19.0-alpine

WORKDIR /usr/app

COPY . .

RUN npm install --quiet && npm run build --quiet

CMD npm run start
