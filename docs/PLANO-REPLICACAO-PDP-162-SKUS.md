# Plano de Replicação PDP — 162 SKUs (Versão Definitiva)

> **Objetivo:** Replicar a estrutura validada do Akkermat em **todos os 162 produtos** — mesma estrutura de layout, seções e ordem. Copy **individualizada** para cada um.  
> **Princípio:** Akkermat é intocável. **Todos** usam a mesma estrutura validada em `/p/akkermat-150-mg-30-capsulas`.  
> **Meta:** E-commerce de farmácia melhor que todos os concorrentes, pronto para campanhas e vendas em todo o Brasil.  
> **Data:** 2026-03-07

---

## 1. Estrutura Validada — Todos os Produtos

**Todos os 162 produtos usam a mesma página e a mesma estrutura.** A PDP é única (`/p/[slug].tsx`). Não existe layout alternativo ou "versão simplificada".

### Ordem das seções (igual ao Akkermat)

| # | Seção | Condição para aparecer |
|---|-------|------------------------|
| 1 | Breadcrumb | Sempre |
| 2 | Galeria (imagem + 5 thumbnails) | Sempre |
| 3 | Título H1 + formDisplay | Sempre |
| 4 | Subtítulo (mechanism_summary) | `mechanism_summary` preenchido |
| 5 | Rating + avaliações | Sempre |
| 6 | Hero bullets (4–5 itens) | `heroBullets` com 3+ itens |
| 7 | Trust line | Sempre |
| 8 | Bloco decisório (preço, quantidade, CTA) | Sempre |
| 9 | Calculadora de frete | Sempre (quando preço > 0) |
| 10 | TrustBar (4 cards) | Sempre |
| 11 | **O que é** | `description` ou `shortBenefit` |
| 12 | **Como funciona** | `copyV4Science` (science_summary) |
| 13 | **Para que serve** (grid 6 benefícios) | `paraQueServe` com 1+ itens |
| 14 | **O que torna esta fórmula diferente** | `copyV4Diferencial` |
| 15 | **Para quem é ideal** | `copyV4BestFit` |
| 16 | **Como usar** | `howToUseBullets` |
| 17 | **Composição** | `activeIngredients` |
| 18 | **Advertências e precauções** | `advertenciasCompleto` ou `copyV2Cautions` |
| 19 | **Perguntas frequentes** | `copyV2Faq` |
| 20 | Como funciona sua compra | Sempre |
| 21 | Avaliações | Sempre |
| 22 | Quem viu, viu também | Sempre |
| 23 | Sticky CTA (mobile) | Sempre |

**Para que todos tenham a estrutura idêntica ao Akkermat:** preencher o blueprint com todos os campos. Seções sem dados ficam ocultas; com dados completos, a estrutura é idêntica.

---

## 2. Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Akkermat intocável** | MEJOY-0048 não pode ser alterado. É o padrão-ouro. |
| **Todos com a mesma estrutura** | Os 162 produtos usam a mesma PDP. Nenhum tem layout diferente ou simplificado. |
| **Cada produto é único** | 5-HTP 100 mg ≠ 5-HTP 50 mg ≠ Ashwagandha. Copy, benefícios e textos devem ser individualizados. |
| **Estrutura replicada, conteúdo personalizado** | Mesmo layout (6 benefícios, O que é, Como funciona, etc.), mas texto específico por ativo, dose e objetivo. |
| **Melhor que concorrentes** | Copy mais completa, científica e conversível. Gatilhos mentais, linguagem regulatória, benefício + mecanismo. |
| **Pronto para lançamento** | SEO, meta tags, schema, CTAs, imagens, preços — tudo validado antes de campanhas. |

---

## 3. O que "Akkermat Quality" Significa (Padrão por Campo)

Cada produto deve atingir este padrão em cada campo:

| Campo | Padrão Akkermat | Regra de Individualização |
|-------|----------------|--------------------------|
| **hero_benefit** | Frase de impacto com benefício principal + dose | Incluir ativo, dose, benefício principal. Ex: "5-HTP 100 mg: suporte ao equilíbrio emocional pela produção natural de serotonina." |
| **mechanism_summary** (≤180 chars) | Subtítulo que explica o "como" em linguagem acessível | Específico do ativo: mecanismo (ex: precursor serotonina), benefício, "resultados quando associado a..." |
| **heroBullets** (5 itens) | Benefício + emoji, sem repetição | Derivados do hero_benefit + benefícios únicos do ativo. Cada bullet = um benefício distinto. |
| **para_que_serve** (6 itens) | Título + Descrição com mecanismo e benefício concreto | Cada benefício: nome do benefício \| explicação científica + benefício prático. Específico do ativo. |
| **whatIsIt** (O que é) | Parágrafo: o que é + para que serve + diferencial + CTA implícito | Nome do produto + ativo + dose + benefícios principais + "resultados visíveis quando associado a..." |
| **science_summary** (Como funciona) | Mecanismo científico: hormônios, vias, efeitos | Específico: como o ativo age no corpo (ex: GLP-1, serotonina, cortisol), em linguagem acessível. |
| **what_makes_this_formula_different** | Tecnologia/dose/combinação + múltiplos mecanismos | O que torna ESTA fórmula única: dose, forma (cápsula, etc.), manipulação, biodisponibilidade. |
| **best_fit_profile** | "Ideal para quem busca X, com foco em Y e orientação Z." | Perfil do consumidor deste ativo específico. |
| **how_to_use_bullets** | 3 itens: dose, apresentação, orientação profissional | Dose específica, pack específico, "Siga orientação do médico/nutricionista." |
| **faq** (5 perguntas) | O que é, Como usar, Contraindicações, Combinação, Substitui alimentação | Perguntas com nome do produto. Respostas específicas. |
| **advertencias_completo** | Bloco legal + específico do produto | Imagens ilustrativas, armazenamento, gestantes/lactantes, não substitui alimentação. |

