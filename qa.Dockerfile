FROM powerfulyang/powerfulyang.com-base

COPY . .

RUN pnpm run bootstrap \
    && DISABLE_SENTRY_CLI=true pnpm run build

CMD npm run start
