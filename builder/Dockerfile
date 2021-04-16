# Dockerfile
FROM node:15.14.0-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-app/
RUN rm /usr/src/nuxt-app/.env


RUN npm install

ENV GRAPHQL_SERVER_ENDPOINT="https://proburese.cz/api/graphql"
ENV GRAPHQL_ENDPOINT="https://proburese.cz/api/graphql"

RUN npm run build
