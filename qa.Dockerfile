FROM powerfulyang/powerfulyang.com-base

COPY . .

RUN pnpm run bootstrap \
    && pnpm run build

CMD pnpm run start
