# 🧪 PLANO PERFEITO DE TESTES COMPLETOS - PRODUÇÃO

**Data:** 4 de novembro de 2025  
**Ambiente:** https://www.aistotele.com (Produção)  
**Objetivo:** Validar todo o ciclo B2B2C como um usuário real

---

## 📋 ÍNDICE DE TESTES

1. [Testes de Infraestrutura](#1-testes-de-infraestrutura)
2. [Testes de Landing Page B2B](#2-testes-de-landing-page-b2b)
3. [Testes do Wizard de Personalização](#3-testes-do-wizard-de-personalização)
4. [Testes de Formulário de Assinatura](#4-testes-de-formulário-de-assinatura)
5. [Testes de Checkout Stripe](#5-testes-de-checkout-stripe)
6. [Testes de Webhook e Provisionamento](#6-testes-de-webhook-e-provisionamento)
7. [Testes de Multi-Tenancy](#7-testes-de-multi-tenancy)
8. [Testes de APIs Backend](#8-testes-de-apis-backend)
9. [Testes de Integrações](#9-testes-de-integrações)
10. [Testes de Performance e Segurança](#10-testes-de-performance-e-segurança)

---

## 1. TESTES DE INFRAESTRUTURA

### 1.1 Domínio e SSL
- [ ] `https://www.aistotele.com` carrega sem erros
- [ ] SSL válido (certificado verde)
- [ ] Redirecionamento HTTP → HTTPS funciona
- [ ] Sem erros de CORS
- [ ] Sem erros no console do navegador

### 1.2 CDN e Assets
- [ ] Imagens carregam corretamente
- [ ] CSS aplicado (sem layout quebrado)
- [ ] JavaScript executa sem erros
- [ ] Fontes carregam
- [ ] Favicon aparece

### 1.3 Performance Básica
- [ ] Tempo de carregamento < 3s
- [ ] Lighthouse score > 70
- [ ] Sem recursos bloqueando renderização

---

## 2. TESTES DE LANDING PAGE B2B

### 2.1 Renderização
- [ ] Página carrega completamente
- [ ] Hero section visível
- [ ] CTAs visíveis e clicáveis
- [ ] Seções principais presentes (produto, como funciona, casos, recursos, planos, FAQ)

### 2.2 CTAs Principais
- [ ] "Personalizar agora (grátis)" → `/b2b/configurar`
- [ ] "Ver demonstração" → `/b2b/sandbox`
- [ ] "Assinar em 2 min" → `/b2b/assinar`
- [ ] CTAs no mobile funcionam

### 2.3 Navegação
- [ ] Menu hamburger no mobile
- [ ] Links do menu funcionam
- [ ] Scroll suave entre seções
- [ ] Ancoras (#cases, #faq) funcionam

### 2.4 Conteúdo
- [ ] Textos corretos (sem placeholders)
- [ ] Imagens dos casos de uso aparecem
- [ ] FAQ expande/colapsa
- [ ] Responsivo (mobile/tablet/desktop)

---

## 3. TESTES DO WIZARD DE PERSONALIZAÇÃO

### 3.1 Acesso
- [ ] URL `/b2b/configurar` carrega
- [ ] Formulário completo presente
- [ ] Preview visível ao lado

### 3.2 Upload de Logo
- [ ] Botão "Enviar logo" funciona
- [ ] Aceita PNG, JPG, SVG
- [ ] Valida tamanho máximo (5MB)
- [ ] Preview do logo aparece após upload
- [ ] Erro se arquivo muito grande
- [ ] Erro se formato inválido

### 3.3 Seleção de Cores
- [ ] Color picker funciona
- [ ] Input de hex aceita valores válidos
- [ ] Preview atualiza em tempo real
- [ ] Validação de hex inválido

### 3.4 Campos de Texto
- [ ] Nome da clínica: aceita texto
- [ ] Texto do CTA: aceita texto
- [ ] URL do CTA: valida formato URL
- [ ] WhatsApp: valida formato (opcional)
- [ ] Domínio: valida formato (opcional)

### 3.5 Preview em Tempo Real
- [ ] Preview atualiza ao mudar cores
- [ ] Preview atualiza ao mudar logo
- [ ] Preview atualiza ao mudar texto
- [ ] Botão de preview funciona
- [ ] Link "Ver demo em tela cheia" funciona

### 3.6 Submissão
- [ ] Botão "Continuar" desabilitado se campos obrigatórios vazios
- [ ] Botão "Continuar" habilitado com dados válidos
- [ ] Ao clicar, redireciona para `/b2b/assinar?draft={id}`
- [ ] `draft_id` presente na URL

---

## 4. TESTES DE FORMULÁRIO DE ASSINATURA

### 4.1 Acesso
- [ ] URL `/b2b/assinar?draft={id}` carrega
- [ ] Formulário completo presente
- [ ] `draft_id` presente na URL

### 4.2 Campos do Formulário
- [ ] Nome completo: obrigatório
- [ ] E-mail: valida formato
- [ ] WhatsApp: valida formato BR
- [ ] Nome da clínica: obrigatório
- [ ] Validação de campos vazios

### 4.3 Submissão
- [ ] Botão "Enviar e ativar" funciona
- [ ] Envia dados para `/api/b2b/lead`
- [ ] Mostra mensagem de sucesso
- [ ] Redireciona para `/pricing?draft={id}`
- [ ] `draft_id` mantido na URL

### 4.4 Integração com Backend
- [ ] Lead salvo no banco (Supabase)
- [ ] Lead enviado para GHL (GoHighLevel)
- [ ] Oportunidade criada no GHL

---

## 5. TESTES DE CHECKOUT STRIPE

### 5.1 Página de Planos
- [ ] URL `/pricing?draft={id}` carrega
- [ ] Planos visíveis (Plus, Gift)
- [ ] Preços corretos (R$ 29,90/mês, R$ 299/ano, etc.)
- [ ] `draft_id` presente na URL

### 5.2 Seleção de Plano
- [ ] Botões de seleção funcionam
- [ ] Toggle mensal/anual funciona
- [ ] Preço atualiza ao mudar período
- [ ] Botão "Assinar agora" presente

### 5.3 Criação de Checkout Session
- [ ] Ao clicar "Assinar", chama `/api/stripe/create-checkout-session`
- [ ] Request inclui `draft_id` no body
- [ ] Request inclui `price_id` correto
- [ ] Response retorna `checkout_url`
- [ ] Redireciona para Stripe Checkout

### 5.4 Stripe Checkout
- [ ] Página do Stripe carrega
- [ ] Plano selecionado aparece
- [ ] Preço correto
- [ ] Campos de pagamento presentes
- [ ] Botão de pagamento funciona

### 5.5 Pagamento de Teste
- [ ] Cartão de teste: `4242 4242 4242 4242`
- [ ] Data: qualquer futura
- [ ] CVC: qualquer 3 dígitos
- [ ] CEP: qualquer
- [ ] Pagamento completa com sucesso
- [ ] Redireciona para success page

---

## 6. TESTES DE WEBHOOK E PROVISIONAMENTO

### 6.1 Webhook Stripe
- [ ] Evento `checkout.session.completed` recebido
- [ ] Webhook processado com sucesso (200 OK)
- [ ] `draft_id` presente no metadata
- [ ] Logs no Stripe Dashboard mostram sucesso

### 6.2 Provisionamento de Tenant
- [ ] `provisionTenantFromSession()` executado
- [ ] Tenant criado no Supabase
- [ ] Slug gerado (único)
- [ ] URL provisória gerada: `{slug}.aistotele.app`
- [ ] Branding aplicado (logo, cores, nome)

### 6.3 Limpeza de Draft
- [ ] `BrandingDraft` deletado após provisionamento
- [ ] Logo deletado do Supabase Storage (se órfão)
- [ ] Verificação no banco: draft não existe mais

### 6.4 Notificações
- [ ] WhatsApp enviado (se configurado)
- [ ] Mensagem contém URL provisória
- [ ] E-mail enviado (se configurado)
- [ ] GHL opportunity atualizada para "WON"

---

## 7. TESTES DE MULTI-TENANCY

### 7.1 URL Provisória
- [ ] `https://{slug}.aistotele.app` carrega
- [ ] Branding aplicado (logo, cores)
- [ ] Nome da clínica aparece
- [ ] CTAs personalizados funcionam
- [ ] Domínio custom (se configurado) funciona

### 7.2 Roteamento por Domínio
- [ ] Root domain (`aistotele.com`) → LP B2B
- [ ] Subdomain (`{slug}.aistotele.app`) → Tenant específico
- [ ] Domínio custom (`clinica.com.br`) → Tenant específico

### 7.3 Isolamento de Dados
- [ ] Tenant A não vê dados de Tenant B
- [ ] Triagens isoladas por tenant
- [ ] Analytics isolados por tenant

---

## 8. TESTES DE APIs BACKEND

### 8.1 API Tenant Info
- [ ] `GET /api/tenant/info` → 200 OK
- [ ] Response contém dados corretos
- [ ] Resolve tenant por host/slug correto
- [ ] Fallback para default funciona

### 8.2 API Branding Draft
- [ ] `POST /api/branding/draft` → cria draft
- [ ] `GET /api/branding/draft?id={id}` → retorna draft
- [ ] Expiração de 48h funciona
- [ ] Validação de dados funciona

### 8.3 API Upload Logo
- [ ] `POST /api/branding/upload-logo` → upload funciona
- [ ] Valida tamanho máximo (5MB)
- [ ] Valida formato (imagem)
- [ ] Retorna URL do logo
- [ ] Logo salvo no Supabase Storage

### 8.4 API B2B Lead
- [ ] `POST /api/b2b/lead` → salva lead
- [ ] Validação de campos funciona
- [ ] Envia para GHL
- [ ] Retorna sucesso

### 8.5 API Cron Cleanup
- [ ] `POST /api/cron/cleanup` → funciona
- [ ] Autenticação por token funciona
- [ ] Deleta drafts expirados (>48h)
- [ ] Deleta tenants pending expirados (>48h)
- [ ] Remove logos órfãos

### 8.6 API Stripe Webhook
- [ ] `POST /api/stripe/webhook` → processa eventos
- [ ] Valida assinatura do webhook
- [ ] Processa `checkout.session.completed`
- [ ] Retorna 200 OK

---

## 9. TESTES DE INTEGRAÇÕES

### 9.1 Supabase
- [ ] Conexão com banco funciona
- [ ] Prisma Client funciona
- [ ] Storage funciona (upload/download)
- [ ] Migrations aplicadas

### 9.2 Stripe
- [ ] Conexão com API funciona
- [ ] Produtos criados (Plus, Gift, Addon)
- [ ] Preços criados (6 preços)
- [ ] Webhook configurado
- [ ] Metadata funcionando

### 9.3 GoHighLevel (GHL)
- [ ] Conexão com API funciona
- [ ] Lead criado no GHL
- [ ] Oportunidade criada
- [ ] Oportunidade atualizada para "WON"
- [ ] WhatsApp enviado (se configurado)

### 9.4 Google Analytics
- [ ] GA4 configurado
- [ ] Eventos sendo enviados
- [ ] Conversões rastreadas

---

## 10. TESTES DE PERFORMANCE E SEGURANÇA

### 10.1 Performance
- [ ] Lighthouse score > 70
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Sem recursos bloqueando
- [ ] Images otimizadas

### 10.2 Segurança
- [ ] HTTPS obrigatório
- [ ] Headers de segurança (CSP, HSTS)
- [ ] Rate limiting nas APIs
- [ ] Validação de inputs
- [ ] Sanitização de dados
- [ ] Sem SQL injection
- [ ] Sem XSS

### 10.3 LGPD
- [ ] Consentimento obrigatório
- [ ] Política de privacidade
- [ ] Botão de deletar dados
- [ ] Cookies configurados

---

## 📊 CHECKLIST DE EXECUÇÃO

### ✅ Testes Automatizados (Já Executados)
- [x] Smoke Test: 7/7 passou
- [x] E2E Test: 3/3 passou
- [x] Rotas principais: Todas OK

### ⏳ Testes Manuais (Executar Agora)
- [ ] Landing Page B2B
- [ ] Wizard de Personalização
- [ ] Formulário de Assinatura
- [ ] Checkout Stripe
- [ ] Webhook e Provisionamento
- [ ] Multi-Tenancy
- [ ] APIs Backend
- [ ] Integrações

---

## 🎯 PRÓXIMOS PASSOS

1. **Executar testes manuais** (seguir checklist acima)
2. **Documentar problemas encontrados**
3. **Corrigir issues críticos**
4. **Re-validar após correções**
5. **GO/NO-GO para lançamento**

---

**Próxima ação:** Executar testes manuais e documentar resultados.