---

## 4. Sistema de Individualização por Produto

Cada produto tem **dados únicos** que devem aparecer na copy:

| Dado | Fonte | Uso na Copy |
|------|-------|-------------|
| **primaryActive** | blueprint | Nome do ativo principal (5 HTP, Ashwagandha, Akkermat) |
| **dose** | blueprint | Dose por unidade (100 mg, 500 mg, 150 mg) |
| **pack** | blueprint | Apresentação (30 cápsulas, 60 cápsulas) |
| **formKey** | blueprint | Forma (cápsulas, solução, creme) |
| **objective** | blueprint | Categoria (Ansiedade, Emagrecimento, Sono) |
| **niche** | blueprint | Subcategoria (Ansiedade e Estresse, Emagrecimento) |

**Regra:** Nenhuma copy pode ser genérica. "Fórmula manipulada" sozinho não basta. Sempre: ativo + dose + benefício específico.

---

## 5. Workflow de Criação de Copy Individualizada

### 5.1. Template por Objetivo (Estrutura, não Conteúdo)

Cada objetivo tem uma **estrutura** de benefícios típicos:

| Objetivo | Benefícios típicos (adaptar ao ativo) |
|----------|--------------------------------------|
| Ansiedade & Humor | Equilíbrio emocional, redução do estresse, suporte ao sono, foco, serotonina/cortisol |
| Emagrecimento & Metabolismo | Saciedade, termogênico, metabolismo, controle do apetite, microbiota |
| Sono | Qualidade do sono, relaxamento, indução ao sono, ciclos circadianos |
| Cabelo | Saúde capilar, crescimento, nutrição do folículo |
| Intestino | Microbiota, digestão, regularidade |

### 5.2. Processo por Produto (5 passos)

1. **Coletar dados** — sku, productName, primaryActive, dose, pack, objective, niche
2. **Pesquisar mecanismo** — Como o ativo age? (serotonina, GLP-1, melatonina, etc.)
3. **Escrever copy** — Seguir padrão Akkermat: 6 benefícios (título + desc com mecanismo), whatIsIt, scienceSummary, whatMakesDifferent
4. **Revisar compliance** — "pode", "auxiliar", "apoiar". Evitar promessas absolutas.
5. **Inserir no blueprint** — Atualizar copy-blueprint-v4.csv

### 5.3. Ferramentas Sugeridas

- **IA generativa** — Para rascunho inicial a partir de (ativo, dose, objetivo). Revisão humana obrigatória.
- **Planilha de controle** — Status por SKU: rascunho | revisão | aprovado | publicado
- **Validação em lote** — Script que verifica se para_que_serve tem 6 pares, FAQ tem 5 pares, etc.

---

## 6. Estratégia de Rollout em Fases (Lançamento Inteligente)

### Fase 0 — Pré-lançamento (Semana 1)
- [ ] Akkermat validado e intocável (já feito)
- [ ] Build e lint passando
- [ ] Checklist de lançamento criado

### Fase 1 — Produtos Âncora (Semana 2) — 15–20 produtos
Produtos com maior potencial de conversão e tráfego. Copy Akkermat-quality.

**Critérios de prioridade:**
1. Produtos já com boa base no blueprint (ex: 5-HTP 100 mg, Ashwagandha 500 mg)
2. Um produto por objetivo (representatividade)
3. Produtos com imagens no DB

**Lista sugerida (exemplos):**
- Ansiedade: 5-HTP 100 mg, Ashwagandha 500 mg, L-Teanina 200 mg
- Emagrecimento: Akkermat (já feito), Cactin 500 mg
- Sono: Melatonina, Passiflora 200 mg
- Cabelo: Minoxidil 5%
- Intestino: Probióticos (se houver)

### Fase 2 — Expansão por Objetivo (Semanas 3–5)
- [ ] Completar Ansiedade & Humor (todos os SKUs)
- [ ] Completar Emagrecimento & Metabolismo
- [ ] Completar Sono
- [ ] Validar cada PDP visualmente

### Fase 3 — Catálogo Completo (Semanas 6–8)
- [ ] Demais objetivos: Cabelo, Intestino, Imunidade, Hormonal, etc.
- [ ] Produtos com copy mais simples recebem upgrade gradual

