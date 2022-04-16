FROM node:lts-alpine3.14

WORKDIR /usr/app

COPY . .

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
        # 解决时区问题
        apk add --no-cache tzdata \
        && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone \
        && apk del tzdata \
        && npm ci --quiet \
        && npm cache clean --force \
        && SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) npm run build

CMD npm run start
