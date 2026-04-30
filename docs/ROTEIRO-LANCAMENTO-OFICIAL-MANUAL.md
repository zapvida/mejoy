# Roteiro de Lançamento Oficial — Manual Completo

> **Objetivo:** Tudo pronto para copiar e colar. Execute na ordem indicada.

---

## PRÉ-REQUISITOS

1. **Chave OpenAI** — Para pipeline de copy. Adicione em `.env.local`:
   ```
   OPENAI_API_KEY=sk-proj-...
   ```

2. **Node/pnpm** — Projeto já configurado.

---

## BLOCO 1 — VALIDAÇÃO TÉCNICA (antes de qualquer alteração)

Execute para garantir que o projeto está verde:

```bash
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm run freeze:akkermat
pnpm run validate:akkermat
pnpm run launch:gate
pnpm run verify:clean-runtime
```

Ou em uma linha:

```bash
pnpm run lint && pnpm run typecheck && pnpm run build && pnpm run freeze:akkermat && pnpm run validate:akkermat && pnpm run launch:gate && pnpm run verify:clean-runtime
```

---

## BLOCO 2 — PIPELINE DE COPY (expansão do catálogo)

### 2.1 Dry-run (preview, não aplica)

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:ai-dry-run
```

Ou se já está em `.env.local`:

```bash
pnpm run copy:ai-dry-run
```

**Audite o arquivo gerado:** `scripts/generated/copy-v4-ai-dry-run-preview.json`

### 2.2 Enriquecimento por lote (aplica ao blueprint)

Use `--skip=N` e `--limit=N` para processar em lotes sem reprocessar.

**Lote 1 — primeiros 20 SKUs:**

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:enrich-ai-batch -- --limit=20
```

**Lote 2 — próximos 30 (skip 20):**

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:enrich-ai-batch -- --skip=20 --limit=30
```

**Lote 3 — próximos 50 (skip 50):**

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:enrich-ai-batch -- --skip=50 --limit=50
```

**Lote 4 — restante (skip 100):**

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:enrich-ai-batch -- --skip=100
```

**Catálogo completo (todos exceto Akkermat e HIGH_RISK):**

```bash
OPENAI_API_KEY=sk-proj-... pnpm run copy:enrich-ai-batch
```

**Nota:** O Akkermat (MEJOY-0048) é protegido e nunca será alterado pelo pipeline.

### 2.3 Validação pós-enriquecimento

```bash
pnpm run copy:validate:v4
pnpm run launch:gate
```

---

## BLOCO 3 — GATE FINAL

### 3.1 Soft launch gate (sem servidor)

```bash
pnpm run soft-launch:gate
```

### 3.2 Com smoke HTTP (servidor rodando)

Inicie o servidor em outro terminal:

```bash
pnpm run build && pnpm start
```

Depois:

```bash
BASE_URL=http://localhost:3000 pnpm run soft-launch:gate
```

### 3.3 Smoke checkout

```bash
BASE_URL=http://localhost:3000 pnpm run smoke:checkout
```

### 3.4 Official launch gate (tudo junto)

```bash
BASE_URL=http://localhost:3000 pnpm run official-launch:gate
```

---

## BLOCO 4 — VALIDAÇÃO EM PRODUÇÃO

Após deploy:

```bash
BASE_URL=https://www.mejoy.com.br pnpm run smoke:launch
BASE_URL=https://www.mejoy.com.br pnpm run smoke:checkout
pnpm run validate:prod
```

---

## BLOCO 5 — CHECKLIST MANUAL (não automatizável)

### Emagrecimento — smoke test obrigatório antes de tráfego pago

**Roteiro completo:** `docs/EMAGRECIMENTO-SMOKE-TEST-MANUAL.md`  
**Checklist produção:** `docs/EMAGRECIMENTO-PRODUCAO-CHECKLIST.md`

Execute os 3 cenários em produção (~10 min):
1. **Whitelist:** LP → triagem → relatório → checkout (CEP 88370) → pagamento → obrigado → WhatsApp
2. **Fora whitelist:** checkout Step 2 com CEP fora → lista de espera → formulário → WhatsApp
3. **Regressão:** relatório id inválido, checkout sem reportId, CTAs corretos

---

### Analytics e pixels

- [ ] **GA4 Realtime** — Abra GA4 → Relatórios → Tempo real. Navegue no site e confirme eventos (page_view, view_item, add_to_cart, begin_checkout, purchase).
- [ ] **Meta Events Manager** — Verifique se eventos de conversão chegam (ViewContent, AddToCart, InitiateCheckout, Purchase).
- [ ] **NEXT_PUBLIC_GA4_MEASUREMENT_ID** e **NEXT_PUBLIC_GTM_ID** configurados em produção.

### Webhook Asaas

- [ ] URL do webhook configurada no painel Asaas.
- [ ] Testar pagamento PIX em sandbox e confirmar callback.

### E-mail pós-compra

- [ ] Domínio de e-mail em produção (não usar fallback @resend.dev).
- [ ] Testar compra real e confirmar recebimento do e-mail.

### Deploy

- [ ] `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` em produção.
- [ ] Variáveis de ambiente do Resend, Asaas, Supabase configuradas.

---

## RESUMO — ORDEM RECOMENDADA

1. **Validação técnica** — Bloco 1  
2. **Copy em lotes** — Bloco 2 (dry-run → auditar → enrich por lote)  
3. **Gate final** — Bloco 3  
4. **Deploy**  
5. **Validação produção** — Bloco 4  
6. **Checklist manual** — Bloco 5  

---

## ARQUIVOS GERADOS

| Arquivo | Descrição |
|---------|-----------|
| `scripts/generated/copy-v4-ai-dry-run-preview.json` | Preview do dry-run (auditar antes de aplicar) |
| `scripts/generated/copy-v4-enrich-report.json` | Relatório do último enrich |
| `scripts/generated/soft-launch-gate-report.json` | Relatório do soft-launch gate |
| `scripts/generated/official-launch-gate-report.json` | Relatório do official launch gate |

---

## COMANDOS RÁPIDOS (copy-paste)

```bash
# 1. Validação completa
pnpm run lint && pnpm run typecheck && pnpm run build && pnpm run freeze:akkermat && pnpm run validate:akkermat && pnpm run launch:gate

# 2. Dry-run copy (5 SKUs)
pnpm run copy:ai-dry-run

# 3. Enrich lote 20 (ajuste OPENAI_API_KEY)
pnpm run copy:enrich-ai-batch -- --limit=20

# 4. Gate final (com servidor rodando)
BASE_URL=http://localhost:3000 pnpm run official-launch:gate
```
