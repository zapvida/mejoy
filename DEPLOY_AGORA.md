# 🚀 DEPLOY MANUAL - VERCEL DASHBOARD

**Problema:** Deploy automático não iniciou  
**Solução:** Deploy manual via Dashboard

---

## ✅ STATUS ATUAL

- ✅ Commit: `0b24022` criado e enviado
- ✅ Push: `origin/main` atualizado
- ✅ Código: Pronto para deploy

---

## 🎯 DEPLOY VIA DASHBOARD (MAIS RÁPIDO)

### Passo a Passo:

1. **Acesse:** https://vercel.com/dashboard
2. **Selecione:** Projeto `zapfarm` (ou `zapfarms-projects/zapfarm`)
3. **Vá em:** Aba "Deployments"
4. **Clique em:** Botão "Create Deployment" (canto superior direito)
   - OU clique nos "..." do último deploy → "Redeploy"
5. **Configure:**
   - Branch: `main`
   - Framework Preset: Next.js (deve detectar automaticamente)
6. **Clique em:** "Deploy"

---

## ⏱️ TEMPO DE DEPLOY

- Upload: ~1-2 minutos
- Build: ~3-5 minutos
- Total: ~5-7 minutos

---

## 🔍 MONITORAR DEPLOY

Durante o deploy, você verá:
1. ✅ "Building" - Compilando código
2. ✅ "Deploying" - Fazendo deploy
3. ✅ "Ready" - Deploy concluído

**Se houver erros:**
- Clique no deploy para ver logs
- Verifique se há erros de build
- Verifique variáveis de ambiente

---

## ✅ APÓS DEPLOY CONCLUÍDO

1. **Rodar smoke test:**
```bash
./scripts/smoke-test.sh
```

2. **Testar manualmente:**
- Acesse: `https://www.zapfarm.com.br/emagrecimento`
- Complete fluxo completo

3. **Validar webhook:**
- Verifique no painel Asaas se webhook está recebendo eventos

---

## 🆘 SE TIVER PROBLEMAS

### Erro de Build:
- Verifique logs no Vercel
- Verifique se todas as env vars estão configuradas
- Verifique se `pnpm build` funciona localmente

### Erro de Permissão:
- Verifique se você tem acesso ao projeto no Vercel
- Verifique se está logado na conta correta

---

**Próximo passo:** Acesse o Dashboard e faça o deploy manual! 🚀

