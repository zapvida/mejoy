# ✅ CHECKLIST DEPLOY LOTE F — Virada B2B2C

**Status**: Código implementado ✅ | Aguardando deploy Vercel

---

## 📋 IMPLEMENTAÇÃO COMPLETA

### Arquivos Criados/Modificados ✅

1. ✅ `src/components/b2b/B2BLanding.tsx` — LP B2B2C criada
2. ✅ `src/pages/index.tsx` — SSR router implementado (com suporte Vercel x-forwarded-host)
3. ✅ `src/components/layout/Navbar.tsx` — Links/CTAs condicionais B2B
4. ✅ `src/lib/flags.ts` — Validado (já existia)
5. ✅ `src/lib/host.ts` — Validado (já existia)
6. ✅ `src/styles/theme.css` — Validado (já existia)
7. ✅ `src/pages/_app.tsx` — Tema aplicado (já estava)
8. ✅ `src/components/home/B2CLanding.tsx` — Validado (já existia)

---

## 🚀 AÇÕES NECESSÁRIAS NO VERCEL

### 1. Variáveis de Ambiente (Obrigatórias)

Acesse: Vercel → Projeto → Settings → Environment Variables

Adicione/Valide:

```env
NEXT_PUBLIC_CUSTOMER_MODE=b2b
NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com
NEXT_PUBLIC_BRAND_NAME=Aistotele
NEXT_PUBLIC_SHOW_SALES_ASSISTANT=1
```

⚠️ **IMPORTANTE**: Certifique-se de que essas variáveis estão aplicadas em **Production**.

---

### 2. Redeploy

1. Faça commit e push das alterações
2. Ou acione um redeploy manual no Vercel
3. Aguarde o deploy completar

---

## ✅ VALIDAÇÃO PÓS-DEPLOY

### Teste 1: Root B2B2C
```
Acesse: https://aistotele.com
```

**Esperado**:
- ✅ Hero: "Triagens inteligentes **com a sua marca**"
- ✅ Badge: "White-label pronto • Entrega em minutos"
- ✅ CTAs: "Assinar em 2 min" | "Ver demonstração"
- ✅ Navbar: Links "Produto / Como Funciona / Casos / Recursos / Planos"
- ✅ Paleta Emerald Trust aplicada (verde #0fbf71)

### Teste 2: Tenant B2C (Preservado)
```
Acesse: https://alloehealth.com.br (ou outro tenant)
```

**Esperado**:
- ✅ Hero: "Seu check-up de saúde completo — rápido e gratuito"
- ✅ CTA: "Começar meu check-up"
- ✅ Navbar: Links "Triagem / Sobre / FAQ"
- ✅ Tema padrão do tenant (não Emerald)

---

## 🧪 TESTES LOCAIS (Opcional)

```bash
# Build
pnpm build

# Start
pnpm start

# Teste B2C
curl -s http://localhost:3000/ | grep -q "Começar meu check-up" && echo "✅ B2C OK"

# Teste B2B (simulando host)
curl -s -H "Host: aistotele.com" http://localhost:3000/ | grep -q "White-label" && echo "✅ B2B OK"
```

---

## 🔍 DEBUG (Se não funcionar)

### 1. Verificar ENVs no Vercel
- Production tem todas as 4 variáveis?
- Valores estão corretos (sem espaços/erros de digitação)?

### 2. Verificar Build Log
- Build passou sem erros?
- Algum warning sobre variáveis não encontradas?

### 3. Console do Browser
- Abrir DevTools → Console
- Verificar erros JavaScript
- Verificar se `isB2BRoot` está sendo detectado no SSR

### 4. Verificar SSR Props
- No DevTools → Network → Response da página `/`
- Procurar `"isB2BRoot":true` no JSON (`__NEXT_DATA__`)

---

## 🎨 TROCAR PALETA (Opcional)

Se quiser testar outra paleta no root:

Edite `src/pages/_app.tsx`, linha 66:

```tsx
// Atual (Emerald Trust)
cls.add('theme-emerald');

// Opção B (Navy Teal)
cls.add('theme-navyteal');

// Opção C (Slate + Lime)
cls.add('theme-lime');
```

---

## 🔄 ROLLBACK (Se necessário)

**Opção 1**: Remover ENV no Vercel
- Delete ou limpe `NEXT_PUBLIC_ROOT_B2B_DOMAINS`
- Redeploy

**Opção 2**: Forçar B2C no código
- Edite `src/pages/index.tsx`, linha 15:
```tsx
return { props: { isB2BRoot: false } };
```
- Redeploy

---

## 📊 STATUS FINAL

| Item | Status |
|------|--------|
| Código implementado | ✅ |
| Build local OK | ✅ |
| ENVs configurados no Vercel | ⏳ Pendente |
| Deploy em produção | ⏳ Pendente |
| Validação pós-deploy | ⏳ Pendente |

---

**Próximo passo**: Configure as ENVs no Vercel e faça o redeploy! 🚀

