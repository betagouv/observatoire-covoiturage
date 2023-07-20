#!/bin/bash
set -e
cd /home/node/app
PUBLIC_DIR="$(pwd)/../public"
git fetch
git merge $1
npm install -g npm@latest
./install.sh $PUBLIC_DIR
