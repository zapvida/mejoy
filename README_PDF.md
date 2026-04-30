# README_PDF.md
# Documentação do Sistema de PDF Unificado

## Visão Geral

O sistema de PDF unificado do AlloeHealth foi redesenhado para fornecer relatórios médicos profissionais, consistentes e confiáveis. Este documento descreve a arquitetura, uso e troubleshooting do novo sistema.

## Arquitetura

### Endpoint Canônico
- **URL**: `/api/pdf/report`
- **Métodos**: GET, POST
- **Parâmetros**:
  - `id`: ID do relatório (opcional)
  - `demo=1`: Modo demo (opcional)
  - `lang=pt|en`: Idioma (opcional, padrão: pt)

### Adapters de Compatibilidade
Todos os endpoints antigos redirecionam para o endpoint canônico:
- `/api/pdf/[id]` → `/api/pdf/report?id={id}`
- `/api/pdf/demo` → `/api/pdf/report?demo=1`
- `/api/pdf/optimized` → `/api/pdf/report?demo=1`
- `/api/pdf/demo-gastro` → `/api/pdf/report?demo=1`
- `/api/pdf/demo-geral` → `/api/pdf/report?demo=1`

### Componente Único
- **Arquivo**: `src/components/pdf/ReportPDF.tsx`
- **Layout**: Padrão laboratório médico
- **Compatibilidade**: Re-export em `ReportPDFv2.tsx`

## Uso

### Geração de PDF via API

```bash
# PDF demo
curl "https://alloehealth.com.br/api/pdf/report?demo=1"

# PDF por ID
curl "https://alloehealth.com.br/api/pdf/report?id=ABC123"

# PDF com idioma específico
curl "https://alloehealth.com.br/api/pdf/report?id=ABC123&lang=en"
```

### Geração de PDF via UI

```typescript
// No componente ReportActionBar
<ReportActionBar
  reportId="ABC123"
  pdfEndpoint="/api/pdf/report" // Padrão
  onPdf={() => trackPDFDownload(reportId)}
/>
```

### Programática

```typescript
import { buildMedicalReportPayload } from '@/lib/pdf/buildPayload';
import ReportPDF from '@/components/pdf/ReportPDF';

// Construir dados
const payload = await buildMedicalReportPayload({
  id: 'ABC123',
  demo: false
});

// Renderizar PDF
const doc = <ReportPDF data={payload} options={{
  includeProfessionalNotes: false,
  includeQRCode: true,
  language: 'pt'
}} />;
```

## Estrutura de Dados

### MedicalReportData

```typescript
interface MedicalReportData {
  patient: {
    name: string;
    age?: string;
    sex?: string;
    bmi?: string;
    email?: string;
    id?: string;
  };
  metadata: {
    id: string;
    type: string;
    date: string;
    time: string;
    version: string;
    qrCode?: string;
  };
  scores: {
    current?: number;
    potential?: number;
    classification?: {
      level: 'leve' | 'moderado' | 'grave';
      label: string;
      description?: string;
    };
  };
  summary?: string;
  keyPoints: Array<{ text: string; priority: 'high' | 'medium' | 'low' }>;
  redFlags: Array<{ text: string; severity: 'high' | 'medium' | 'low'; action?: string }>;
  findings: Array<{ category: string; item: string; status: string; intensity?: string; observation?: string }>;
  roadmap: {
    immediate: Array<{ text: string; timeframe: string; priority: string; category: string }>;
    shortTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
    mediumTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
    longTerm: Array<{ text: string; timeframe: string; priority: string; category: string }>;
  };
  professionalNotes?: {
    rationale?: string;
    references?: string[];
    considerations?: string;
  };
  nextSteps?: string[];
  legalNotice?: string;
}
```

## Layout do PDF

### Seções

1. **Cabeçalho**
   - Logo AlloeHealth
   - Título do relatório
   - Dados do paciente
   - QR Code (opcional)

2. **Resultados da Avaliação**
   - Score atual com interpretação
   - Score potencial
   - Classificação (leve/moderado/grave)

3. **Resumo Clínico**
   - Análise personalizada

4. **Pontos-Chave**
   - 3-5 pontos principais
   - Priorizados por importância

5. **Sinais de Alerta**
   - Alertas médicos destacados
   - Ações recomendadas

6. **Achados Clínicos**
   - Tabela estruturada
   - Categoria, achado, status, observação

