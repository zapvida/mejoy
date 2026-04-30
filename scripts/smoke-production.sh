#!/bin/bash
# Smoke tests para produção - B2B APIs
# Uso: ./scripts/smoke-production.sh SEU_DOMINIO

set -e

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "❌ Erro: Forneça o domínio de produção"
  echo "Uso: ./scripts/smoke-production.sh https://seu-dominio.com"
  exit 1
fi

# Remove trailing slash
DOMAIN="${DOMAIN%/}"

echo "🧪 Smoke Tests - Produção"
echo "=========================="
echo "Domínio: $DOMAIN"
echo ""

# 1. Upload Logo
echo "1️⃣ Testando upload-logo..."
UPLOAD_RESP=$(curl -sS -X POST "$DOMAIN/api/branding/upload-logo" \
  -H "Content-Type: application/json" \
  -d '{"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottQAAAABJRU5ErkJggg=="}')

UPLOAD_URL=$(echo "$UPLOAD_RESP" | jq -r '.url // empty' 2>/dev/null)
if [ -n "$UPLOAD_URL" ]; then
  echo "✅ Upload OK: $UPLOAD_URL"
else
  echo "❌ Upload FALHOU: $UPLOAD_RESP"
  exit 1
fi

# 2. Criar Draft
echo ""
echo "2️⃣ Testando criar draft..."
DRAFT_RESP=$(curl -sS -X POST "$DOMAIN/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Clínica QA","brandColor":"#10b981","accentColor":"#059669","ctaText":"Falar no WhatsApp","ctaUrl":"https://wa.me/5500000000000"}')

DRAFT_ID=$(echo "$DRAFT_RESP" | jq -r '.id // empty' 2>/dev/null)
DRAFT_STATUS=$(echo "$DRAFT_RESP" | jq -r '.ok // false' 2>/dev/null)

if [ -n "$DRAFT_ID" ] && [ "$DRAFT_STATUS" = "true" ]; then
  echo "✅ Draft criado: $DRAFT_ID"
  echo "   Status: $(echo "$DRAFT_RESP" | jq -r '.draft.name // "N/A"')"
else
  echo "❌ Criar draft FALHOU: $DRAFT_RESP"
  exit 1
fi

# 3. Consultar Draft
echo ""
echo "3️⃣ Testando consultar draft..."
CONSULT_RESP=$(curl -sS "$DOMAIN/api/branding/draft?id=$DRAFT_ID")

CONSULT_NAME=$(echo "$CONSULT_RESP" | jq -r '.draft.name // empty' 2>/dev/null)
if [ -n "$CONSULT_NAME" ]; then
  echo "✅ Consultar draft OK: $CONSULT_NAME"
else
  echo "❌ Consultar draft FALHOU: $CONSULT_RESP"
  exit 1
fi

# 4. Sandbox URL
echo ""
echo "✅ TODOS OS TESTES PASSARAM!"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Abra o sandbox: $DOMAIN/b2b/sandbox?draft=$DRAFT_ID"
echo "   2. Teste o fluxo completo: sandbox → triagem → relatório → PDF"
echo ""
echo "📋 Checklist:"
echo "   - [ ] Sandbox carrega logo/cores"
echo "   - [ ] Botão 'Testar triagem' funciona"
echo "   - [ ] Triagem completa funciona"
echo "   - [ ] Relatório com branding"
echo "   - [ ] PDF baixa corretamente"

