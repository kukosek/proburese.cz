#!/bin/sh
rsync -r ./* --exclude 'node_modules' --exclude '.env' proburese:/home/proburese/

ssh -T proburese << EOL
cd /home/proburese/
npm i
npm run build
pkill -f nuxt -TERM

EOL
