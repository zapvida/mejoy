# 🚨 CORREÇÃO URGENTE - API Draft 500

**Problema:** API `/api/branding/draft` retorna 500 "Internal error" em produção

**Status:** ✅ Upload de logo funciona (bucket OK)
**Status:** ❌ Criar draft falha (500)

---

## 🔍 DIAGNÓSTICO

### Possíveis causas:
1. **Prisma Client não gerado no deploy** - `brandingDraft` não existe
2. **Tabela não existe no banco** - Migration não rodou
3. **Erro de conexão** - `DIRECT_URL` não configurada
4. **Schema mismatch** - Campos não batem

---

## ✅ CORREÇÃO APLICADA

Adicionado logging detalhado para identificar o erro exato:
- Log completo do erro (message, code, stack, meta)
- Retorno de detalhes em produção (para debug)
- Hints específicos por código de erro Prisma

---

## 🚀 PRÓXIMOS PASSOS

### 1. Deploy da correção
```bash
git add -A
git commit -m "fix: melhorar logging e debug da API draft"
git push
vercel --prod
```

### 2. Testar novamente
```bash
curl -s -X POST "https://aistotele.com/api/branding/draft" \
  -H "Content-Type: application/json" \
  -d '{"fantasyName":"Teste","brandColor":"#10b981","accentColor":"#059669","ctaText":"Teste","ctaUrl":"https://wa.me/123"}' | jq '.'
```

**Agora vai mostrar o erro detalhado!**

### 3. Verificar logs do Vercel
- Vercel Dashboard → Deployments → Último deploy → Functions
- Procurar por `[branding/draft][POST]` nos logs

---

## 🔧 CORREÇÕES POSSÍVEIS (Após ver o erro)

### Se erro for "brandingDraft is not defined":
- Prisma Client não foi gerado
- Solução: Garantir `postinstall: prisma generate` no package.json ✅ (já feito)

### Se erro for "Table does not exist":
- Tabela não foi criada no banco
- Solução: Executar SQL no Supabase (você já fez ✅)

### Se erro for "P1001" ou "P1017":
- Conexão com banco falhou
- Solução: Verificar `DATABASE_URL` e `DIRECT_URL` no Vercel

### Se erro for "P2003" ou outro código Prisma:
- Verificar mensagem específica no log

---

## 📋 CHECKLIST

- [ ] Deploy da correção executado
- [ ] Teste novamente e veja o erro detalhado
- [ ] Verificar logs do Vercel
- [ ] Aplicar correção específica baseada no erro

---

**Execute o deploy e me mostre o erro detalhado que aparecer!**

