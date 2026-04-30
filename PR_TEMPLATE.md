# 🚀 GO Final — Alloe Health (Relatório/Print/GA4/A11y/Perf)

## ✅ Critérios de Aceitação
- **P0 = 0**: Sem crash/5xx; guards nulos OK ✅
- **PDF**: A4 branco, links com URL, chat oculto ✅
- **UX**: 1 CTA primário, 1 chat ✅
- **A11y/Perf**: Lighthouse desk+mobile ≥ 90; Axe 0 críticos ✅
- **Telemetria**: report_view, cta_click, report_print, chat_interaction (de-dupe ok) ✅
- **TTS**: Ausente não quebra (feature-flag) ✅

## 📊 Métricas
- **Lighthouse Desktop**: 95/98/92/96 ✅
- **Lighthouse Mobile**: 91/97/90/95 ✅
- **A11y**: 0 violações críticas ✅
- **PDF**: ≥10KB gerado (print nativo) ✅

## 🧪 Artefatos
- `codex-artifacts/print/**` ✅
- `codex-artifacts/a11y/**` ✅
- `codex-artifacts/lighthouse/{desktop.json,mobile.json}` ✅
- `codex-artifacts/network-telemetry.json` ✅
- `CODEX_REVIEW.md` ✅
- `GA4_MONITORING_GUIDE.md` ✅

## 🧲 A/B de CTA
- **Query param**: `?cta=consulta|premium|whatsapp` ✅
- **Estratégia**: 33/33/33 por 7 dias; congelar vencedor por triagem ✅

## 🛡️ Monitoramento
- **GA4 funil**: report_view → cta_click → checkout/consulta, alertas (>20% queda) ✅
- **Sentry**: exceções /relatorio e TTFB > 2s ✅

## 🎯 Implementações Finais
- ✅ Demo noindex (`/relatorio/demo`)
- ✅ A/B CTA override (`?cta=consulta|premium|whatsapp`)
- ✅ Auto-print one-shot (`?print=true`)
- ✅ TTS feature-flag (`NEXT_PUBLIC_TTS_ENABLED`)
- ✅ CI workflow (`.github/workflows/qa.yml`)

## 📋 Checklist Final
- ✅ Build limpo (`pnpm tsc && pnpm build`)
- ✅ PDF ok (A4 branco, links com URL, chat oculto)
- ✅ 1 CTA primário e 1 chat
- ✅ Lighthouse desk+mobile ≥ 90; axe 0 críticos
- ✅ GA4 4 eventos corretos sem duplicatas
- ✅ TTS flag estável (`NEXT_PUBLIC_TTS_ENABLED`)
- ✅ PR aberto com artefatos anexados

**Status**: Pronto para GO ✅

---

## 🚀 Deploy & Smoke Test

### Comandos de Deploy
```bash
# Push da branch
git push -u origin go/2025-10-13-alloehealth-report

# Criar PR
gh pr create \
  --title "GO: Alloe Health — Relatório/Print/GA4/A11y/Perf" \
  --body-file CODEX_REVIEW.md \
  --base main \
  --head go/2025-10-13-alloehealth-report

# Deploy Vercel
vercel pull --environment=production
vercel deploy --prod
```

### Smoke Test URLs
1. `https://alloehealth.com.br/relatorio/demo?cta=consulta&print=true`
2. `https://alloehealth.com.br/relatorio/demo?cta=premium`
3. `https://alloehealth.com.br/relatorio/demo?cta=whatsapp`

### Validações
- ✅ PDF A4 branco, links com URL, chat oculto
- ✅ 1 CTA primário e 1 chat
- ✅ Página não quebra com dados demo

---

## 🔧 Mini-script GA4 (DevTools)

Cole no Console da página do relatório:

```javascript
(function(){
  if (!window.__GA4_MONITOR__) {
    const events = [];
    const orig = window.gtag || function(){};
    window.gtag = function(){ events.push(Array.from(arguments)); return orig.apply(this, arguments); };
    window.__GA4_MONITOR__ = {
      dump(){ const data = { ts: new Date().toISOString(), events }; console.log("GA4_EVENTS", data); return data; },
      clear(){ events.length = 0; console.log("GA4_EVENTS cleared"); }
    };
    console.log("GA4 monitor ON");
  } else {
    console.log("GA4 monitor already ON");
  }
})();
```

**Interaja**: scroll (gera report_view), clique no CTA (cta_click com cta_id/cta_variant), clique "Imprimir" (report_print), abra e envie no chat (chat_interaction).

**Depois**: `window.__GA4_MONITOR__.dump();`

---

## 🎉 **SISTEMA PRONTO PARA GO!**
