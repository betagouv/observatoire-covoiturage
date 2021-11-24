#!/bin/sh
echo "Install api"
(cd api && npm ci && npm run build)

echo "Build frontend"
(cd observatoire && npm ci && NODE_ENV=production NUXT_TELEMETRY_DISABLED=1 npm run generate && [ ! -z "$1" ] && cp -R dist/* $1 || exit 0)

