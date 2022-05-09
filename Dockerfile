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
    && SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) npm run build \
#    && npm prune --omit=dev \ 由于 Next.JS 的 optimizeFonts 功能有 BUG，所以暂时不能 prune
    && npm cache clean --force

CMD npm run start
