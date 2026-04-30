# 🧪 Smoke Test Manual — Programa de Emagrecimento

> **Tempo estimado:** ~10 minutos  
> **Onde executar:** Produção (`https://www.mejoy.com.br`)  
> **Quando:** Antes de qualquer tráfego pago ou divulgação forte

---

## Pré-requisito

- Navegador (Chrome/Safari recomendado)
- Testar em **mobile** (ou DevTools em modo mobile) para validar UX
- CEP de teste para Navegantes: `88370-000` (dentro da whitelist)
- CEP de teste fora: `01310-100` (São Paulo) ou qualquer outro fora de 88370

---

## CENÁRIO 1 — Dentro da whitelist (fluxo completo)

**Objetivo:** Validar que o usuário em Navegantes consegue completar a venda.

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1 | Abrir `https://www.mejoy.com.br/emagrecimento` | LP carrega, hero com "Programa de Acompanhamento de Emagrecimento" |
| 2 | Clicar no CTA principal | Redireciona para `/triagem/emagrecimento` |
| 3 | Completar a triagem (consentimento, dados, perguntas) | Formulário avança sem travar |
| 4 | Finalizar triagem | Relatório é gerado (pode levar alguns segundos) |
| 5 | Verificar relatório | Título "Relatório de Emagrecimento", análise personalizada, CTAs visíveis |
| 6 | Clicar "Iniciar meu programa" (ou "Iniciar com este plano") | Redireciona para `/emagrecimento/checkout?reportId=...` |
| 7 | **Step 1:** Preencher nome, email, WhatsApp, CPF | Botão "Continuar" habilita ao preencher |
| 8 | Clicar "Continuar" | Avança para Step 2 (Endereço) |
| 9 | **Step 2:** Preencher CEP `88370-000` (ou similar Navegantes) | ViaCEP preenche cidade/estado |
| 10 | Clicar "Continuar" | Avança para Step 3 (Planos) — **não** mostra lista de espera |
| 11 | Selecionar um plano e avançar | Step 4 (Pagamento) |
| 12 | Escolher PIX ou cartão e finalizar | QR Code PIX aparece OU redireciona para link de pagamento |
| 13 | Após pagamento (ou simulação) | Redireciona para `/emagrecimento/obrigado` |
| 14 | Verificar página obrigado | "Parabéns por iniciar seu programa!", próximos passos, CTA WhatsApp |
| 15 | Clicar "Falar no WhatsApp" | Abre WhatsApp com mensagem: "Olá! Acabei de finalizar minha adesão ao programa..." |

**Se todos os passos passarem:** ✅ Cenário 1 OK

---

## CENÁRIO 2 — Fora da whitelist (lista de espera)

**Pré-requisito:** `EMAGRECIMENTO_REGIONAL_ENABLED=true` na Vercel.  
Se estiver `false`, este cenário não se aplica (todos passam).

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1 | Repetir passos 1–9 do Cenário 1 | Até Step 2 preenchido |
| 2 | **Step 2:** Usar CEP fora de Navegantes (ex: `01310-100`) | ViaCEP preenche São Paulo |
| 3 | Clicar "Continuar" | **Não** avança para planos. Mostra bloco "Lista de espera" |
| 4 | Verificar copy | Mensagem neutra: "Estamos liberando o programa gradualmente", "Deixe seu contato para prioridade" |
| 5 | **Não** menciona cidade/região | Copy genérico, sem "Navegantes" ou nome de cidade |
| 6 | Preencher formulário lista de espera (nome, email, WhatsApp) | Campos pré-preenchidos com dados do Step 1 |
| 7 | Enviar | Mensagem "Você entrou na lista de espera!" |
| 8 | CTA WhatsApp | Abre WhatsApp com mensagem de interesse no programa |

**Se todos os passos passarem:** ✅ Cenário 2 OK

---

## CENÁRIO 3 — Regressão (nada quebrou)

**Objetivo:** Garantir que fluxos antigos e acessos diretos ainda funcionam.

| # | Ação | Resultado esperado |
|---|------|--------------------|
| 1 | Acessar `/emagrecimento/relatorio?id=qualquer-id-invalido` | Página "Relatório não encontrado" ou erro elegante, com link "Voltar para início" |
| 2 | Acessar `/emagrecimento/checkout` sem `reportId` | Checkout carrega (pode não ter plano recomendado, mas não quebra) |
| 3 | Acessar `/emagrecimento/checkout?reportId=xxx` (id de triagem real) | Checkout carrega, tenta buscar dados da triagem |
| 4 | Verificar CTAs na LP | Todos os CTAs apontam para `/triagem/emagrecimento` |
| 5 | Verificar sticky CTA mobile na LP | "Iniciar minha avaliação" visível no rodapé |
| 6 | Verificar relatório → checkout | Links com `reportId` correto na URL |

**Se todos os passos passarem:** ✅ Cenário 3 OK

---

## CHECKLIST RÁPIDO (copy-paste)

```
CENÁRIO 1 — Whitelist
[ ] LP abre
[ ] CTA → triagem
[ ] Triagem completa
[ ] Relatório gerado
[ ] CTA "Iniciar meu programa" → checkout
[ ] Step 1 avança (botão habilita)
[ ] Step 2 com CEP 88370 → planos
[ ] Pagamento (PIX/cartão)
[ ] Obrigado + WhatsApp

CENÁRIO 2 — Fora whitelist (se regional ativa)
[ ] Step 2 com CEP fora → lista de espera
[ ] Formulário envia
[ ] Mensagem sucesso
[ ] WhatsApp abre

CENÁRIO 3 — Regressão
[ ] Relatório id inválido → erro elegante
[ ] Checkout sem reportId → carrega
[ ] CTAs corretos
```

---

## O QUE FAZER SE ALGO FALHAR

1. **Anotar** qual passo falhou e qual foi o comportamento observado
2. **Verificar** logs da Vercel (Runtime Logs, Function Logs)
3. **Verificar** env vars em produção
4. **Não** subir tráfego pago até corrigir

---

## APÓS OS 3 CENÁRIOS PASSAREM

✅ **GO para lançamento regional silencioso**

- Tráfego controlado
- Monitorar conversões
- WhatsApp pronto para atendimento
- Lista de espera funcionando para leads fora da região

---

**Última atualização:** 14/03/2025
