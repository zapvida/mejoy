# 🔧 Mini-script GA4 para Validação

## Script para DevTools

Cole este script no Console do navegador na página do relatório:

```javascript
(function(){
  if (!window.__GA4_MONITOR__) {
    const events = [];
    const orig = window.gtag || function(){};
    window.gtag = function(){ 
      events.push({
        timestamp: new Date().toISOString(),
        args: Array.from(arguments)
      }); 
      return orig.apply(this, arguments); 
    };
    window.__GA4_MONITOR__ = {
      dump(){ 
        const data = { 
          timestamp: new Date().toISOString(), 
          events,
          summary: {
            total_events: events.length,
            event_types: [...new Set(events.map(e => e.args[1]))]
          }
        }; 
        console.log("GA4_EVENTS", data); 
        return data; 
      },
      clear(){ 
        events.length = 0; 
        console.log("GA4_EVENTS cleared"); 
      },
      getEvents() {
        return events;
      }
    };
    console.log("🟢 GA4 monitor ON - Interaja com a página e rode window.__GA4_MONITOR__.dump()");
  } else {
    console.log("🟡 GA4 monitor already ON");
  }
})();
```

## Instruções de Uso

### 1. Ativar Monitor
- Cole o script acima no Console
- Confirme que aparece "🟢 GA4 monitor ON"

### 2. Interagir com a Página
- **Scroll** na página (gera `report_view`)
- **Clique no CTA** principal (gera `cta_click` com `cta_id` e `cta_variant`)
- **Clique "Imprimir"** (gera `report_print`)
- **Abra o chat** e envie uma mensagem (gera `chat_interaction`)

### 3. Capturar Eventos
- Rode: `window.__GA4_MONITOR__.dump()`
- Copie o JSON gerado
- Anexe como comentário no PR

## Eventos Esperados

### report_view
```json
{
  "args": ["event", "report_view", {
    "report_id": "demo-report-123",
    "triage_type": "gastro",
    "patient_age": 35,
    "cta_variant": "auto"
  }]
}
```

### cta_click
```json
{
  "args": ["event", "cta_click", {
    "cta_id": "cta_medical_immediate",
    "triage_type": "gastro",
    "cta_variant": "consulta",
    "report_id": "demo-report-123"
  }]
}
```

### report_print
```json
{
  "args": ["event", "report_print", {
    "report_id": "demo-report-123",
    "triage_type": "gastro",
    "page_title": "Relatório de Saúde - Alloe Health",
    "page_location": "https://alloehealth.com.br/relatorio/demo"
  }]
}
```

### chat_interaction
```json
{
  "args": ["event", "chat_interaction", {
    "interaction_type": "open",
    "triage_type": "gastro",
    "report_id": "demo-report-123",
    "page_title": "Relatório de Saúde - Alloe Health",
    "page_location": "https://alloehealth.com.br/relatorio/demo"
  }]
}
```

## URLs para Teste

### A/B Testing
- `https://alloehealth.com.br/relatorio/demo?cta=consulta`
- `https://alloehealth.com.br/relatorio/demo?cta=premium`
- `https://alloehealth.com.br/relatorio/demo?cta=whatsapp`

### Auto-print
- `https://alloehealth.com.br/relatorio/demo?print=true`

### Combinação
- `https://alloehealth.com.br/relatorio/demo?cta=consulta&print=true`

## Validação Final

### ✅ Checklist
- [ ] Script ativado no Console
- [ ] report_view capturado (scroll)
- [ ] cta_click capturado (clique CTA)
- [ ] report_print capturado (clique imprimir)
- [ ] chat_interaction capturado (abrir chat)
- [ ] JSON exportado com `window.__GA4_MONITOR__.dump()`
- [ ] Todos os parâmetros obrigatórios presentes
- [ ] cta_variant correto baseado no query param

### 🎯 Resultado Esperado
```json
{
  "timestamp": "2025-01-13T10:30:00.000Z",
  "events": [
    {
      "timestamp": "2025-01-13T10:30:01.000Z",
      "args": ["event", "report_view", {...}]
    },
    {
      "timestamp": "2025-01-13T10:30:05.000Z", 
      "args": ["event", "cta_click", {...}]
    },
    {
      "timestamp": "2025-01-13T10:30:10.000Z",
      "args": ["event", "report_print", {...}]
    },
    {
      "timestamp": "2025-01-13T10:30:15.000Z",
      "args": ["event", "chat_interaction", {...}]
    }
  ],
  "summary": {
    "total_events": 4,
    "event_types": ["report_view", "cta_click", "report_print", "chat_interaction"]
  }
}
```

**Status**: Pronto para validação em produção! 🚀
