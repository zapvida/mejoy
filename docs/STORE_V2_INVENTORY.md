# Store V2 — Inventário do Repositório (FASE 0)

**Data:** 2026-02-28  
**Projeto:** Me Joy / mejoy.com.br — E-commerce 1P Farmácia de Manipulação

---

## Stack Atual

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 15.0.7, React 18, Tailwind, Framer Motion |
| Backend | Next.js API Routes (Pages Router) |
| Banco | PostgreSQL (Supabase) + Prisma |
| Auth | Supabase Auth, NextAuth |
| Pagamentos | **Asaas** (Pix, cartão) — principal; Stripe (parcial) |
| Email | Resend |
| WhatsApp | Evolution API (`src/lib/evolution/client.ts`) |
| Deploy | Vercel |
| Logs | pino (`src/lib/log.ts`), StructuredLogger (`src/lib/monitoring/sentry.ts`) |
| Monitoramento | Sentry (`src/lib/monitoring/sentry.ts`) |

---

## Modelos Prisma Existentes

- `Patient`, `Profile` — usuários
- `TriageSession`, `TriageStep`, `TriageReport` — triagem
- `Report`, `Triage` — relatórios
- `ZapfarmOrder` — pedidos legado (productSlug, planSlug, asaasPaymentId)
- `Subscription` — assinaturas (Asaas)
- `GiftToken`, `Consent`, `AuditLog`
- `AdminAuditLog`, `AdminAlertRule`, `AdminAlert`
- `KpiSnapshot`, `BrandingDraft`

---

## Rotas Existentes (principais)

| Rota | Uso |
|------|-----|
| `/` | Home B2C (B2CLanding) — ou B2B se domínio zapfarm |
| `/produtos` | Catálogo de protocolos |
| `/protocolos` | Check-up/triagens |
| `/[product]` | LPAC produto (ex: /emagrecimento) |
| `/[product]/checkout` | Checkout legado |
| `/emagrecimento/checkout` | Checkout emagrecimento |
| `/login`, `/dashboard` | Auth |
| `/admin` | Painel admin |
| `/api/health` | Health check |
| `/api/health/zapfarm` | Health zapfarm |
| `/api/asaas/*` | Pagamentos Asaas |

---

## Componentes Relevantes

- `B2CLanding`, `HeroB2C`, `ProductsSection`, `FooterB2C`
- `Navbar`, `ProductPlansCard`, `AsaasCheckout`
- `src/config/zapfarm/products.ts` — produtos protocolo

---

## Store V2 — O que será adicionado

- **Flags:** `STORE_V2`, `NEXT_PUBLIC_STORE_V2` em `src/lib/flags.ts`
- **Logger:** `src/lib/store-v2/logger.ts`
- **Smoke:** `scripts/smoke-store-v2.sh` (lint, build, health, páginas, import stub)

---

## Regras de Não-quebra

- Não renomear slugs/rotas existentes
- Tudo novo atrás de `STORE_V2`
- Commits pequenos, build verde sempre
