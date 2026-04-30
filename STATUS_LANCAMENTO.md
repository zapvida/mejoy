# Status do lançamento Store V2

**Atualizado:** 28/02/2026

---

## Diagnóstico

O endpoint `/api/health` em produção retorna:

```json
{"features":{"pdfV2Enabled":false,...,"ttsEnabled":false}}
```

**Não existe `storeV2Enabled`** na resposta. O health do código atual inclui isso. Ou seja: **o deploy em produção usa um build antigo** (antes das mudanças do Store V2).

---

## % do lançamento: **~70%**

| Item | Status | % |
|------|--------|---|
| Código Store V2 (local) | ✅ Pronto | 100 |
| Migrations SQL | ✅ Aplicadas | 100 |
| Envs na Vercel | ✅ Definidas | 100 |
| Deploy com código novo | ❌ Pendente | 0 |
| Import do catálogo | ⏳ Aguardando deploy | 0 |
| Validação final | ⏳ Aguardando deploy | 0 |

**Bloqueador principal:** o deploy em produção não contém o código do Store V2.

---

## O que fazer agora

### 1. Fazer deploy com o código atual

Como o push para o GitHub falha ("Repository not found"), use o deploy via Vercel CLI:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
vercel --prod
```

Isso faz o deploy com o código local, sem depender do GitHub.

---

### 2. Conferir envs na Vercel (nomes exatos)

| Nome | Valor | Ambiente |
|------|-------|----------|
| `STORE_V2` | `1` | Production |
| `NEXT_PUBLIC_STORE_V2` | `1` | Production |
| `ADMIN_SECRET_KEY` | (seu valor) | Production |
| `DATABASE_URL` | (connection string) | Production |

---

### 3. Após o deploy, validar

```bash
# Ver se storeV2Enabled aparece e está true
curl -s "https://www.mejoy.com.br/api/health" | grep storeV2Enabled

# Validação completa
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

---

### 4. Importar catálogo

Use o **valor real** de `ADMIN_SECRET_KEY` (igual ao da Vercel):

```bash
curl -X POST "https://www.mejoy.com.br/api/admin/catalog/import" \
  -H "Authorization: Bearer SEU_ADMIN_SECRET_KEY_REAL" \
  -H "Content-Type: application/json" -d '{}'
```

---

### 5. Sobre o Git (depois do lançamento)

`Repository not found` costuma ser:

- Repo privado e token/acesso antigo ou revogado
- Usuário/org alterado no GitHub
- Repo renomeado ou movido

Para corrigir:

1. Acessar https://github.com/zapfarmx/zapfarm e verificar se existe e se você tem acesso.
2. Se estiver usando token, usar um novo Personal Access Token com `repo`.
3. Se for HTTPS, testar SSH: `git remote set-url origin git@github.com:zapfarmx/zapfarm.git`

---

## Checklist final

- [ ] `vercel --prod` rodou e concluiu
- [ ] `curl https://www.mejoy.com.br/api/health` inclui `storeV2Enabled: true`
- [ ] `/c/sono`, `/cart`, `/api/store-v2/cart` retornam 200
- [ ] Import do catálogo executado (POST com ADMIN_SECRET_KEY)
- [ ] `/p/5-htp-50-mg` retorna 200 (PDP ok)
- [ ] Webhook Asaas configurado: `https://www.mejoy.com.br/api/asaas/webhook`
