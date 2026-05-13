# ⚠️ URGENTE: Revogar OPENAI_API_KEY exposta

**Status:** Ação crítica pendente

A chave `OPENAI_API_KEY` foi exposta em terminal/conversa. Execute **imediatamente**:

## 1. Revogar a chave atual

1. Acesse [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Localize a chave exposta (prefixo `sk-proj-...`)
3. Clique em **Revoke** ou **Delete**

## 2. Gerar nova chave

1. No mesmo painel, clique em **Create new secret key**
2. Copie a nova chave (ela só será mostrada uma vez)

## 3. Atualizar ambientes

- **Local:** `.env.local` → `OPENAI_API_KEY=your_secret_from_provider`
- **Vercel:** Project → Settings → Environment Variables → `OPENAI_API_KEY` → Edit → colar nova chave → Save
- **Produção:** Garantir que Production, Preview e Development tenham a nova chave

## 4. Redeploy

Após atualizar na Vercel, faça um redeploy para que as novas envs sejam aplicadas.

## 5. Nunca mais

- Não cole chaves em terminal, chat ou logs
- Use variáveis de ambiente: `echo $OPENAI_API_KEY` (sem mostrar o valor)
- Para scripts: carregue de `.env` sem imprimir

---

Ref: `docs/security-rotation.md` para rotação geral de credenciais.