7. **Plano de Ação**
   - Imediato (0-7 dias)
   - Curto prazo (1-4 semanas)
   - Médio prazo (1-3 meses)
   - Longo prazo (3+ meses)

8. **Notas para o Profissional** (opcional)
   - Racional clínico
   - Referências
   - Considerações

9. **Próximos Passos**
   - Ações recomendadas
   - CTAs discretos

10. **Rodapé**
    - Aviso legal
    - Informações da empresa

## QA e Testes

### Testes Automatizados

```bash
# Smoke test
pnpm qa:pdf:unified

# Teste E2E
pnpm test:e2e --grep="PDF Unified"

# Teste completo
pnpm test:all
```

### Testes Manuais

```bash
# Teste local
curl -I "http://localhost:3000/api/pdf/report?demo=1"

# Teste produção
curl -I "https://alloehealth.com.br/api/pdf/report?demo=1"

# Verificar logs
# Vercel → Logs → Last 30 minutes
```

### Critérios de Aceite

- ✅ Status 200 OK
- ✅ Content-Type: application/pdf
- ✅ Tamanho > 80KB
- ✅ PDF válido (começa com %PDF)
- ✅ Contém texto esperado
- ✅ Layout profissional
- ✅ Sem páginas em branco

## Troubleshooting

### Problemas Comuns

#### PDF em branco
**Causa**: Dados inválidos ou faltando
**Solução**: 
- Verificar logs do servidor
- Testar com `?demo=1`
- Verificar estrutura de dados

#### Erro 500
**Causa**: Erro interno do servidor
**Solução**:
- Verificar logs da Vercel
- Testar fallback automático
- Verificar dependências

#### Rate Limit (429)
**Causa**: Muitas requisições
**Solução**:
- Aguardar 1 minuto
- Implementar retry com backoff
- Verificar implementação de cache

#### PDF não abre
**Causa**: PDF corrompido ou inválido
**Solução**:
- Verificar Content-Type
- Testar em diferentes navegadores
- Verificar tamanho do arquivo

### Logs e Monitoramento

```bash
# Verificar logs da Vercel
vercel logs --follow

# Verificar métricas
# GA4 → Events → pdf_generated

# Verificar performance
# Vercel → Functions → /api/pdf/report
```

### Debug

```typescript
// Habilitar logs detalhados
console.log('[PDF] Payload:', payload);
console.log('[PDF] Options:', options);
console.log('[PDF] Duration:', durationMs);
```

## Performance

### Otimizações

- **Fontes locais**: Inter embutida (base64)
- **Streaming**: renderToStream para resposta rápida
- **Cache**: Headers apropriados
- **Rate limiting**: Proteção contra abuso
- **Fallback**: Sempre retorna PDF válido

### Métricas Esperadas

- **Tamanho**: 120-400KB
- **Tempo**: < 800ms
- **Taxa de sucesso**: > 99%
- **Uptime**: > 99.9%

## Segurança

### Validação

- **Zod schemas**: Validação de entrada
- **Sanitização**: Limpeza de texto
- **Rate limiting**: Proteção contra abuso
- **Headers**: Cache-Control apropriado

### Privacidade

- **LGPD**: Cache-Control: private, no-store
- **Dados sensíveis**: Não logados
- **Anonimização**: IDs não expostos

## Deploy

### Checklist de Deploy

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Smoke test OK
- [ ] Logs limpos
- [ ] Métricas normais

### Rollback

```bash
# Rollback rápido
vercel rollback

# Verificar adapters
# Todos redirecionam para endpoint canônico
```

## Evolução

### Próximas Melhorias

- [ ] Suporte a múltiplos idiomas
- [ ] Templates específicos por triagem
- [ ] Assinatura digital
- [ ] Compressão avançada
- [ ] Cache inteligente

### Compatibilidade

- **Backward**: Todos os endpoints antigos funcionam
- **Forward**: Estrutura extensível
- **Breaking changes**: Nenhum planejado

## Suporte

### Contatos

- **Desenvolvimento**: Equipe técnica
- **Produto**: Product Manager
- **Médico**: Equipe médica

### Recursos

- **Documentação**: Este arquivo
- **Código**: `/src/lib/pdf/`
- **Testes**: `/tests/e2e/pdf-unified.spec.ts`
- **Scripts**: `/scripts/qa/pdf.unified.smoke.ts`

---

**Versão**: 2.0.0  
**Última atualização**: Janeiro 2025  
**Status**: Produção ✅
