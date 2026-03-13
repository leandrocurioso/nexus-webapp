#!/bin/bash

cd ./frontend
npm run build

rm -rf ../backend/public
mkdir -p ../backend/public

cp -r dist/* ../backend/public/
