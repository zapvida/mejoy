# ✅ CHECKLIST COMPLETO - DEPLOY PRODUÇÃO

## 🔐 1. VARIÁVEIS DE AMBIENTE

### DATABASE_URL (✅ Formato Correto)
```env
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
```
**✅ Formato está CORRETO!** Apenas substitua `SUA_SENHA_AQUI` pela sua senha real do Supabase.

### Outras Variáveis Obrigatórias:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xbfhvepljmcaztpjbryn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (encontre em Settings > API > service_role key)

# Stripe (para checkout funcionar)
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PRICE_ZAPFARM_MENSAL=price_...
STRIPE_PRICE_ZAPFARM_TRIMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_SEMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_TIRZ_MENSAL=price_...
STRIPE_PRICE_ZAPFARM_TIRZ_TRIMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_TIRZ_SEMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_SEMA_MENSAL=price_...
STRIPE_PRICE_ZAPFARM_SEMA_TRIMESTRAL=price_...
STRIPE_PRICE_ZAPFARM_SEMA_SEMESTRAL=price_...
```

---

## 🗄️ 2. MIGRAÇÃO SQL NO SUPABASE (OBRIGATÓRIO)

### ⚠️ AÇÃO MANUAL NECESSÁRIA:

1. **Acesse:** https://supabase.com/dashboard → Seu projeto → **SQL Editor**

2. **Execute o SQL completo do arquivo:**
   ```
   SUPABASE_MIGRATION_EMAGRECIMENTO.sql
   ```

3. **Verifique se as tabelas foram criadas:**
   Execute no SQL Editor:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('profiles', 'triage_sessions', 'triage_reports', 'triage_steps');
   ```
   **Esperado:** 4 tabelas retornadas

4. **Verifique estrutura da tabela `triage_reports`:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'triage_reports';
   ```
   **Importante:** Deve ter a coluna `report_data` (JSONB)

---

## ✅ 3. VALIDAÇÃO FINAL

### Código está pronto:
- ✅ Responsividade máxima aplicada
- ✅ Triagem sem scroll no mobile
- ✅ Relatório sendo gerado
- ✅ CTAs funcionais → checkout
- ✅ Supabase configurado
- ✅ Checkout funcional

### O que falta fazer manualmente:
1. ⚠️ **Executar SQL de migração no Supabase** (5 minutos)
2. ⚠️ **Configurar variáveis de ambiente** (10 minutos)
3. ⚠️ **Testar fluxo completo** (15 minutos)

---

## 🧪 4. TESTE PÓS-DEPLOY

1. **Teste triagem completa:**
   - Acesse `/emagrecimento`
   - Complete a triagem
   - Verifique se redireciona para relatório

2. **Teste relatório:**
   - Verifique se o relatório é gerado
   - Verifique se os CTAs aparecem
   - Clique em um CTA → deve ir para checkout

3. **Teste checkout:**
   - Preencha o formulário
   - Verifique se cria sessão Stripe
   - Teste com cartão de teste: `4242 4242 4242 4242`

---

## 🎯 RESUMO

**DATABASE_URL:** ✅ Formato correto, só trocar a senha  
**Migração SQL:** ⚠️ Executar manualmente no Supabase  
**Variáveis:** ⚠️ Configurar todas no ambiente de produção  
**Código:** ✅ Pronto para produção

**Tempo estimado para finalizar:** ~30 minutos
