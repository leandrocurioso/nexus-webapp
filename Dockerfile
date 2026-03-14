FROM node:24-alpine

ARG SERVER_API_HOST
ENV SERVER_API_HOST=$SERVER_API_HOST

WORKDIR /usr/src/app

COPY . .

RUN rm -rf ./frontend/node_modules
RUN rm -rf ./backend/node_modules
RUN rm -rf ./backend/public
RUN mkdir -p ./backend/public
RUN rm -rf Dockerfile

WORKDIR /usr/src/app/frontend

RUN npm install
RUN npm run build

WORKDIR /usr/src/app/backend
RUN npm install

EXPOSE 3010

CMD [ "node", "server.js" ]
