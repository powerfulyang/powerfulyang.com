FROM powerfulyang/powerfulyang.com-base

COPY next.config.mjs .
COPY package.json .
COPY public ./public
COPY .next ./.next

CMD pnpm run start
