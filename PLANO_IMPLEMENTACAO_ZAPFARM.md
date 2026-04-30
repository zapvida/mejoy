# 🚀 PLANO DE IMPLEMENTAÇÃO ZAPFARM - STATUS

## ✅ CONCLUÍDO

### 1. Configuração Centralizada ✅
- ✅ Criado `src/config/zapfarm/products.ts` com **10 produtos completos**
- ✅ Cada produto tem: cores, planos, conteúdo LPAC, SEO
- ✅ Helpers criados em `src/lib/zapfarm/product-loader.ts`

### 2. Componentes Compartilhados ✅
- ✅ `StickyCTA.tsx` - CTA mobile genérico
- ✅ `ProductBenefitsSection.tsx` - Seção de benefícios parametrizável
- ✅ `ProductFaqSection.tsx` - FAQ parametrizável
- ✅ `ProductHowItWorksSection.tsx` - Como funciona parametrizável

### 3. Rotas Dinâmicas ✅
- ✅ `src/pages/[product].tsx` - LPAC dinâmica para todos os produtos
- ✅ `src/pages/api/stripe/product-checkout.ts` - API de checkout genérica

### 4. Mapeamento de Engines ✅
- ✅ Atualizado `src/lib/report/derive.ts` com mapeamento dos 10 produtos

---

## 📋 PRÓXIMOS PASSOS

### Fase 1: Completar Páginas Dinâmicas (2-3 dias)

#### 1.1 Criar páginas de relatório dinâmicas
```
✅ Criar: src/pages/[product]/relatorio.tsx
   - Copiar estrutura de emagrecimento/relatorio.tsx
   - Adaptar para usar productConfig
   - Reutilizar componentes de relatório existentes
```

#### 1.2 Criar páginas de checkout dinâmicas
```
✅ Criar: src/pages/[product]/checkout.tsx
   - Copiar estrutura de emagrecimento/checkout.tsx
   - Adaptar para usar productConfig e plans
   - Usar API /api/stripe/product-checkout
```

#### 1.3 Criar páginas de obrigado dinâmicas
```
✅ Criar: src/pages/[product]/obrigado.tsx
   - Copiar estrutura de emagrecimento/obrigado.tsx
   - Adaptar para usar productConfig
```

### Fase 2: Criar Formulários de Triagem (3-4 dias)

#### 2.1 Criar formulários para os 9 novos produtos
```
✅ Criar: src/forms/calvicie.ts
✅ Criar: src/forms/sono.ts
✅ Criar: src/forms/ansiedade.ts
✅ Criar: src/forms/intestino.ts
✅ Criar: src/forms/figado.ts
✅ Criar: src/forms/libido-masculina.ts
✅ Criar: src/forms/menopausa.ts
✅ Criar: src/forms/articulacoes.ts
✅ Criar: src/forms/imunidade.ts
```

#### 2.2 Registrar formulários
```
✅ Atualizar: src/forms/index.ts
   - Adicionar novos tipos em TipoTriagem
   - Registrar todos os formulários
```

### Fase 3: Configurar Stripe (1 dia)

#### 3.1 Criar produtos e preços no Stripe
```
Para cada produto, criar 3 preços:
- Básico (mensal)
- Completo (trimestral)
- Premium (semestral)
```

#### 3.2 Configurar env vars
```
Adicionar no .env.local e Vercel:
STRIPE_PRICE_EMAGRECIMENTO_BASICO=price_xxx
STRIPE_PRICE_EMAGRECIMENTO_COMPLETO=price_xxx
STRIPE_PRICE_EMAGRECIMENTO_PREMIUM=price_xxx
... (repetir para todos os 10 produtos)
```

### Fase 4: Adaptar Componentes Específicos (opcional)

#### 4.1 Adaptar HeroSection para aceitar config
```
✅ Adaptar: src/components/zapfarm/emagrecimento/HeroSection.tsx
   - Aceitar config opcional
   - Manter backward compatibility
```

