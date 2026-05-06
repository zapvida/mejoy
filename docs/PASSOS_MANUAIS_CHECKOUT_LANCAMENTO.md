# Passos Manuais — Lançamento Checkout MeJoy

**Data:** 05/03/2025  
**Contexto:** Checkout refatorado (layout Zapvida, PIX + Cartão, validação robusta) — você ainda não executou nada manualmente.

---

## O que foi implementado

- ✅ Checkout em 2 etapas (Dados e Entrega | Pagamento)
- ✅ Layout 2 colunas (formulário + resumo sticky)
- ✅ Header com "Ambiente seguro"
- ✅ Barra de progresso com círculos numerados
- ✅ Banner de frete grátis dinâmico
- ✅ CEP obrigatório + ViaCEP (preenchimento automático)
- ✅ Validação backend (CEP, endereço) no `create-payment`
- ✅ PIX e Cartão de Crédito (gateway Asaas)
- ✅ Preview dinâmico do cartão
- ✅ Footer com Termos, reCAPTCHA, badges SSL e PCI DSS
- ✅ Persistência dos dados em `localStorage`
- ✅ Responsividade total (mobile: resumo colapsável)

---

## Passo a passo manual (ordem sugerida)

### 1. Commit e push

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
git status
git add .
git commit -m "feat(checkout): layout Zapvida, PIX+Cartão, validação robusta"
git push origin main
```

### 2. Deploy na Vercel

```bash
pnpm run deploy
```

Ou, se preferir:

```bash
bash scripts/deploy-vercel.sh
```

**Alternativa:** Push já aciona o deploy automático (se configurado). Acompanhe em:  
https://vercel.com/monjoy-mejoy/zapfarm/deployments

### 3. Variáveis de ambiente (verificar)

No Vercel → Project → Settings → Environment Variables, confirme:

| Variável | Uso |
|----------|-----|
| `STORE_V2` | `1` ou `true` |
| `NEXT_PUBLIC_STORE_V2` | `1` ou `true` |
| `ASAAS_API_KEY` | Chave da API Asaas |
| `ASAAS_ENVIRONMENT` | `production` ou `sandbox` |
| `WEBHOOK_ASAAS_URL` | URL do webhook (ex: `https://www.mejoy.com.br/api/webhooks/asaas`) |

### 4. Validação local (antes do deploy)

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
STORE_V2=1 NEXT_PUBLIC_STORE_V2=1 pnpm dev
```

1. Acesse: http://localhost:3000  
2. Adicione um produto ao carrinho  
3. Clique em "Finalizar compra"  
4. Preencha dados e CEP (ex: 01310-100)  
5. Avance para Pagamento  
6. Teste PIX (gera QR Code) ou Cartão (preencha dados de teste)

### 5. Validação em produção (após deploy)

1. **Home:** https://www.mejoy.com.br  
2. **Produto:** Escolha um produto e adicione ao carrinho  
3. **Carrinho:** https://www.mejoy.com.br/cart  
4. **Checkout:** Clique em "Finalizar compra" → https://www.mejoy.com.br/checkout?cartId=...

**Checklist de validação:**

- [ ] Header com logo e "Ambiente seguro"
- [ ] Barra de progresso (2 passos)
- [ ] Banner de frete (informe CEP / faltam R$ X / frete grátis)
- [ ] CEP preenche endereço automaticamente
- [ ] Botão "Continuar" só habilita com dados e endereço completos
- [ ] Resumo do pedido visível à direita (desktop) ou colapsável (mobile)
- [ ] PIX e Cartão como opções de pagamento
- [ ] PIX: gera QR Code e redireciona para /checkout/sucesso
- [ ] Cartão: formulário + preview do cartão
- [ ] Footer com Termos, reCAPTCHA, badges SSL/PCI
- [ ] Responsivo: testar em mobile (resumo colapsável)

### 6. Compra de teste em produção

1. Adicione um produto ao carrinho  
2. Finalize com PIX (use valor baixo para teste)  
3. Confirme o pagamento no app do banco (sandbox ou produção)  
4. Verifique:
   - Redirecionamento para /checkout/sucesso
   - QR Code ou código PIX exibido
   - Após pagamento: status "Pago" e e-mail de confirmação (se configurado)

### 7. Webhook Asaas (se ainda não configurado)

1. Acesse o painel Asaas  
2. Configurações → Webhooks  
3. Adicione: `https://www.mejoy.com.br/api/webhooks/asaas`  
4. Eventos: `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`  
5. Salve a URL em `WEBHOOK_ASAUS_URL` nas envs da Vercel (se necessário)

### 8. Conformidade Jurídica Completa

Consulte o **Checklist de Lançamento Jurídico** em:
`docs/CHECKLIST_LANCAMENTO_JURIDICO_MEJOY.md`

Inclui: páginas legais, env vars, LGPD, CDC, validações pré-lançamento.

### 9. Links de Termos e Privacidade

O footer do checkout aponta para:

- `/termos` — Termos de Uso  
- `/privacidade` — Política de Privacidade  

Confirme que essas páginas existem e estão publicadas.

---

## Resumo rápido (copy-paste)

```bash
# 1. Commit e deploy
cd /Users/teobeckert/desenvolvimento/mejoy
git add .
git commit -m "feat(checkout): layout Zapvida, PIX+Cartão, validação robusta"
pnpm run deploy

# 2. Validar
open https://www.mejoy.com.br
# Adicionar produto → Carrinho → Finalizar compra → Preencher CEP → Pagar
```

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Checkout não aparece | Verificar `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` |
| CEP não preenche | ViaCEP pode estar fora; verificar console do navegador |
| PIX não gera QR | Verificar `ASAAS_API_KEY` e `ASAAS_ENVIRONMENT` |
| Cartão rejeitado | Usar dados de teste do Asaas (sandbox) |
| Webhook não atualiza pedido | Verificar URL do webhook no Asaas e logs da Vercel |

---

*Documento gerado após implementação do checkout. Execute os passos na ordem para validar o lançamento.*
