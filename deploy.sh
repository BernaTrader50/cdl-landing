#!/bin/bash
set -e
echo "Building with vite..."
npx vite build

echo "Deploying with wrangler (using dist)..."
# Cambiar main a dist temporalmente
node -e "
const fs = require('fs');
const cfg = fs.readFileSync('wrangler.jsonc', 'utf8');
fs.writeFileSync('wrangler.jsonc.bak', cfg);
fs.writeFileSync('wrangler.jsonc', cfg.replace('\"main\": \"src/server.ts\"', '\"main\": \"dist/server/server.js\"'));
"

CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN} npx wrangler deploy

# Restaurar
cp wrangler.jsonc.bak wrangler.jsonc
rm wrangler.jsonc.bak
echo "✅ Deploy completado"
