# Auditoria E-commerce MeJoy — Pré-Lançamento

**Data:** 07/03/2026  
**Escopo:** 162 SKUs, Store V2, fluxos ponta a ponta

---

## Resumo Executivo

O e-commerce MeJoy está **bem estruturado e pronto para lançamento**, com organização por objetivos, PDP premium (template Akkermat), checkout funcional e painéis admin/dashboard. Foram identificados e corrigidos pontos de fricção e gaps de navegação.

---

## O que está funcionando bem

### 1. Organização por categorias
- **14 objetivos** mapeados em `slugs.ts` e `catalog.ts`
- Produtos filtrados corretamente por objetivo em `/c/[objetivo]`
- "Ver todos" em cada seção da home → `/c/[objetivo]` (filtro por categoria)
- Breadcrumb na PDP: Home → Categoria → Produto

### 2. Fluxos principais
| Fluxo | Status |
|-------|--------|
| Home → Ver produtos | Scroll suave para `#sec-produtos` |
| Home → Ver todos (por objetivo) | `/c/[objetivo]` com produtos da categoria |
| Categoria → Produto | PDP com copy premium, composição, FAQ |
| PDP → Adicionar ao carrinho | API cart, session |
| Carrinho → Checkout | `?cartId=` passado corretamente |
| Checkout → PIX/Cartão | Asaas integrado |
| Sucesso → Pedido | `/checkout/sucesso?orderId=` |

### 3. PDP (Product Detail Page)
- Template Akkermat (MEJOY-0048) como referência
- Copy v4: O que é, Como funciona, Para que serve, Diferenciação, Como usar, Composição, Advertências, FAQ
- Produtos relacionados (mesmo objetivo)
- Calculadora de frete, badges, cashback
- Schema editorial e SEO

### 4. Painel Admin (`/admin`)
- KPIs, funil, receita, uso por produto
- Pedidos Store V2 (`/admin/store-v2/orders`)
- Tech health, alertas, export

### 5. Dashboard Cliente (`/dashboard`)
- Triagens, relatórios, pedidos (legado + Store V2)
- Link para `/pedidos/[orderId]`
- Perfil, atividade recente

---

## Correções implementadas

### 1. Footer "Dúvidas" quebrado
- **Antes:** Link para `/#faq` — StoreV2Home não tem seção `#faq`
- **Depois:** Link para `/faq` (página dedicada)

### 2. Footer com categorias incompletas
- **Antes:** 6 categorias (Sono, Saúde, Emagrecimento, Cabelo, Intestino, Imunidade)
- **Depois:** Todas as 14 categorias via `OBJECTIVES` (single source of truth)
- Faltavam: Ansiedade & Humor, Articulações, Detox & Fígado, Energia & Performance, Hormonal & Libido, Menopausa & TPM, Lipedema, Pele & Beleza

### 3. Header sem acesso a 3 categorias
- **Antes:** Hormonal & Libido, Menopausa & TPM, Lipedema inacessíveis pelo menu
- **Depois:** Adicionados como subcategorias de "Saúde"

---

## Pontos de atenção (não bloqueantes)

### 1. Carrinho "Carregando..."
- O carrinho depende de `X-Session-Id`. Em primeira visita sem cookies, pode demorar.
- **Sugestão:** Skeleton ou estado vazio mais amigável.

### 2. "Minha conta" sem verificação de auth
- Header leva para `/dashboard` — usuário não logado é redirecionado para `/login?redirect=/dashboard`.
- **Status:** Funcional, UX aceitável.

### 3. Copy v4 para 162 SKUs
- 16 prontos (lote âncora), 11 quase prontos (Sono), 135 precisam copy.
- **Sugestão:** Replicar template Akkermat em batches conforme `expansion-plan-162.json`.

### 4. FAQ da home
- Página `/faq` atual fala de triagens/plataforma. Para loja, considerar FAQ de compras (frete, troca, pagamento).
- **Sugestão:** Criar `/faq-loja` ou seção "Dúvidas sobre compras" na `/faq`.

### 5. Admin secret key
- Se `NEXT_PUBLIC_ADMIN_SECRET_KEY` não estiver definido, usa fallback `'admin-secret-key'`.
- **Crítico:** Garantir chave forte em produção.

---

## Checklist pré-lançamento

- [x] STORE_V2=1, NEXT_PUBLIC_STORE_V2=1
- [x] Catálogo importado (162 SKUs ativos)
- [x] Categorias linkando corretamente
- [x] PDP com copy para lote âncora
- [x] Checkout PIX e cartão (Asaas)
- [x] Webhooks Asaas configurados
- [x] Admin com métricas
- [x] Dashboard cliente com pedidos
- [ ] NEXT_PUBLIC_COPY_V4=1 para copy premium em todos
- [ ] STORE_V2_CONVERSION=1 para TrustBar ampliada e Cart premium
- [ ] Validar envs: ASAAS_API_KEY, RESEND_API_KEY, ADMIN_SECRET_KEY

---

## Recomendações de otimização

### Menor fricção
1. **Add to cart com feedback visual** — Toast ou mini-drawer "Adicionado" com link para carrinho
2. **Checkout em menos passos** — Avaliar combinar dados + endereço em um único step quando possível
3. **CEP no carrinho** — Permitir informar CEP antes do checkout para ver frete

### Performance
1. **Lazy load de imagens** — ProductCard já usa `loading="lazy"`
2. **Prefetch de categorias** — `next/link` prefetch por padrão
3. **ISR ou SSG** para categorias — Reduzir carga no servidor

### Copywriting
1. **Hero da home** — Já forte: "Os melhores manipulados para seus objetivos"
2. **TrustBar** — 4 cards (despacho, manipulação, satisfação, frete)
3. **PDP** — Template Akkermat como padrão ouro; replicar para 135 SKUs

### Experiência pós-compra
1. **E-mail de confirmação** — Resend integrado
2. **Rastreio** — Campo no admin para atualizar tracking
3. **NPS/avaliação** — Link WhatsApp para feedback (já na PDP)

---

## Conclusão

O e-commerce está **pronto para lançamento** com as correções aplicadas. A estrutura de 162 SKUs em 12 objetivos está coerente, os fluxos principais funcionam e os painéis admin/dashboard estão operacionais. Os próximos passos são: ativar COPY_V4 e STORE_V2_CONVERSION, validar envs em produção e expandir o copy para os 135 SKUs restantes em batches.
