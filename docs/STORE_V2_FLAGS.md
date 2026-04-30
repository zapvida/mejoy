# Store V2 — Feature Flags

Flags para lançamento contínuo e max conversão. **Defaults seguros: tudo OFF** exceto quando explicitamente ligado.

## Flags principais

| Env | Default | Descrição |
|-----|---------|-----------|
| `STORE_V2` | 0 | Loja nova ativa (Home/categorias/PDP/cart/checkout). Rollback: 0 |
| `NEXT_PUBLIC_STORE_V2` | 0 | Versão client para hidratação SSR |

## Max conversão (F1–F6)

| Env | Default | Descrição |
|-----|---------|-----------|
| `STORE_V2_CONVERSION` | 0 | PDP premium (trust bar, badges, como funciona, Schema). Cart premium (progress bar frete grátis regional, trust mini, upsell). Checkout validação. |
| `NEXT_PUBLIC_STORE_V2_CONVERSION` | 0 | Versão client |
| `STORE_V2_ANALYTICS` | 0 | Eventos GA4/GTM completos + purchase server-side |
| `NEXT_PUBLIC_STORE_V2_ANALYTICS` | 0 | Versão client |
| `STORE_V2_REVIEWS` | 0 | Reviews UI + verified purchase + moderação admin |
| `NEXT_PUBLIC_STORE_V2_REVIEWS` | 0 | Versão client |
| `STORE_V2_RECOVERY` | 0 | Cron recuperação carrinho abandonado (15m/4h/24h) |

## QA / Staging

| Env | Default | Descrição |
|-----|---------|-----------|
| `STORE_V2_PLAYWRIGHT_SMOKE` | 0 | Smoke tests Playwright para analytics (opcional) |
| `STORE_V2_STAGING_SIMULATE_PAID` | 0 | **APENAS STAGING.** Endpoint interno para simular PAID no E2E. **NUNCA em prod.** |

## Ativar conversão em produção

```
STORE_V2_CONVERSION=1
NEXT_PUBLIC_STORE_V2_CONVERSION=1
```

Depois de validar F1 em staging.

## Cart premium (F2)

Quando `STORE_V2_CONVERSION=1`, o carrinho exibe:

- **Progress bar**: "Faltam R$X para frete grátis". Sem CEP: R$190 (varia por região). Com CEP: threshold real (190/240/349) da região.
- **Trust mini**: Compra segura, Manipulação em até 2 dias, Suporte no WhatsApp
- **Upsell**: "Completar seu objetivo" — produtos relacionados por categoria

**Validar:** `bash scripts/validate-cart-premium.sh` (requer flag ON no build).
