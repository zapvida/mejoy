# Plano Rebrand E-commerce MeJoy — Laranja, Preto e Branco

## Executado em: 2025-03-01

### Alterações realizadas

1. **Design tokens** (`src/styles/design-tokens.css` + `globals.css`)
   - `--brand` e escala `--brand-*`: verde → laranja forte (#EA580C, HSL 24 95% 47%)
   - `--ring` e `--shadow-brand-*` atualizados para laranja

2. **Store V2**
   - `StorefrontHeader`: emerald → brand
   - `StorefrontFooter`: hovers em brand-400
   - `TrustBar`, `ProductCard`, `ObjectiveSections`, `AddToCartButton`: já usam tokens

3. **Checkout e Pedidos**
   - `checkout/index.tsx`: CTAs em brand
   - `pedidos/[orderId].tsx`: timeline e botão WhatsApp em brand

4. **B2CLanding (fallback quando Store V2 OFF)**
   - `FooterB2C`: green → brand
   - `BenefitsB2C`, `StepsB2C`, `CasesB2C`: emerald → amber (alinhamento brand)
   - `ProductsPreview`: verde → brand

---

## Checklist manual pós-deploy

Execute **após** o deploy estar em produção:

| # | Ação | Onde / Como |
|---|------|-------------|
| 1 | Conferir deploy | https://vercel.com/monjoy-mejoy/zapfarm/deployments — status "Ready" |
| 2 | Verificar envs | Vercel → Settings → Env: `STORE_V2=1`, `NEXT_PUBLIC_STORE_V2=1` |
| 3 | Teste visual home | https://www.mejoy.com.br — cores laranja/preto/branco |
| 4 | Teste mobile | Chrome DevTools → Toggle device toolbar |
| 5 | Compra E2E | Home → PDP → Carrinho → Checkout → PIX |
| 6 | Webhook Asaas | URL: `https://www.mejoy.com.br/api/asaas/webhook` — token configurado |
| 7 | Admin | `/admin/store-v2/orders` — pedidos visíveis |
| 8 | Rollback se necessário | `STORE_V2=0`, `NEXT_PUBLIC_STORE_V2=0` → Redeploy |

---

## Rollback imediato

1. Vercel → Settings → Environment Variables
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`
3. Salvar → Redeploy
