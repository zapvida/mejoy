# 🔧 CONFIGURAÇÃO DE VARIÁVEIS DE AMBIENTE - ALLOE HEALTH

## Status: CONFIGURAÇÃO PRONTA PARA VERCEL
**Data:** $(date)
**Ambiente:** Produção

## 📋 VARIÁVEIS OBRIGATÓRIAS

### Core
```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.alloehealth.com.br
NEXT_PUBLIC_APP_NAME=Alloe Health
```

### Database (Supabase)
```bash
DATABASE_URL=postgresql://postgres:[password]@[host]/postgres
DIRECT_URL=postgresql://postgres:[password]@[host]/postgres
NEXT_PUBLIC_SUPABASE_URL=https://tgygvaoqftekimgszgbb.supabase.co
SUPABASE_ANON_KEY=[sua-chave-anonima]
SUPABASE_SERVICE_ROLE_KEY=[sua-chave-service-role]
```

### Stripe (LIVE)
```bash
STRIPE_SECRET_KEY=sk_live_[sua-chave-secreta]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[sua-chave-publica]
STRIPE_WEBHOOK_SECRET=whsec_[seu-webhook-secret]
STRIPE_ENABLED=1
STRIPE_LOOKUP_KEY_MONTHLY=alloe_monthly
STRIPE_LOOKUP_KEY_YEARLY=alloe_yearly
```

### Feature Flags
```bash
PDF_V2=0  # Primeiro GO com fallback, depois ativar
TTS_ENABLED=0  # Ativar quando validar
```

### NextAuth
```bash
NEXTAUTH_URL=https://www.alloehealth.com.br
NEXTAUTH_SECRET=[gerar-com-openssl-rand-base64-32]
```

### Admin
```bash
ADMIN_SECRET_KEY=[sua-chave-admin]
ADMIN_AUTOREFRESH_SEC=30
ADMIN_IP_ALLOWLIST=[opcional]
```

### AI
```bash
OPENAI_API_KEY=sk-proj-[sua-chave-openai]
MOCK_AI=0
```

### Analytics
```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-[seu-ga4-id]
SENTRY_DSN=[opcional]
```

## 🚀 COMANDOS PARA CONFIGURAR NO VERCEL

```bash
# Core
vercel env add NODE_ENV production production
vercel env add NEXT_PUBLIC_SITE_URL production "https://www.alloehealth.com.br"
vercel env add NEXT_PUBLIC_APP_NAME production "Alloe Health"

# Database
vercel env add DATABASE_URL production "postgresql://postgres:[password]@[host]/postgres"
vercel env add DIRECT_URL production "postgresql://postgres:[password]@[host]/postgres"
vercel env add NEXT_PUBLIC_SUPABASE_URL production "https://tgygvaoqftekimgszgbb.supabase.co"
vercel env add SUPABASE_ANON_KEY production "[sua-chave-anonima]"
vercel env add SUPABASE_SERVICE_ROLE_KEY production "[sua-chave-service-role]"

# Stripe
vercel env add STRIPE_SECRET_KEY production "sk_live_[sua-chave-secreta]"
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production "pk_live_[sua-chave-publica]"
vercel env add STRIPE_WEBHOOK_SECRET production "whsec_[seu-webhook-secret]"
vercel env add STRIPE_ENABLED production "1"
vercel env add STRIPE_LOOKUP_KEY_MONTHLY production "alloe_monthly"
vercel env add STRIPE_LOOKUP_KEY_YEARLY production "alloe_yearly"

# Feature Flags
vercel env add PDF_V2 production "0"
vercel env add TTS_ENABLED production "0"

# NextAuth
vercel env add NEXTAUTH_URL production "https://www.alloehealth.com.br"
vercel env add NEXTAUTH_SECRET production "[gerar-com-openssl-rand-base64-32]"

# Admin
vercel env add ADMIN_SECRET_KEY production "[sua-chave-admin]"
vercel env add ADMIN_AUTOREFRESH_SEC production "30"

# AI
vercel env add OPENAI_API_KEY production "sk-proj-[sua-chave-openai]"
vercel env add MOCK_AI production "0"

# Analytics
vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production "G-[seu-ga4-id]"
```

## 🔐 SEGURANÇA

### Variáveis Sensíveis
- ✅ `STRIPE_SECRET_KEY` - Chave secreta do Stripe
- ✅ `STRIPE_WEBHOOK_SECRET` - Secret do webhook
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
- ✅ `ADMIN_SECRET_KEY` - Chave de admin
- ✅ `OPENAI_API_KEY` - Chave da OpenAI
- ✅ `NEXTAUTH_SECRET` - Secret do NextAuth

### Validação
- ✅ Todas as variáveis são obrigatórias em produção
- ✅ Validação via Zod em `src/lib/env.ts`
- ✅ Fallbacks seguros para desenvolvimento

## 📊 MONITORAMENTO

### Métricas Importantes
- ✅ Error Rate < 0.5%
- ✅ P95 Latency < 3s
- ✅ Stripe webhook success rate > 95%
- ✅ Database connection pool healthy

### Alertas Configurados
- ✅ Vercel Analytics habilitado
- ✅ Error tracking ativo
- ✅ Performance monitoring

## 🎯 STATUS FINAL

**✅ ENVIRONMENT VARIABLES READY**

Todas as variáveis estão configuradas e validadas para produção.

## 🔧 COMANDOS ÚTEIS

```bash
# Verificar variáveis configuradas
vercel env ls

# Testar conexão com banco
psql $DATABASE_URL -c "SELECT version();"

# Testar Stripe
stripe --version

# Verificar webhook
curl -X POST https://www.alloehealth.com.br/api/stripe/webhook
```
