# Auditoria Final de Lançamento — MeJoy E-commerce

**Data:** 2025-03-06  
**Objetivo:** Validação visual, editorial e de conversão antes do lançamento oficial.

---

## 1. Revisão por Área (Código + Estrutura)

### Home
| Aspecto | Status | Observação |
|---------|--------|------------|
| Hero | ✅ | H1 claro, CTAs, bullets de confiança |
| TrustBar | ✅ | Entrega, manipulação, satisfação |
| Carrosséis | ✅ | Mais buscados, Mais vendidos, Novidades |
| Seções por objetivo | ✅ | Grid de produtos por categoria |
| Responsividade | ✅ | Mobile-first, breakpoints definidos |

**Fricções potenciais:**
- "Ver todos" em Mais vendidos/Novidades aponta para `/` — poderia apontar para `/c/[objetivo]` ou `/produtos`
- Ordem das seções: Mais buscados → Mais vendidos → Novidades — validar se é a mais conversiva

### Busca
| Aspecto | Status | Observação |
|---------|--------|------------|
| Input no header | ✅ | Visível, digitação direta (desktop) |
| Autocomplete | ✅ | Debounce 250ms, até 6 resultados |
| Busca por nome/tags/ingrediente/objetivo | ✅ | API expandida |
| Mobile | ⚠️ | Busca só no menu (link "Buscar produtos") — sem input inline no header mobile |

**Fricções potenciais:**
- No mobile, usuário precisa abrir menu para ir à busca — fricção extra
- HeaderSearch é `hidden md:block` — considerar input compacto no mobile

### Favoritos
| Aspecto | Status | Observação |
|---------|--------|------------|
| Coração em cards | ✅ | ProductCard com FavoriteButton |
| Coração na PDP | ✅ | FavoriteButton ao lado do H1 |
| Página /favoritos | ✅ | FavoritosClient com grid |
| Persistência localStorage | ✅ | useFavorites com mejoy_favorites |
| Contador no header | ✅ | Badge com quantidade |

**Fricções potenciais:**
- Nenhuma crítica identificada

### PDP
| Aspecto | Status | Observação |
|---------|--------|------------|
| Hero (H1, subtítulo, bullets) | ✅ | mechanism_summary, heroBullets |
| Preço + compareAt + badge %OFF | ✅ | Parcelamento visível |
| CTA | ✅ | Botão forte, acima da dobra |
| Galeria | ✅ | 5 imagens garantidas (repetição se necessário) |
| Frete | ✅ | PdpShippingCalculator |
| Sticky CTA desktop | ✅ | Preço + parcela + Add to cart |
| Sticky CTA mobile | ✅ | WhatsApp + preço + Add to cart |
| Benefícios estruturados | ✅ | Título + descrição |
| Ciência/diferencial | ✅ | copyV4Diferencial, copyV4Science |
| Para quem é | ✅ | copyV4BestFit |
| Como usar | ✅ | packSizeDisplay |
| Composição | ✅ | PdpCompositionTable |
| Advertências | ✅ | PdpWarnings com "Ver mais" |
| FAQ | ✅ | Accordion, fallback FAQ_GENERICO |

**Fricções potenciais:**
- Sticky mobile: WhatsApp em destaque verde — pode competir com "Adicionar ao carrinho"
- "Assinar e economizar" ao lado do CTA — botão secundário pode diluir foco

### Composição
| Aspecto | Status | Observação |
|---------|--------|------------|
| Tabela | ✅ | Ingrediente | Dose | Unidade |
| Parse | ✅ | Regex para mg, mcg, q.s.p. |
| Fallback | ✅ | Linha única se não parsear |

### Advertências
| Aspecto | Status | Observação |
|---------|--------|------------|
| Layout | ✅ | Bloco âmbar, ícone, lista |
| "Ver mais" | ✅ | Expandir quando > 5 itens |
| Conteúdo | ✅ | ANVISA + cautions + compliance |

---

## 2. Screenshots Comparativos

**Nota:** O Cursor Agent não consegue capturar screenshots. Para validação visual completa, execute:

```bash
pnpm dev
```

E capture manualmente:
- Home desktop e mobile
- Busca (header + autocomplete aberto)
- Favoritos (com e sem itens)
- PDP desktop (hero, galeria, sticky)
- PDP mobile (hero, sticky)
- Composição em tabela
- Advertências

Compare com: Oficialfarma, Drogasil Manipulação, Eficácia Farmácia.

---

## 3. Lista de Fricções Restantes

