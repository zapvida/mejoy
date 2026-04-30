#!/bin/bash
# Script de validação de variáveis de ambiente

echo "🔍 VALIDAÇÃO DE VARIÁVEIS DE AMBIENTE"
echo "======================================"
echo ""

if [ ! -f .env.local ]; then
  echo "❌ .env.local não encontrado"
  echo "💡 Use o arquivo ENV_LOCAL_COMPLETO.txt como base"
  exit 1
fi

REQUIRED_VARS=(
  "SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_URL"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "DATABASE_URL"
  "BRANDING_BUCKET"
)

ALL_OK=true
MISSING=()

for var in "${REQUIRED_VARS[@]}"; do
  val=$(grep "^${var}=" .env.local 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
  if [ -z "$val" ] || [[ "$val" == *"OBTER"* ]] || [[ "$val" == *"PREENCHER"* ]] || [[ "$val" == *"<"* ]]; then
    echo "❌ $var: NÃO CONFIGURADO"
    ALL_OK=false
    MISSING+=("$var")
  else
    # Mostrar apenas primeiros e últimos caracteres para segurança
    if [[ "$var" == *"KEY"* ]] || [[ "$var" == *"PASSWORD"* ]]; then
      masked="${val:0:10}...${val: -5}"
      echo "✅ $var: OK ($masked)"
    else
      echo "✅ $var: OK"
    fi
  fi
done

echo ""
if [ "$ALL_OK" = true ]; then
  echo "✅ TODAS AS VARIÁVEIS CONFIGURADAS!"
  echo ""
  echo "🧪 Próximo passo: Testar APIs"
  echo "   pnpm dev"
  echo "   curl -X POST http://localhost:3000/api/branding/upload-logo ..."
else
  echo "❌ VARIÁVEIS FALTANDO:"
  for var in "${MISSING[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "💡 Como obter SUPABASE_SERVICE_ROLE_KEY:"
  echo "   1. Acesse: https://supabase.com/dashboard/project/qltixyfxxrbdnaldgtzr/settings/api-keys"
  echo "   2. Aba 'Legacy API Keys' → 'service_role secret'"
  echo "   3. Clique no ícone de olho para revelar"
  echo "   4. Copie e cole no .env.local"
fi

