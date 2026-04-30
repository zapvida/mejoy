# 🏆 KIT DO PRÊMIO - LANÇAMENTO FINAL

**Data:** 11 de janeiro de 2025  
**Status:** 🚀 **GO para Lançamento**

---

## 📋 CHECKLIST FINAL - 3 GATES

### ✅ Gate 1: Bucket no Supabase
- [ ] Supabase Dashboard → Storage
- [ ] Bucket `branding-logos` existe?
- [ ] Se não: criar, marcar como **Public**
- [ ] Permitir tipos: `png`, `jpg`, `jpeg`, `svg`, `webp`

### ✅ Gate 2: ENVs em Production (Vercel)
Vercel Dashboard → Project Settings → Environment Variables → **Production**

Confirme estas 8 variáveis:
- [ ] `SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `DATABASE_URL` (pooler, porta 6543)
- [ ] `DIRECT_URL` (direto, porta 5432)
- [ ] `BRANDING_BUCKET=branding-logos`
- [ ] `NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro`

### ✅ Gate 3: Smoke em Produção
```bash
./scripts/smoke-production-final.sh https://aistotele.com
```
**Esperado:** 4 verdes (upload logo, criar draft 201, update 200, get 200)

---

## 🚀 DEPLOY FINAL

```bash
git add -A
git commit -m "release(b2b): wizard→sandbox→triage→report PDF + hardening"
git push
vercel --prod
```

---

## 🧪 TESTES PÓS-DEPLOY

### 1. Smoke Automático
```bash
./scripts/smoke-production-final.sh https://aistotele.com
```
**Anote o `draft.id` retornado para usar no sandbox**

### 2. Fluxo Real (2 minutos)
1. Acesse `https://aistotele.com/b2b/configurar`
2. Suba uma logo, escolha cores, CTA/WhatsApp → Salvar
3. Na sandbox (com `?draft=ID`), clique "Testar triagem personalizada"
4. Faça a triagem → Relatório abre com branding → Baixar PDF

### 3. Checklist Visual
- [ ] Landing sem cards duplicados
- [ ] Números 1-2-3-4 bonitos/alinhados
- [ ] Navbar Aistotele (não Alloe)
- [ ] Wizard sem sobreposição do menu
- [ ] FAB "?" não colide com WhatsApp no mobile
- [ ] PDF baixa (≥20 KB, Content-Type: `application/pdf`, logo no cabeçalho)

---

## 📦 KIT DO PRÊMIO (Entregar aos Avaliadores)

### URLs
- **URL Demo:** `https://aistotele.com`
- **Sandbox com Draft:** `https://aistotele.com/b2b/sandbox?draft=<ID_DO_SMOKE>`
- **Wizard:** `https://aistotele.com/b2b/configurar`
- **Triagem Demo:** `https://aistotele.com/triagem/gastro`

### Fluxo Guiado
1. "Personalize grátis" → `/b2b/configurar`
2. Configure logo, cores, CTA
3. Salvar → redireciona para sandbox
4. "Testar triagem personalizada" → completa triagem
5. Relatório com branding → Baixar PDF

### PDF Exemplo
- Gere 1 PDF com a marca demo após o smoke test
- Anexe ao dossiê do prêmio
- Mostra: logo, cores, QR code, conteúdo completo

### Login
- **Não precisa** (fluxo aberto para teste)
- Avaliadores podem testar sem cadastro

---

## 🎤 SCRIPT DE APRESENTAÇÃO (90 segundos)

> "Este é o Aistotele, uma plataforma de saúde white-label: em 2 minutos a clínica sobe a logo, escolhe as cores e já testa uma triagem personalizada.
>
> O paciente responde perguntas inteligentes, e o sistema gera um relatório com orientações e um PDF pronto para compartilhar.
>
> Para a clínica, é B2B escalável: domínio próprio, cores e CTAs de WhatsApp integrados. Para o paciente, clareza e velocidade.
>
> Nosso diferencial: personalização instantânea + relatório de alto valor + PDF com branding — tudo funcionando agora.
>
> Vamos mostrar: personalizo, testo a triagem, abro o relatório e baixo o PDF — em menos de 2 minutos."

---

## 🆘 PLANO DE CONTINGÊNCIA

### Erro 500 em API (prod)
- Ver logs do Vercel → checar ENVs + bucket
- Verificar se `DIRECT_URL` está setada

### Falha de DB (pgbouncer)
- Garanta `DIRECT_URL` setada (porta 5432, sem pooler)

### Rollback
- Vercel → Deployments → Promote o último deploy verde (1 clique)

---

## ✅ DEFINITION OF DONE

- [ ] 3 gates passaram (Bucket, ENVs, Smoke)
- [ ] Deploy concluído sem erros
- [ ] Smoke tests: 4 verdes
- [ ] Fluxo UI completo funcionando
- [ ] Checklist visual: todos os itens ok
- [ ] PDF gerado com branding

---

## 🎯 STATUS

**Código:** ✅ 100% pronto  
**Fluxo:** ✅ 100% funcional  
**Gates:** ⏳ Aguardando verificação  
**Deploy:** ⏳ Pronto para executar

**Com os 3 gates acima → GO definitivo para o prêmio! 🏆**

