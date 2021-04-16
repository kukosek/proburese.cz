#!/bin/sh
docker build -t docker.dulik.net/proburese-builder -f builder/Dockerfile .
docker build -t docker.dulik.net/proburese-api -f ./server-middleware/api/Dockerfile .
docker build -t docker.dulik.net/proburese-nuxt .
docker build -t docker.dulik.net/proburese-scrape -f server-middleware/scrape/Dockerfile .
