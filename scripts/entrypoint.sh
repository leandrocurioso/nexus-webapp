#!/bin/sh

set -e

echo "Preparing config json file..."
node ./scripts/prepare-config-json-webapp.js

rm ./backend/public/config.json
cp ./frontend/config.json ./backend/public/config.json 

echo "Starting the server..."
node ./backend/server.js