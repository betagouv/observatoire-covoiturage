#!/bin/bash
set -e
cd /home/node/app
PUBLIC_DIR="$(pwd)/../public"
git fetch
git merge $1
./install.sh $PUBLIC_DIR
