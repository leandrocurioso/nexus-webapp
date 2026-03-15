FROM node:24-alpine

WORKDIR /usr/src/app

COPY . .

RUN rm -rf ./docker-compose.yml
RUN rm -rf ./readme.md
RUN rm -rf ./sql
RUN rm -rf ./.gitignore
RUN rm -rf ./.git
RUN rm -rf ./Makefile
RUN rm -rf ./frontend/node_modules
RUN rm -rf ./frontend/example.config.json
RUN rm -rf ./backend/node_modules
RUN rm -rf ./backend/public
RUN mkdir -p ./backend/public
RUN rm -rf Dockerfile

WORKDIR /usr/src/app/frontend

RUN npm install
RUN npm run build
RUN rm -rf ./webpack.config.cjs
RUN rm -rf assets/css
RUN rm -rf assets/js
RUN find assets/html-content -type f -name "*.js" -delete

WORKDIR /usr/src/app/backend

RUN npm install

WORKDIR /usr/src/app

RUN chmod +x ./scripts/entrypoint.sh

EXPOSE 3010

CMD [ "sh", "scripts/entrypoint.sh" ]