### Fase 4 — Lançamento e Campanhas (Semana 9+)
- [ ] Todos os produtos com copy mínima aceitável (3+ benefícios, whatIsIt, FAQ)
- [ ] Imagens: mínimo 1 por produto (fallback metaboslim.svg para os sem imagem)
- [ ] SEO: meta title, description, h1 por produto
- [ ] Schema Product preenchido
- [ ] Campanhas Google Ads / Meta: landing pages = PDPs

---

## 7. Checklist de Lançamento (Por Produto)

Antes de considerar um produto "pronto para venda":

### Copy
- [ ] hero_benefit preenchido e específico
- [ ] mechanism_summary ≤ 180 caracteres
- [ ] para_que_serve com 4–6 benefícios (título | desc)
- [ ] description_md ou whatIsIt com "O que é"
- [ ] science_summary com "Como funciona"
- [ ] what_makes_this_formula_different
- [ ] best_fit_profile
- [ ] how_to_use_bullets (2–4 itens)
- [ ] faq (mín. 3 pares Q|A)
- [ ] advertencias_completo

### Dados Técnicos
- [ ] images: 1+ URL no DB (ou fallback aceitável)
- [ ] activeIngredients no formato parseável
- [ ] priceCents e compareAtCents (quando aplicável)
- [ ] slug correto e único

### SEO e Conversão
- [ ] seo_h1 ou name como título
- [ ] seoTitle e seoDescription
- [ ] TrustBar visível (4 cards)
- [ ] Sticky CTA funcionando
- [ ] Mobile responsivo

---

## 8. Diferenciação vs Concorrentes

| Aspecto | Concorrentes típicos | MeJoy (nosso padrão) |
|---------|----------------------|------------------------|
| Benefícios | 3 genéricos | 6 com mecanismo + benefício |
| O que é | 1 frase | Parágrafo completo com ativo, dose, benefícios |
| Como funciona | Ausente ou vago | Mecanismo científico (hormônios, vias) |
| Diferencial | Genérico | Tecnologia, dose, biodisponibilidade |
| FAQ | 2–3 perguntas | 5 perguntas cobrindo dúvidas reais |
| Layout | Básico | Premium, TrustBar, sticky CTA, grid responsivo |

---

## 9. Formato do Blueprint v4 (Referência Rápida)

**para_que_serve:** `Benefício 1 | Descrição com mecanismo. | Benefício 2 | Descrição. | ...` (máx. 6 pares)

**how_to_use_bullets:** `- Tomar 1 cápsula ao dia. | - Apresentação: 60 cápsulas. | - Siga orientação profissional.`

**faq:** `O que é X? | Resposta. | Como usar X? | Resposta. | X tem contraindicações? | Resposta. | ...`

---

## 10. Proteção do Akkermat e Regras de Código

- **Não alterar** `[slug].tsx`, `copy-v2.ts`, componentes — layout e lógica compartilhados
- **Akkermat** sempre usa PDP_MASTER_FULL_OVERRIDES — nunca blueprint
- **Fallbacks** garantem que produtos incompletos não quebrem a página

### Scripts de freeze e validação (2026-03-07)

| Script | Uso |
|--------|-----|
| `pnpm run freeze:akkermat` | Gera snapshot em `scripts/generated/akkermat-freeze-snapshot.json` |
| `pnpm run validate:akkermat` | Valida regressão. Rodar antes de merge/deploy. |
| `pnpm run copy:ai-dry-run` | Dry-run IA: 5 SKUs → preview JSON (não aplica ao blueprint) |
| `pnpm run launch:gate` | Gate do lote âncora. `--soft` permite REVISAR. |

Ver `docs/AKKERMAT-FREEZE-REFERENCE.md` e `docs/RELATORIO-EXECUCAO-PLANO-REPLICACAO.md`.

---

## 11. Resumo Executivo

1. **Todos com a mesma estrutura** — Os 162 produtos usam a mesma PDP validada em `localhost:3000/p/akkermat-150-mg-30-capsulas`. Uma única página, um único layout. Nenhum produto tem estrutura diferente.
2. **Sim, conseguimos** — A estrutura está pronta. O trabalho é preencher o blueprint com copy individualizada para que todas as seções apareçam.
3. **Cada produto é único** — Ativo, dose, pack e objetivo definem a copy. Nada genérico.
4. **Padrão Akkermat** — 6 benefícios, mecanismo científico, gatilhos, compliance. Replicar a qualidade, não o texto.
5. **Lançamento em fases** — 15–20 produtos âncora primeiro, depois expansão por objetivo até os 162.
6. **Pronto para campanhas** — Quando checklist de lançamento estiver verde, PDPs viram landing pages para ads.

**Próximo passo imediato:** Selecionar os 15–20 produtos âncora e criar copy individualizada para cada um no padrão Akkermat. Em paralelo, validar que o Akkermat permanece intocável após qualquer alteração no blueprint.
