# ✅ VALIDAÇÃO PÓS-DEPLOY — LOTE F

**Data**: $(date)  
**Status**: Aguardando validação em produção

---

## 🎯 VALIDAÇÃO RÁPIDA (5 minutos)

### 1. Root B2B2C — `https://aistotele.com`

**O que verificar**:

#### Hero Section
- [ ] ✅ Título: "Triagens inteligentes **com a sua marca**"
- [ ] ✅ Badge: "White-label pronto • Entrega em minutos"
- [ ] ✅ Descrição: "Gere valor imediato, aqueça leads..."
- [ ] ✅ CTAs: "Assinar em 2 min" (verde) | "Ver demonstração" (outline)

#### Navbar
- [ ] ✅ Links: "Produto / Como Funciona / Casos / Recursos / Planos"
- [ ] ✅ CTAs: "Ver demonstração" (ghost) | "Assinar em 2 min" (brand verde)
- [ ] ❌ NÃO deve aparecer: "Triagem / Sobre / FAQ"

#### Paleta/Escudo Visual
- [ ] ✅ Cor primária: Verde #0fbf71 (Emerald Trust)
- [ ] ✅ Background suave: #eefcf6 (em seções alternadas)
- [ ] ✅ Botões verdes quando hover (não azul/cinza)

#### Seções Esperadas
- [ ] ✅ "O que sua empresa ganha" (6 cards)
- [ ] ✅ "Do zero ao go-live em 4 passos"
- [ ] ✅ "Casos de sucesso" (Alloe Health, ZapVida)
- [ ] ✅ "Recursos" (lista de 6 itens)
- [ ] ✅ "Perguntas frequentes" (4 FAQs)

#### Sales Assistant
- [ ] ✅ Botão flutuante "?" (canto inferior direito) — se ENV `SHOW_SALES_ASSISTANT=1`

---

### 2. Tenant B2C Preservado — Ex: `https://alloehealth.com.br`

**O que verificar**:

#### Hero Section
- [ ] ✅ Título: "Seu check-up de saúde completo — rápido e gratuito"
- [ ] ✅ CTA: "Começar meu check-up"

#### Navbar
- [ ] ✅ Links: "Triagem / Sobre / FAQ"
- [ ] ✅ CTA: "Atendimento imediato" (ou customizado pelo tenant)
- [ ] ❌ NÃO deve aparecer: "Produto / Como Funciona / Casos..."

#### Visual
- [ ] ✅ Tema padrão do tenant (não Emerald)
- [ ] ✅ Cores do tenant preservadas

---

## 🔍 DEBUG (Se algo não funcionar)

### Console do Browser (DevTools → Console)

1. **Verificar SSR Props**:
   - Abra DevTools → Network
   - Recarregue a página
   - Clique na requisição principal (document)
   - Procure por `__NEXT_DATA__` na resposta
   - Verifique: `"pageProps":{"isB2BRoot":true}` (para aistotele.com)

2. **Verificar Variáveis**:
   - No Console, digite:
   ```javascript
   // Deve retornar true para aistotele.com
   window.location.hostname === 'aistotele.com'
   ```

3. **Verificar Classes CSS**:
   - No Console:
   ```javascript
   document.documentElement.classList.contains('theme-emerald')
   // Deve ser true no root
   ```

### Vercel Dashboard

1. **Verificar ENVs**:
   - Settings → Environment Variables
   - Confirmar que todas as 4 variáveis estão em **Production**:
     - `NEXT_PUBLIC_CUSTOMER_MODE=b2b`
     - `NEXT_PUBLIC_ROOT_B2B_DOMAINS=aistotele.com,www.aistotele.com`
     - `NEXT_PUBLIC_BRAND_NAME=Aistotele`
     - `NEXT_PUBLIC_SHOW_SALES_ASSISTANT=1`

2. **Verificar Build Log**:
   - Deployments → Último deploy → Build Log
   - Procurar por erros ou warnings sobre variáveis não encontradas

3. **Verificar Deploy**:
   - Status: "Ready" (verde)
   - URL de produção apontando para o deploy correto

---

## 🐛 PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: Root ainda mostra B2C

**Possíveis causas**:
1. ❌ ENVs não configuradas no Vercel Production
2. ❌ Cache do browser/CDN
3. ❌ Deploy não aplicado

**Solução**:
1. Verificar ENVs no Vercel (Production)
2. Hard reload (Cmd+Shift+R / Ctrl+Shift+R)
3. Redeploy forçado no Vercel

---

### Problema 2: Navbar mostra links errados

**Possíveis causas**:
1. ❌ `isRootB2BDomain()` não detecta corretamente
2. ❌ Cache do componente

**Solução**:
1. Verificar no Console se `isB2BRoot` é `true`
2. Limpar cache e hard reload
3. Verificar se `host` está sendo passado corretamente no SSR

---

### Problema 3: Tema não aplicado

**Possíveis causas**:
1. ❌ `theme.css` não importado
2. ❌ Classe não sendo aplicada no `_app.tsx`

**Solução**:
1. Verificar se `theme.css` está em `_app.tsx`
2. No Console: `document.documentElement.className` deve conter `theme-emerald`
3. Verificar se `isAistoteleDomain()` retorna `true`

---

## 📸 SCREENSHOTS (Opcional mas Recomendado)

Tire screenshots após validação:
- ✅ Root B2B2C (hero completo)
- ✅ Navbar root (destacar links B2B)
- ✅ Tenant B2C (comparação)

---

## ✅ CHECKLIST FINAL

- [ ] Root (`aistotele.com`) mostra LP B2B2C
- [ ] Tenant (ex: `alloehealth.com.br`) mantém LP B2C
- [ ] Navbar condicional funcionando
- [ ] Paleta Emerald aplicada no root
- [ ] CTAs funcionando (`/b2b/sandbox`, `/b2b/assinar`)
- [ ] Build verde no Vercel
- [ ] Sem erros no console do browser
- [ ] SEO correto (título/metas diferentes por domínio)

---

**Status**: ⏳ Aguardando validação em produção

Se tudo ✅ → **LOTE F CONCLUÍDO COM SUCESSO!** 🎉

