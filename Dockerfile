FROM powerfulyang/powerfulyang.com.base:latest

WORKDIR /usr/app

COPY .next/ ./.next/

COPY public/ ./public/

CMD npm run start
