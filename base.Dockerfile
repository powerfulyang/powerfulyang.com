FROM node:lts-alpine

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches ./patches

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata \
    && npm i -g pnpm \
    && pnpm install -P
