# Env Matrix MeJoy

## Required para handoff
| Env | Local | Preview | Prod | Observação |
| --- | --- | --- | --- | --- |
| `HANDOFF_TOKEN_SECRET` | recomendado | obrigatório | obrigatório | segredo dedicado do envelope |
| `NEXT_PUBLIC_ZAPVIDA_HANDOFF_URL` | recomendado | obrigatório | obrigatório | URL de entrada clínica |

## Recommended
| Env | Uso |
| --- | --- |
| `HANDOFF_CALLBACK_SECRET` | segredo dedicado para callback assinado |
| `HANDOFF_TOKEN_TTL_SECONDS` | TTL do token |
| `HANDOFF_CALLBACK_TOLERANCE_SECONDS` | janela do timestamp |
| `NEXT_PUBLIC_PARTNER_ZAPVIDA_URL` | fallback CTA direto |
| `NEXT_PUBLIC_PARTNER_ZAPFARM_URL` | fallback pós-clínico |

## Dependências já usadas
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` para replay/idempotência distribuída

## Preflight
```bash
pnpm validate:handoff:env
```

## Interpretação do preflight
- Exit `0`: matriz mínima presente.
- Exit `1`: lacunas externas/manuais a resolver antes do go-live completo.
- `tokenSecretSource` e `callbackSecretSource` mostram se o runtime caiu em fallback.

## Política por ambiente
- Local:
  - permitido fallback dev para não travar desenvolvimento.
- Preview:
  - usar segredo dedicado sempre que possível.
- Produção:
  - não depender de fallback de `NEXTAUTH_SECRET` ou `SUPABASE_SERVICE_ROLE_KEY`.
