# Setup Asaas do Zero – Guia Completo

Configuração completa do Asaas para MeJoy/ZapFarm: conta, API key, webhook e env vars.

---

## 1. Criar conta no Asaas

1. Acesse: https://www.asaas.com/
2. Clique em **Criar conta**
3. Preencha: CNPJ (ou CPF como MEI), email, senha
4. Ative a conta (verifique o email)
5. Acesse o **Painel** quando o cadastro estiver aprovado

---

## 2. Ambiente: Sandbox vs Produção

| Ambiente | Uso | API base |
|----------|-----|----------|
| **Sandbox** | Testes (PIX/cartão simulados) | `https://sandbox.asaas.com/api/v3` |
| **Produção** | Pagamentos reais | `https://api.asaas.com/v3` |

- Para testes: use **Sandbox** (https://sandbox.asaas.com)
- Para produção: use **Produção** (https://www.asaas.com)

---

## 3. Obter API Key

### Sandbox (testes)

1. Acesse: https://sandbox.asaas.com/
2. Entrar na conta sandbox
3. Menu **Integrações** → **API**
4. Copie a **API Key** (chave secreta, formato longo)

### Produção

1. Acesse: https://www.asaas.com/
2. Menu **Integrações** → **API**
3. Copie a **API Key** (ambiente produção)

---

## 4. Configurar Webhook no Asaas

1. No Asaas (sandbox ou produção): **Integrações** → **Webhooks**
2. Clique em **Novo Webhook**
3. Preencha:

| Campo | Valor |
|-------|-------|
| **Nome** | `MeJoy Pagamentos` |
| **URL** | `https://mejoy.com.br/api/asaas/webhook` |
| **Formato** | JSON |
| **Eventos** | Marcar os listados abaixo |

4. Eventos obrigatórios:

```
✓ PAYMENT_CREATED
✓ PAYMENT_UPDATED
✓ PAYMENT_CONFIRMED
✓ PAYMENT_RECEIVED
✓ PAYMENT_OVERDUE
✓ PAYMENT_DELETED
✓ PAYMENT_REFUNDED
```

5. Salvar

> **Local/Sandbox:** Use `https://seu-dominio.vercel.app/api/asaas/webhook` ou ngrok para testar local.

---

## 5. Configurar Envs na Vercel

### 5.1 Envs essenciais

```bash
# API Key (obrigatório)
vercel env add ASAAS_API_KEY production
# Cole a API Key do Asaas

# Ambiente: sandbox ou production
vercel env add ASAAS_ENVIRONMENT production
# Digite: production  (ou sandbox para testes)
```

### 5.2 Envs de preços (centavos)

Para cada produto/plano, use:

```
ASAAS_PRICE_{PRODUTO}_{PLANO}=valor_em_centavos
```

Exemplos (R$ 299,00 = 29900 centavos):

| Env | Exemplo valor | Significado |
|-----|---------------|-------------|
| ASAAS_PRICE_EMAGRECIMENTO_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_EMAGRECIMENTO_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_EMAGRECIMENTO_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_CALVICIE_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_CALVICIE_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_CALVICIE_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_SONO_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_SONO_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_SONO_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_ANSIEDADE_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_ANSIEDADE_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_ANSIEDADE_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_INTESTINO_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_INTESTINO_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_INTESTINO_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_FIGADO_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_FIGADO_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_FIGADO_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_LIBIDO_MASCULINA_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_LIBIDO_MASCULINA_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_LIBIDO_MASCULINA_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_MENOPAUSA_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_MENOPAUSA_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_MENOPAUSA_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_ARTICULACOES_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_ARTICULACOES_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_ARTICULACOES_PREMIUM | 79900 | R$ 799,00 |
| ASAAS_PRICE_IMUNIDADE_BASICO | 29900 | R$ 299,00 |
| ASAAS_PRICE_IMUNIDADE_COMPLETO | 49900 | R$ 499,00 |
| ASAAS_PRICE_IMUNIDADE_PREMIUM | 79900 | R$ 799,00 |
```

Você pode ajustar os valores conforme a tabela de preços do MeJoy.

### 5.3 Env opcional (WEBHOOK_ASAAS_URL)

Se o Asaas pedir URL do webhook em outro lugar:

```bash
vercel env add WEBHOOK_ASAAS_URL production
# Digite: https://mejoy.com.br/api/asaas/webhook
```

---

## 6. Redeploy e teste

```bash
vercel --prod
```

Ou faça um novo deploy pelo dashboard da Vercel após alterar envs.

---

## 7. Teste end-to-end

1. **PIX (Sandbox):**
   - Faça uma triagem e vá ao checkout
   - Escolha PIX
   - Gere o pagamento
   - Deve aparecer QR Code ou link
   - No sandbox, use o simulador do Asaas para marcar como pago

2. **Cartão (Sandbox):**
   - Use cartão de teste: `5162307027676400`
   - Validade: futura | CVV: qualquer 3 dígitos

3. **Webhook:**
   - No Asaas: Integrações → Webhooks → seu webhook
   - Conferir "Últimas notificações" / logs
   - Pagamento confirmado deve gerar registro em `mejoy_orders` (Prisma)

---

## Checklist rápido

```
[ ] Conta Asaas criada (sandbox e/ou produção)
[ ] API Key copiada
[ ] ASAAS_API_KEY configurada na Vercel
[ ] ASAAS_ENVIRONMENT = production (ou sandbox)
[ ] Webhook criado: https://mejoy.com.br/api/asaas/webhook
[ ] Eventos: PAYMENT_CONFIRMED, PAYMENT_RECEIVED, PAYMENT_OVERDUE, etc.
[ ] Envs ASAAS_PRICE_* para todos os produtos usados
[ ] Redeploy após alterar envs
[ ] Teste PIX e cartão
[ ] Conferir webhook recebendo notificações
```
