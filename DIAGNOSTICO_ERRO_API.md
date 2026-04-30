# 🔍 DIAGNÓSTICO DO ERRO DA API

**Status:** Em investigação

---

## 📋 O QUE JÁ FOI FEITO

1. ✅ Model `BrandingDraft` adicionado ao `schema.prisma`
2. ✅ `DIRECT_URL` configurado no schema
3. ✅ Prisma Client regenerado
4. ✅ Tabela criada no Supabase (você executou o SQL)
5. ✅ Código usando campos corretos

---

## 🐛 ERRO ATUAL

**Resposta:** `Internal Server Error` (sem detalhes)

**Possíveis causas:**
1. **Rate limiting** - O `withRateLimit` pode estar bloqueando
2. **Erro no catch global** - O erro está sendo capturado no catch geral
3. **Erro antes do Prisma** - Pode estar falhando antes de chegar no banco

---

## 🔧 PRÓXIMOS PASSOS

### 1. Verificar logs do servidor
```bash
tail -f /tmp/dev-test-final.log | grep -i "branding\|draft\|error"
```

### 2. Testar sem rate limit (temporário)
Já adicionei debug no código. Agora preciso ver os logs reais.

### 3. Verificar se a tabela realmente existe
No Supabase Table Editor, confirme que a tabela `BrandingDraft` existe e tem os campos corretos.

---

**Execute o comando abaixo e me mostre a saída:**
```bash
curl -s -X POST "http://localhost:3000/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}' | jq '.'
```

