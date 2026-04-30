# Checklist: Relatório e Lançamento

## Validação pré-deploy

### 1. Fluxo triagem → relatório
- [ ] Finalizar triagem de produto MeJoy (ex: emagrecimento)
- [ ] Verificar redirect para `/{produto}/relatorio?id={triageId}`
- [ ] Página carrega sem erro
- [ ] Conteúdo do relatório exibido corretamente

### 2. Cache de relatório
- [ ] Relatórios com `status=completed` carregam do cache (sem deriveReport)
- [ ] Sem cache: fallback para deriveReport funciona

### 3. PDF
- [ ] Botão "Baixar relatório em PDF" abre PDF
- [ ] PDF contém dados corretos do paciente
- [ ] QR code na URL correta

### 4. CTAs e conversão
- [ ] Sticky CTA mobile visível e clicável
- [ ] Botão "Ver Produtos" leva ao checkout com reportId
- [ ] Focus states acessíveis (Tab, Enter)

### 5. Responsividade
- [ ] Mobile: sticky CTA não sobrepõe conteúdo
- [ ] Desktop: layout em grid correto
- [ ] Tablet: breakpoints funcionando

### 6. Variáveis de ambiente (produção)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `AI_REPORT_ENABLED=1` (opcional, para IA)
- [ ] `OPENAI_API_KEY` (se IA habilitada)

## Otimizações aplicadas
- Cache de `triage_reports.sections` quando completed
- Query única sessão + relatório
- Lazy-load de seções abaixo da dobra no ReportView
- PDF API corrigido (getVM com sessão + cache)
- CTAs com min tap target 48px e focus states
