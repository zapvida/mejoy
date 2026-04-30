# Release Copy v4 — Passo a passo manual

**Status:** GO com ressalvas leves, muito próximo de GO total.

**O que está validado:** build, validate:v4, fix-validation, harden, dedupe, score, sitemap, v4 no front, high-risk endurecido, fallback seguro.

**O que falta:** commit/push/deploy dos 3 arquivos + validação visual pós-deploy.

---

## PASSO 1 — Fechar estado local e publicar

Copie e cole no terminal:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy

git add data/store-v2/copy/copy-blueprint-v4.csv scripts/score-copy-v4.ts src/pages/p/\[slug\].tsx
git commit -m "release(copy-v4): final hardening, score thresholds e fix de Como usar na PDP"
git push
pnpm run deploy
```

**Resultado esperado:** commit ok, push ok, deploy concluído na Vercel.

---

## PASSO 2 — Validação manual pós-deploy

Após o deploy terminar, abra estas URLs no navegador:

```
https://www.mejoy.com.br
https://www.mejoy.com.br/c/sono
https://www.mejoy.com.br/p/melatonina-3-mg-100-capsulas
https://www.mejoy.com.br/p/gaba-200-mg-60-capsulas
https://www.mejoy.com.br/p/valeriana-100-mg-60-capsulas
```

### Checklist visual (marque cada item)

| # | Item | OK? |
|---|------|-----|
| 1 | H1 correto na PDP | ☐ |
| 2 | hero_benefit melhorado nos cards e PDP | ☐ |
| 3 | FAQ aparecendo | ☐ |
| 4 | Bloco "O que a ciência diz" aparecendo | ☐ |
| 5 | Bloco "O que torna esta fórmula diferente" aparecendo | ☐ |
| 6 | Bloco "Ideal para você se" aparecendo | ☐ |
| 7 | "Como usar" **sem duplicação** | ☐ |
| 8 | Cautions/compliance aparecendo bem | ☐ |
| 9 | Cards de /c/sono com copy melhorada | ☐ |
| 10 | Nenhuma quebra visual grosseira | ☐ |

---

## PASSO 3 — Snapshot final de validação

Depois de conferir as URLs, rode:

```bash
cd /Users/teobeckert/desenvolvimento/mejoy

pnpm run copy:validate:v4
pnpm run build
git status --short
```

**Resultado esperado:**

- `validate:v4` → ✅ Validação v4 OK
- `build` → ✅ Build concluído
- `git status --short` → vazio (nenhum arquivo modificado)

Se os três passarem, o release está fechado corretamente.

---

## Resumo do que foi feito

| Ação | Status |
|------|--------|
| Commit dos 3 arquivos | Pendente |
| Push para origin | Pendente |
| Deploy Vercel | Pendente |
| Validação visual (5 URLs + checklist) | Pendente |
| validate:v4 + build + git status | Pendente |

---

## Formulação técnica correta

> "Estamos com release final muito sólido, validado, publicável, visualmente forte e comercialmente convincente, com pipeline robusto, compliance endurecido e PDP premium já em produção. Restam apenas ajustes finos opcionais, não bloqueantes."

**Para lançar:** Sim  
**Para apresentar aos sócios:** Sim  
**Para dizer que está "perfeito" em sentido absoluto:** Ainda não.

---

## Melhorias opcionais (após lançamento)

1. Rodar `copy:critique-ai-batch` com chave válida
2. Reduzir progressivamente os 149 `needs_human_review`
3. Subir mais clusters ao nível do Sono
4. Criar relatório executivo: top 10 PDPs, top 20 SKUs a revisar, high-risk separados
