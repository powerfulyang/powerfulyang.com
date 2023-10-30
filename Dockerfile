# 第一阶段，安装依赖
FROM node:lts-alpine AS dependencies

WORKDIR /usr/app

COPY package.json pnpm-lock.yaml .npmrc ./
COPY patches/ ./patches/
COPY postinstall.mjs ./postinstall.mjs

RUN apk add --no-cache tzdata \
    && echo "Asia/Shanghai" > /etc/timezone \
    && npm i -g pnpm \
    && pnpm install --frozen-lockfile

# 第二阶段，拷贝依赖并 build
FROM node:lts-alpine AS builder

WORKDIR /usr/app
ARG BUILD_ENV
ARG NODE_OPTIONS="--max_old_space_size=4096"

COPY . .

# 从这里开始就 miss cache
COPY --from=dependencies /usr/app/node_modules ./node_modules

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN npm i -g pnpm  \
    && if [ "$BUILD_ENV" = "prod" ]; then \
        SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) \
        pnpm run build; \
    else \
        pnpm run build; \
    fi \
    && pnpm prune --prod


# 第三阶段，runner
FROM node:lts-alpine AS runner

WORKDIR /usr/app
RUN chown -R node:node /usr/app
USER node

COPY --from=dependencies /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
COPY --from=dependencies /etc/timezone /etc/timezone

COPY --chown=node:node --from=builder /usr/app/.next ./.next
COPY --chown=node:node --from=builder /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/app/package.json ./package.json
COPY --chown=node:node --from=builder /usr/app/public ./public
COPY --chown=node:node --from=builder /usr/app/next.config.mjs ./next.config.mjs
COPY --chown=node:node --from=builder /usr/app/runtimeCaching.mjs ./runtimeCaching.mjs

CMD ["npm", "run", "start"]
