FROM node:lts-alpine3.14

WORKDIR /usr/app

COPY . .

# 解决时间格式化 时区不一致的问题
RUN apk add --no-cache tzdata \
        && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone \
        && apk del tzdata \
        && npm ci --quiet \
        && npm cache clean --force \
        && npm run build

CMD npm run start