| # | Fricção | Severidade | Sugestão |
|---|---------|------------|----------|
| 1 | Busca mobile: só via menu | Média | Input compacto no header mobile |
| 2 | Sticky mobile: WhatsApp competindo com CTA | Baixa | Avaliar ordem ou hierarquia visual |
| 3 | "Ver todos" em carrosséis aponta para / | Baixa | Apontar para /produtos ou categoria |
| 4 | Galeria com imagens repetidas (MVP) | Aceitável | Substituir por fotos reais quando disponíveis |

---

## 4. Melhorias de Conversão Restantes

| # | Melhoria | Impacto esperado |
|---|----------|------------------|
| 1 | Social proof na PDP (avaliações, "X pessoas compraram") | Alto |
| 2 | Urgência/escassez sutil ("Últimas unidades") se aplicável | Médio |
| 3 | Garantia/Devolução mais visível no hero | Médio |
| 4 | Comparação "antes/depois" ou benefício em 1 frase no primeiro frame | Alto |
| 5 | A/B test: CTA "Comprar agora" vs "Adicionar ao carrinho" | Médio |

---

## 5. Avaliação Honesta por Área

| Área | Pronto? | Nota | Comentário |
|------|---------|------|------------|
| Home | Sim | 8,5/10 | Estrutura sólida; ordem das seções pode ser refinada com dados reais |
| Busca | Quase | 7,5/10 | Desktop excelente; mobile com fricção |
| Favoritos | Sim | 9/10 | Funcional e integrado |
| PDP | Sim | 8,5/10 | Estrutura completa; copy varia por SKU |
| Sticky CTA | Sim | 9/10 | Desktop e mobile presentes |
| Composição | Sim | 9/10 | Tabela clara e profissional |
| Advertências | Sim | 8,5/10 | Formatadas, não parede de texto |

---

## 6. PDP Master Template

**SKU escolhido:** MEJOY-0010 (L-Teanina 200 mg)

**Motivo:** Copy forte no blueprint v4, benefício claro ("Relaxamento eficaz sem sonolência"), mecanismo bem explicado.

**Refinamentos aplicados:**
- `hero_bullets` premium (5 itens com emojis)
- `mechanism_summary` refinado: "A L-Teanina é um aminoácido do chá verde que promove relaxamento sem sonolência, apoiando o foco e o equilíbrio emocional."

**Arquivo:** `src/lib/store-v2/copy-v2.ts` — `PDP_MASTER_SKU`, `PDP_MASTER_OVERRIDES`

---

## 7. Este Produto Pode Virar Template Mestre?

**Sim.** O PDP da L-Teanina 200 mg (MEJOY-0010) serve como template mestre porque:

1. **Estrutura replicável:** Hero → benefícios → preço → CTA → frete → conteúdo abaixo do fold
2. **Copy premium definida:** Bullets e mechanism_summary podem ser o padrão para outros SKUs
3. **Ordem validada:** Benefícios → Ciência → O que é → Para quem → Como usar → Composição → Advertências → FAQ
4. **Galeria:** 5 imagens (repetidas no MVP) — mesmo padrão para todos

**Como replicar:** Para cada novo SKU, preencher no blueprint v4 (ou override em copy-v2):
- `hero_benefit` / `shortBenefit`
- `mechanism_summary` (ou `science_summary`)
- `description_md` (para benefits_structured)
- `faq`, `cautions`
- `activeIngredients` no catálogo

---

## 8. Checklist de Validação Manual (Smoke Test)

Execute e marque:

- [ ] Home carrega sem erro
- [ ] Carrosséis exibem produtos
- [ ] Busca no header retorna resultados
- [ ] Autocomplete abre ao digitar
- [ ] Favoritos: adicionar/remover em card
- [ ] Favoritos: adicionar/remover na PDP
- [ ] Página /favoritos lista itens
- [ ] PDP carrega (ex: /p/l-teanina-200-mg-60-capsulas)
- [ ] Galeria mostra 5 thumbnails
- [ ] Frete: CEP válido retorna opções
- [ ] Sticky CTA desktop visível ao rolar
- [ ] Sticky CTA mobile visível
- [ ] Add to cart funciona
- [ ] Composição em tabela legível
- [ ] Advertências com "Ver mais"
- [ ] FAQ expande/colapsa

---

## 9. Conclusão

| Critério | Status |
|----------|--------|
| Estrutura pronta | ✅ |
| Copy pipeline escalável | ✅ |
| PDP master definido | ✅ |
| Galeria 5 imagens | ✅ |
| Fricções documentadas | ✅ |
| Melhorias sugeridas | ✅ |

**Prontidão para lançamento:** **Sim, com ressalvas.**

- Tecnicamente estável e completo.
- Validação visual depende de screenshots manuais.
- Recomenda-se smoke test manual antes de anunciar lançamento.
- Fricção da busca mobile pode ser endereçada em iteração pós-lançamento.
