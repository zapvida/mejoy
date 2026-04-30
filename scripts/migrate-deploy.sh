#!/usr/bin/env bash
# Aplica migrations com DATABASE_URL de .env.local (Prisma só carrega .env por padrão)
# Uso: pnpm migrate:deploy  ou  bash scripts/migrate-deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

# Carrega .env.local via Node (mais robusto que source com valores especiais)
if [ -f .env.local ]; then
  node -e "
    require('dotenv').config({ path: '.env.local' });
    if (!process.env.DATABASE_URL) {
      console.error('ERRO: DATABASE_URL não encontrada em .env.local');
      process.exit(1);
    }
    require('child_process').execSync('pnpm prisma migrate deploy', { stdio: 'inherit', env: process.env });
  "
else
  echo "Aviso: .env.local não encontrado. Usando env do shell."
  pnpm prisma migrate deploy
fi
