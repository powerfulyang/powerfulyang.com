FROM powerfulyang/powerfulyang.com-base

COPY . .

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN pnpm run bootstrap \
#    && npm ci --quiet \
#    && SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) npm run build \
#    && rm -rf next.config.mjs \
#    && npm prune --omit=dev \
#    && npm cache clean --force \
    && SENTRY_AUTH_TOKEN=$(cat /run/secrets/SENTRY_AUTH_TOKEN) pnpm run build

CMD pnpm run start