#### 4.2 Criar componentes específicos de relatório (se necessário)
```
Criar componentes específicos para cada produto se precisar de customização:
- ReportHero{Product}.tsx
- ReportAnalysis{Product}.tsx
- etc.
```

---

## 🎯 ESTRUTURA FINAL

```
src/
├── config/zapfarm/
│   └── products.ts                    ✅ COMPLETO (10 produtos)
│
├── lib/zapfarm/
│   └── product-loader.ts              ✅ COMPLETO
│
├── components/zapfarm/
│   ├── shared/                        ✅ COMPLETO
│   │   ├── StickyCTA.tsx
│   │   ├── ProductBenefitsSection.tsx
│   │   ├── ProductFaqSection.tsx
│   │   └── ProductHowItWorksSection.tsx
│   │
│   └── emagrecimento/                 ✅ MANTIDO (já funciona)
│       └── ...
│
├── pages/
│   ├── [product].tsx                  ✅ COMPLETO
│   ├── [product]/
│   │   ├── relatorio.tsx              ⏳ PRÓXIMO
│   │   ├── checkout.tsx               ⏳ PRÓXIMO
│   │   └── obrigado.tsx                ⏳ PRÓXIMO
│   │
│   └── api/stripe/
│       └── product-checkout.ts        ✅ COMPLETO
│
└── forms/
    ├── emagrecimento.ts                ✅ EXISTE
    ├── calvicie.ts                     ⏳ PRÓXIMO
    ├── sono.ts                         ⏳ PRÓXIMO
    └── ... (outros 7 produtos)         ⏳ PRÓXIMO
```

---

## 📝 CHECKLIST DE LANÇAMENTO

### Técnico
- [x] Configuração centralizada criada
- [x] Componentes compartilhados criados
- [x] Rotas dinâmicas de LPAC criadas
- [x] API de checkout genérica criada
- [x] Mapeamento de engines configurado
- [ ] Páginas de relatório dinâmicas
- [ ] Páginas de checkout dinâmicas
- [ ] Páginas de obrigado dinâmicas
- [ ] Formulários de triagem (9 novos)
- [ ] Preços Stripe configurados

### Conteúdo
- [x] Configuração completa dos 10 produtos
- [ ] Revisar textos de cada produto
- [ ] Validar FAQs
- [ ] Validar features dos planos

### Testes
- [ ] Testar fluxo completo de cada produto
- [ ] Validar responsividade mobile
- [ ] Testar checkout Stripe
- [ ] Validar webhook de pagamento

---

## 🚀 COMO USAR

### Para adicionar um novo produto:

1. Adicionar configuração em `src/config/zapfarm/products.ts`
2. Criar formulário em `src/forms/{slug}.ts`
3. Registrar em `src/forms/index.ts`
4. Criar preços no Stripe e adicionar env vars
5. Pronto! O produto já funciona em `/{slug}`

### Para editar conteúdo de um produto:

1. Editar `src/config/zapfarm/products.ts`
2. Rebuild do site
3. Pronto! Mudanças aplicadas

---

## 📊 PRODUTOS CONFIGURADOS

1. ✅ **emagrecimento** - Completo e funcionando
2. ✅ **calvicie** - Configurado, falta formulário
3. ✅ **sono** - Configurado, falta formulário
4. ✅ **ansiedade** - Configurado, falta formulário
5. ✅ **intestino** - Configurado, falta formulário
6. ✅ **figado** - Configurado, falta formulário
7. ✅ **libido-masculina** - Configurado, falta formulário
8. ✅ **menopausa** - Configurado, falta formulário
9. ✅ **articulacoes** - Configurado, falta formulário
10. ✅ **imunidade** - Configurado, falta formulário

---

## 🎨 DESIGN E UX

- ✅ Layout mobile-first mantido
- ✅ Componentes responsivos
- ✅ Cores dinâmicas por produto
- ✅ Sticky CTA mobile
- ✅ Animações e transições suaves

---

**Status atual: Base técnica completa! Pronto para criar formulários e páginas dinâmicas restantes.**

