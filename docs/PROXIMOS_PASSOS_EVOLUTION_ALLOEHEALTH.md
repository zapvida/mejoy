# Próximos passos: Evolution alloehealth + WhatsApp

## O que foi implementado

1. **Botão flutuante WhatsApp** – "Falar com a equipe pelo WhatsApp" → `554797789479`
2. **Evolution** – instância padrão alterada de `zapvidax` para `alloehealth`
3. **Contato** – número padrão atualizado para `554797789479` (Footer, StickyBar, botão flutuante)

---

## Passo 1: Configurar env vars na Vercel

Acesse: **Vercel → monjoy-mejoy/zapfarm → Settings → Environment Variables**

### 1.1 Contato (botão WhatsApp)

| Nome | Valor | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | `554797789479` | Production, Preview |

### 1.2 Evolution API (alloehealth)

| Nome | Valor | Environments |
|------|-------|--------------|
| `EVOLUTION_MAGIC_LINK_ENABLED` | `true` | Production |
| `EVOLUTION_API_URL` | `https://evo.zapvida.com` | Production |
| `EVOLUTION_INSTANCE` | `alloehealth` | Production |
| `EVOLUTION_API_KEY` | `91DBFEC04BD5-4F8D-8BBD-3F205E18B759` | Production |

**Nota:** Se a Evolution API estiver em outra URL (ex.: `https://evo.zapvida.com:8080`), ajuste `EVOLUTION_API_URL` conforme o painel.

---

## Passo 2: Configurar webhook na Evolution API

1. Acesse o painel Evolution (evo.zapvida.com)
2. Vá em **Configurations** ou **Integrations**
3. Configure o webhook:
   - **URL:** `https://www.mejoy.com.br/api/evolution/webhook`
   - **Eventos:** mensagens recebidas (para o MENU automático)

---

## Passo 3: Redeploy

Após alterar as env vars:

```bash
# Opção A: redeploy manual
# Vercel → Deployments → ⋮ no último deploy → Redeploy

# Opção B: commit vazio para acionar deploy
cd /Users/teobeckert/desenvolvimento/mejoy
git commit --allow-empty -m "chore: trigger deploy para env vars Evolution"
pnpm run deploy
```

---

## Passo 4: Validar

### 4.1 Health check

```bash
curl https://www.mejoy.com.br/api/health/zapfarm
```

Esperado: `evolution.ready: true` quando as env vars estiverem corretas.

### 4.2 Magic Link (pós-triagem)

1. Acesse https://www.mejoy.com.br/protocolos
2. Inicie uma triagem (ex.: emagrecimento)
3. Preencha até o final e informe WhatsApp
4. Após o relatório ser gerado, deve chegar no WhatsApp (5512991875957):
   - "Olá [nome]! Seu relatório MeJoy está pronto. Acesse seu painel em 1 clique: [link]"

### 4.3 Compra confirmada

1. Conclua uma compra (triagem → relatório → checkout)
2. Pague com PIX ou cartão
3. Deve chegar no WhatsApp do cliente:
   - "Olá [nome]! Sua compra foi processada. Acesse seu painel: [link]"
   - "Você receberá mais informações por WhatsApp e Email..."

### 4.4 Botão flutuante

1. Acesse https://www.mejoy.com.br
2. Verifique o botão verde "Falar com a equipe pelo WhatsApp" no canto inferior direito
3. Clique → deve abrir WhatsApp para 554797789479

---

## Réguas estabelecidas (fluxos automáticos)

Os envios atuais são:

| Evento | Quando | Mensagem |
|--------|--------|----------|
| **Magic Link** | Relatório pronto (triagem finalizada) | Link para dashboard |
| **Compra confirmada** | Pagamento CONFIRMED no Asaas | Link + aviso de próximos passos |
| **MENU** | Usuário envia mensagem no WhatsApp | Resposta automática (webhook Evolution) |

Para novas réguas (ex.: lembrete 24h, follow-up 7 dias), será necessário:

1. Configurar na Evolution API (templates, respostas automáticas)
2. Ou criar jobs/cron no backend para envio programado

---

## Resumo de números

| Uso | Número |
|-----|--------|
| Botão "Falar com a equipe" | 554797789479 |
| Instância Evolution (envia magic link, compra confirmada) | 5512991875957 (alloehealth) |
