# Lançamento Store V2 — Tudo pronto para copiar e colar

---

## O que deu certo até agora

| Item | Status |
|------|--------|
| SQL migrations (passo 1) | ✅ Success |
| ENVs Vercel | ✅ OK (passo 4) |
| Deploy | ✅ Redeploy feito |
| Health / Home | ✅ 200 |
| Webhook Asaas | ✅ OK |

---

## O que ainda falha

| Item | Causa | Ação |
|------|-------|------|
| `smoke:import` | `DATABASE_URL` não carregado | ✅ Corrigido (dotenv) — se "Can't reach DB" = rede/Supabase |
| curl `/api/admin/catalog/import` | 404 | Deploy pode ser de branch antiga ou rota com caminho diferente |
| `/c/sono`, `/cart`, API cart | 404 | `STORE_V2=1` ou `NEXT_PUBLIC_STORE_V2=1` ausentes/incorretos |
| `vercel env ls` | Project not linked | Remover `.vercel` e fazer link de novo |
| git push | Repository not found | Corrigir remote (passo 3) |

---

## Passo 3 — Corrigir git remote

Se o push falhar com "Repository not found":

```bash
# Ver URL atual
git remote -v

# Se apontar para repo inexistente, definir o correto (substitua pelo seu):
git remote set-url origin https://github.com/SEU_USUARIO/SEU_REPO.git

# Testar
git fetch origin
```

Se o projeto for **monjoy-mejoy** ou **zapfarm** na Vercel, o repo provavelmente é outro. Confira no dashboard da Vercel qual repositório está conectado.

---

## Checklist final — Copiar e colar

### 1. Garantir `DATABASE_URL` no script de import

O script `smoke:import` foi ajustado para carregar `.env.local`. Rode:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
STORE_V2_SEED_PRICE_CENTS=9900 pnpm smoke:import
```

Se aparecer "Can't reach database server" = Supabase pausado ou rede. Use o import via API (produção tem conexão direta com o banco).

---

### 2. Variáveis na Vercel (nomes exatos)

| Nome | Valor |
|------|-------|
| `STORE_V2` | `1` |
| `NEXT_PUBLIC_STORE_V2` | `1` |

Não use `NEXT_STORE` nem variações. Essas duas são obrigatórias.

---

### 3. Importar catálogo via API (após deploy funcionando)

Use o valor real de `ADMIN_SECRET_KEY` (do `.env.local` ou Vercel):

```bash
curl -X POST "https://www.mejoy.com.br/api/admin/catalog/import" \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

Se retornar 404 = deploy antigo ou branch errada. Garanta que o push foi feito e que o deploy inclui `src/pages/api/admin/catalog/import.ts`. Alternativa: import local (se rede alcançar Supabase).

---

### 4. Link do projeto Vercel (se `vercel env ls` falhar)

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
rm -rf .vercel
vercel link
```

Responda às perguntas (projeto `zapfarm` etc.) e depois:

```bash
vercel env ls
```

---

### 5. Validação final

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

Resultado esperado com tudo certo:

```
✅ Health OK (200)
✅ Home OK (200)
✅ /c/sono OK (200)
✅ PDP OK (200)
✅ /cart OK (200)
✅ API cart OK (200)
🎉 Validação concluída!
```

---

### 6. Teste manual no navegador

1. https://www.mejoy.com.br — home Store V2 com seções
2. https://www.mejoy.com.br/c/sono — categoria Sono
3. https://www.mejoy.com.br/p/5-htp-50-mg — PDP
4. Adicionar ao carrinho → https://www.mejoy.com.br/cart
5. Finalizar compra → checkout → PIX

---

## Ordem sugerida

1. Rodar `pnpm smoke:import` com o script ajustado
2. Confirmar `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` na Vercel
3. Fazer redeploy (ou aguardar o próximo)
4. Rodar o script de validação
5. Se API import 404: usar só `smoke:import` local (já com migrations e banco prontos)

---

## Rollback

Se algo quebrar:

1. Vercel → Environment Variables  
2. `STORE_V2=0` e `NEXT_PUBLIC_STORE_V2=0`  
3. Redeploy  

A loja volta ao layout legado sem mudar código.
