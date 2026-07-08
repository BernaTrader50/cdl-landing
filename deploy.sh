#!/bin/bash
# CDL Deploy Script — método definitivo con nitro
# Uso: CLOUDFLARE_API_TOKEN=xxx bash deploy.sh
set -e
echo "[CDL] Building with nitro..."
LOVABLE_SANDBOX=1 npx cf-vite build
echo "[CDL] Deploying to Cloudflare..."
cd dist/server
npx wrangler deploy --config wrangler.json
cd ../..
echo "[CDL] ✅ Deploy completado"
