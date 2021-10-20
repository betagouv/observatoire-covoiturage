#!/bin/sh
echo "Install api"
(cd api && npm ci && npm run build)

echo "Build frontend"
(cd observatoire && npm ci && NODE_ENV=production NUXT_TELEMETRY_DISABLED=1 npm run generate && [ ! -z "$PUBLIC_DIR" ] && cp -R dist $PUBLIC_DIR || exit 0)
