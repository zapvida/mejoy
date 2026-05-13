# Aistotele - Sistema de Check-up Completo

Sistema completo de triagem médica e geração de relatórios personalizados com IA, com foco na triagem gastrointestinal gratuita e sistema de autosave progressivo.

> **Deploy:** aistotele.vercel.app  
> **Repositório:** https://github.com/aistoteleapp-art/aistotele

## 🔒 Segurança P0 - Implementado

Este projeto implementa todas as práticas de segurança P0 críticas:

- ✅ **Segredos removidos** do repositório
- ✅ **Autenticação obrigatória** em APIs sensíveis
- ✅ **Rate limiting** em todas as APIs críticas
- ✅ **RLS (Row Level Security)** no Supabase
- ✅ **Consentimento LGPD** obrigatório
- ✅ **Feature flags** para TTS e PDF V2
- ✅ **Monitoração** com Sentry e logs estruturados
- ✅ **Testes de segurança** automatizados

## 🚀 Tecnologias

- **Frontend**: Next.js 15 + React 19 + Tailwind CSS
- **Backend**: Supabase (Postgres) + Prisma ORM
- **IA**: OpenAI GPT-4 para geração de relatórios personalizados
- **PDF**: @react-pdf/renderer para relatórios em PDF
- **Tema**: Dark/Light mode com next-themes
- **Pagamentos**: Stripe + Asaas (mantidos do projeto original)
- **Autosave**: Sistema progressivo sem login obrigatório
- **Segurança**: Sentry + Rate Limiting + RLS + LGPD

## 📋 Setup Local

### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar Prisma
```bash
npx prisma generate
npx prisma migrate dev -n drop_cpf_enable_session_login
```

### 3. Variáveis de ambiente (.env.local)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_secret_from_provider

# Postgres para Prisma
DATABASE_URL="postgresql://your_user:your_password@your_host:5432/your_database"

# OpenAI
OPENAI_API_KEY=your_secret_from_provider

# App
NEXT_PUBLIC_APP_NAME="Alloe Health"

# Triagem Gratuita (configurável)
NEXT_PUBLIC_FREE_TRIAGE_SLUG=gastro

# Feature Flags
TTS_ENABLED=0  # 0=desabilitado, 1=habilitado
PDF_V2=0       # 0=window.print(), 1=endpoint Puppeteer
NEXT_PUBLIC_TRIAGE_V2=1  # Nova experiência de triagem

# Monitoração
SENTRY_DSN=your_sentry_dsn

# Stripe (preços para desbloqueio)
STRIPE_PRICE_ALL_ACCESS=price_your_49_price_id
STRIPE_PRICE_GIFT=price_your_89_price_id
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=your_secret_from_provider

# Firebase (para migração - opcional)
FIREBASE_ADMIN_JSON='{"type":"service_account",...}'

# Asaas (mantido do projeto original)
ASAAS_API_KEY=your_secret_from_provider
WEBHOOK_ASAAS_URL=https://your-domain.com/api/asaasWebhook

# NextAuth (mantido do projeto original)
NEXTAUTH_SECRET=your_secret_from_provider
NEXTAUTH_URL=http://localhost:3000
```

### 4. Executar o projeto
```bash
pnpm dev
```

## 🎯 Funcionalidades Principais

### ✅ Triagem Gastrointestinal Gratuita
- **Lead Magnet**: Triagem completa de saúde gastrointestinal sem custo
- **Autosave Progressivo**: Salva dados a cada pergunta (nome → nascimento → email → whatsapp → peso → altura → sexo)
- **Personalização**: Perguntas e orientações específicas por sexo e idade
- **Sem Login**: Usuário não precisa criar conta para fazer a triagem

### ✅ Sistema de Cadeados Premium
- **Gastro**: 🔓 Gratuita (principal)
- **Demais Triagens**: 🔒 Premium (R$ 49 ou presente R$ 89)
- **Checkout Integrado**: Redirecionamento automático para Stripe
- **Preservação**: Todas as triagens existentes mantidas

### ✅ Relatórios Inteligentes
- **Fonte Única**: Card com Nome | Idade | IMC | Sexo
- **IA Personalizada**: Prompts específicos por idade/sexo
- **PDF Profissional**: Download direto do relatório
- **Plano de Vida**: 12 semanas + manutenção (Premium)

## 🔄 Migração de Dados (Opcional)

Para migrar dados existentes do Firestore para Supabase:

```bash
# Definir FIREBASE_ADMIN_JSON no .env.local
npx ts-node src/scripts/migrateFirestoreToSupabase.ts
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── pdf/ReportPDF.tsx          # Componente PDF
│   ├── ui/
│   │   ├── cards/PacienteInfoCard.tsx
│   │   └── ThemeToggle.tsx
├── forms/
│   ├── gastro.ts                  # Triagem gastrointestinal completa
│   └── index.ts                   # Sistema de cadeados
├── hooks/
│   └── useAutosaveTriage.ts      # Hook para autosave
├── lib/
│   ├── prisma.ts                  # Cliente Prisma
│   └── supabase/client.ts         # Cliente Supabase
├── pages/
│   ├── api/
│   │   ├── triage/
│   │   │   ├── start.ts           # Iniciar sessão
│   │   │   └── autosave.ts        # Salvar progresso
│   │   ├── gerarRelatorio.ts      # API migrada para Prisma
│   │   └── pdf/[id].ts            # Endpoint PDF
│   ├── relatorio/[id].tsx         # Página de relatório
│   └── triagem/
│       ├── index.tsx              # Seleção com cadeados
│       ├── gastro.tsx             # Triagem gastrointestinal
│       └── [tipo].tsx             # Formulário genérico
├── scripts/
│   └── migrateFirestoreToSupabase.ts
└── utils/
    └── health.ts                  # Parsers seguros + helpers
