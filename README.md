# proburese.cz

Site with messages for Bures (pro bureše) from Czechs
Login with facebook and give likes to them

Nice tech I learned to use:

- Node.js Typescript, GraphQL Apollo, type-graphql, typeorm, passport.js

## Environment variables

Create a file `.env` in the project root. Boilerplate:

```bash
HOST=0.0.0.0
PORT_NUXT=3000
PORT_APOLLO=4000

DB_TYPE=postgres
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=

GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

PRODUCTION=false

OAUTH_REDIRECT_BASEURL=http://localhost:3000

PERFORM_FULL_PARSE = false
```

Host 0.0.0.0 means your ip adress
Graphql endpoint is the url where your graphql server will be.
I have it on 3000 because I made a express.js proxy to port 4000
in development. In production I have the two apps
behind Nginx, so nginx does reverse proxying.

oauth redirect base url, is the url root path where facebook will
redirect you after login

## Build Setup

```bash
# install dependencies
$ npm install

# Start scraping (will scrape every 60 mins)
$ ts-node server-middleware/scrape.ts

# start GraphQL api server (apollo-server)
$ ts-node server-middleware/api.ts

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# or generate static project for static hosting
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
