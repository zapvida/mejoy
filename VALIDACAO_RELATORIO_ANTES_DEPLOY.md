# ⚠️ VALIDAÇÃO CRÍTICA: Geração de Relatórios ANTES DO DEPLOY

**Data:** $(date)  
**Status:** 🔍 **VALIDAÇÃO NECESSÁRIA ANTES DE FAZER DEPLOY**

---

## 🚨 IMPORTANTE

O usuário reportou que **o relatório NÃO está sendo gerado em produção**. 

**NÃO FAÇA DEPLOY COMPLETO até validar que a geração de relatórios está funcionando corretamente.**

---

## ✅ CHECKLIST DE VALIDAÇÃO

### 1. Variáveis de Ambiente Críticas

Verifique no **Vercel Dashboard → Settings → Environment Variables → Production**:

- [ ] `OPENAI_API_KEY` - **DEVE ESTAR CONFIGURADA** (formato: `sk-...`)
- [ ] `PDF_V2` - **DEVE ESTAR = `1` ou `true`**
- [ ] `AI_REPORT_ENABLED` - **DEVE ESTAR = `1`** (recomendado)
- [ ] `SUPABASE_URL` - Deve estar configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Deve estar configurada

### 2. Teste de Geração de Relatório

**Execute o script de validação:**
```bash
tsx scripts/validate-report-generation.ts
```

**Resultado esperado:**
- ✅ Todas as variáveis críticas configuradas
- ✅ PDF_V2 habilitado
- ✅ AI_REPORT_ENABLED habilitado (ou aviso se desabilitado)

### 3. Teste Manual em Produção

**Após deploy, teste:**

1. **Acesse:** `https://www.zapfarm.com.br/triagem/emagrecimento`
2. **Complete a triagem** (todas as perguntas)
3. **Finalize a triagem**
4. **Verifique:**
   - ✅ Redirecionamento para `/emagrecimento/relatorio?id=...`
   - ✅ Relatório sendo gerado (status "running" → "completed")
   - ✅ Relatório exibido corretamente na página

### 4. Verificar Logs do Vercel

**Após tentar gerar relatório, verifique logs:**

**Vercel Dashboard → Functions → `/api/triage/finalize`**

**Procurar por:**
- ✅ `[finalize] Successfully finalized triageId: ...`
- ❌ `[finalize] Error generating report: ...`
- ❌ `[report] AI generation failed`
- ❌ `OPENAI_API_KEY não configurada`

---

## 🔍 PROBLEMAS CONHECIDOS

### Problema 1: PDF_V2 Desabilitado
**Sintoma:** Relatório não é gerado, erro "IA indisponível"  
**Solução:** Configurar `PDF_V2=1` no Vercel

### Problema 2: OPENAI_API_KEY Não Configurada
**Sintoma:** Relatório falha ao gerar, erro de API  
**Solução:** Configurar `OPENAI_API_KEY` no Vercel

### Problema 3: Relatório Fica em "running"
**Sintoma:** Relatório nunca completa, fica travado  
**Causa:** Erro na geração assíncrona não está sendo capturado  
**Solução:** Verificar logs do Vercel para erros específicos

### Problema 4: Supabase Não Conectado
**Sintoma:** Erro ao persistir relatório  
**Solução:** Verificar `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`

---

## 📋 AÇÕES ANTES DO DEPLOY

1. ✅ **Commit feito** - Arquivos HTML adicionados
2. ⏳ **VALIDAR** - Executar script de validação
3. ⏳ **VERIFICAR** - Variáveis de ambiente no Vercel
4. ⏳ **TESTAR** - Geração de relatório em produção após deploy
5. ⏳ **MONITORAR** - Logs do Vercel após primeiro teste

---

## 🚀 DEPLOY SEGURO

**Só faça deploy completo após:**

1. ✅ Validar que todas as variáveis estão configuradas
2. ✅ Testar geração de relatório em ambiente de preview/staging
3. ✅ Confirmar que não há erros críticos nos logs

**Se houver problemas:**
- ⚠️ **NÃO FAÇA DEPLOY** até resolver
- 🔍 **INVESTIGUE** logs e variáveis de ambiente
- 🛠️ **CORRIJA** problemas antes de continuar

---

## 📞 PRÓXIMOS PASSOS

1. **Execute validação:** `tsx scripts/validate-report-generation.ts`
2. **Verifique Vercel:** Dashboard → Environment Variables
3. **Faça deploy de teste:** Apenas se validação passar
4. **Teste relatório:** Complete uma triagem e verifique geração
5. **Monitore logs:** Verifique se há erros

**Só depois de tudo validado, faça deploy completo.**