```

## 🎨 Design System

### Cores Alloe Health
- **Primária**: `#2fb356` (alloe-500)
- **Escala**: alloe-50 até alloe-900
- **Tema**: Dark/Light com next-themes

### Componentes Principais
- **PacienteInfoCard**: Nome, Idade, IMC, Sexo unificados
- **ThemeToggle**: Alternância dark/light
- **ReportPDF**: PDF profissional com @react-pdf/renderer
- **Sistema de Cadeados**: Visual diferenciado para free/premium

## 🔧 Funcionalidades

### ✅ Implementado
- [x] Triagem gastrointestinal gratuita completa
- [x] Sistema de autosave progressivo (uma pergunta por vez)
- [x] Personalização por sexo e idade
- [x] Remoção completa do CPF do sistema
- [x] Login sem senha por email (Supabase OTP)
- [x] Sistema de cadeados para triagens premium
- [x] Parsers seguros para data (8 dígitos), peso, altura
- [x] Cálculo automático de IMC e idade
- [x] Relatórios com fonte única de dados
- [x] Migração completa para Supabase + Prisma

### 🔄 Mantido do Projeto Original
- [x] Stripe para pagamentos (R$ 49 / R$ 89)
- [x] Asaas para cobrança
- [x] NextAuth para autenticação
- [x] Firebase Admin (para migração)
- [x] Todas as triagens existentes (com cadeado)

## 🚀 Deploy na Vercel

1. Conectar repositório à Vercel
2. Configurar variáveis de ambiente (incluir STRIPE_PRICE_*)
3. Build Command: `pnpm build`
4. Output Directory: `.next`
5. Adicionar `postinstall: prisma generate` nos scripts

## 📊 Banco de Dados

### Modelos Prisma Atualizados
- **Patient**: Dados do paciente (email único, sessionId, sem CPF)
- **Triage**: Triagens realizadas (status draft/submitted)
- **Report**: Relatórios gerados (scores, conteúdo IA, PDF)

### Principais Mudanças
- ❌ Removido: `Patient.cpf` (campo único)
- ✅ Adicionado: `Patient.email` (único para login)
- ✅ Adicionado: `Patient.sessionId` (para autosave)
- ✅ Adicionado: `Triage.status` (draft/submitted)

## 🧪 QA e Testes

### Testes de Segurança
```bash
# Executar QA completo de segurança
./scripts/qa-security.sh

# Testes E2E de segurança
pnpm test:e2e tests/e2e/security-critical.spec.ts

# Testes de acessibilidade
pnpm test:e2e tests/e2e/accessibility-critical.spec.ts
```

### Verificação de Segredos
```bash
# Instalar gitleaks
npm install -g gitleaks

# Verificar segredos
gitleaks detect --source . --verbose
```

### Build e Deploy
```bash
# Build de produção
pnpm build

# Verificar TypeScript
pnpm tsc --noEmit

# Verificar ESLint
pnpm lint
```

## 🔒 Segurança

### APIs Protegidas
- `/api/triage/answer` - Rate limit 5/min, owner-only
- `/api/tts` - Rate limit 3/min, auth obrigatória, feature flag
- `/api/pdf/[id]` - Rate limit 2/min, auth obrigatória, feature flag
- `/api/stripe/webhook` - Rate limit 10/min, validação Stripe

### Feature Flags
- `TTS_ENABLED=0` - TTS desabilitado (retorna 501)
- `PDF_V2=0` - PDF via window.print() (fallback)
- `NEXT_PUBLIC_TRIAGE_V2=1` - Nova experiência de triagem

### LGPD
- Consentimento obrigatório antes da triagem
- Modal com links para termos e privacidade
- Registro de consentimento com IP hash
- Função de revogação disponível

### Monitoração
- Sentry configurado para produção
- Logs estruturados com reqId, userId, IP
- Métricas de performance e erro
- Eventos de negócio capturados

## 🎯 Fluxo Completo

### Triagem Gratuita (Gastrointestinal)
1. **Landing**: Usuário clica "Fazer triagem gratuita"
2. **LGPD**: Modal de consentimento obrigatório
3. **Autosave**: Nome → nascimento → email → whatsapp → peso → altura → sexo
4. **Personalização**: Perguntas específicas por sexo/idade
5. **Relatório**: IA gera conteúdo personalizado
6. **PDF**: Download do relatório completo
6. **CTA Premium**: Opção de desbloquear todas as triagens

### Triagens Premium
1. **Grid**: Cards com cadeado 🔒
2. **Click**: Modal com opções R$ 49 / presente R$ 89
3. **Checkout**: Redirecionamento para Stripe
4. **Desbloqueio**: Todas as triagens ficam acessíveis

## 🔒 Segurança

- ✅ Validação de email nos endpoints
- ✅ Sanitização de dados de entrada
- ✅ Rate limiting nas APIs de IA
- ✅ Autenticação via Supabase OTP
- ✅ SessionId para controle de acesso
- ✅ CORS configurado para produção

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do console
2. Validar variáveis de ambiente
3. Testar conexão com Supabase
4. Verificar migração do banco de dados
5. Confirmar configuração do Stripe

## 🎉 Pronto para Lançamento

O sistema está completamente funcional com:
- ✅ Triagem gastrointestinal gratuita como lead magnet
- ✅ Autosave progressivo sem fricção
- ✅ Personalização completa por sexo/idade
- ✅ Sistema de monetização com cadeados
- ✅ Relatórios profissionais com PDF
- ✅ Todas as triagens existentes preservadas