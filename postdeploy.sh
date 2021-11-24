#!/bin/bash
set -e 
PUBLIC_DIR="$(pwd)/../public"
git fetch
git merge $1
./install.sh
