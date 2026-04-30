# 🚀 README_FLAGS.md - Feature Flags Alloe Health

## 📋 Lista das Flags e Efeitos

| Flag | Efeito | Arquivo Principal |
|------|--------|-------------------|
| `NEXT_PUBLIC_COPY_OVERHAUL=1` | Substitui "GI" por "gastrointestinal" em textos de UI | `src/lib/i18n.ts` |
| `NEXT_PUBLIC_STICKY_CTA_GI=1` | CTA fixo na landing page para triagem gastrointestinal | `src/components/lpac/StickyCTA.tsx` |
| `NEXT_PUBLIC_REPORT_ENHANCED=1` | Adiciona pontos-chave e roadmap no relatório | `src/lib/report/deriveReport.ts` |
| `NEXT_PUBLIC_CTA_ORDER_DYNAMIC=1` | Ordem dinâmica de CTAs baseada em red flags | `src/features/triage/ctas.ts` |
| `PDF_V2=1` | PDF "estilo resultado de exame" com fallback para v1 | `src/components/pdf/ReportPDFv2.tsx` |

---

## 🔧 Passo a Passo Vercel

### **1. Acessar Painel do Vercel**
- Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecione o projeto `alloehealth`

### **2. Configurar Variáveis de Ambiente**

#### **Production Environment:**
```
NEXT_PUBLIC_COPY_OVERHAUL=1
NEXT_PUBLIC_STICKY_CTA_GI=1
NEXT_PUBLIC_REPORT_ENHANCED=1
NEXT_PUBLIC_CTA_ORDER_DYNAMIC=1
PDF_V2=1
```

#### **Preview Environment:**
```
NEXT_PUBLIC_COPY_OVERHAUL=1
NEXT_PUBLIC_STICKY_CTA_GI=1
NEXT_PUBLIC_REPORT_ENHANCED=1
NEXT_PUBLIC_CTA_ORDER_DYNAMIC=1
PDF_V2=1
```

### **3. Adicionar no Vercel**
1. **Settings** → **Environment Variables**
2. **Add New** para cada flag
3. **Name**: `NEXT_PUBLIC_COPY_OVERHAUL`
4. **Value**: `1`
5. **Environment**: ✅ Production ✅ Preview
6. **Repeat** para todas as flags

### **4. Redeploy**
- **Deployments** → **Redeploy** (último deployment)
- Aguardar build completo (~2-3 minutos)

---

## 🧪 Roteiro de QA Manual (5 Passos)

### **Passo 1: Triagem sem Red Flag**
1. Acesse `/triagem/gastro`
2. Complete a triagem com respostas "leves"
3. Verifique se CTAs mostram **Alloe primeiro**

### **Passo 2: Triagem com Red Flag**
1. Acesse `/triagem/gastro`
2. Complete com respostas indicando sintomas graves
3. Verifique se CTAs mostram **ZapVida primeiro**

### **Passo 3: PDF v2**
1. Gere 3 PDFs diferentes
2. Verifique se retorna **200 OK**
3. Tamanhos esperados: **~100-600 kB**
4. Se der erro, deve cair no PDF v1 automaticamente

### **Passo 4: Microcopy**
1. Verifique landing page: sem "GI" na UI
2. Verifique triagem: textos com "gastrointestinal" completo
3. Verifique relatório: linguagem clara

### **Passo 5: Analytics (se GA4 configurado)**
1. Abra **GA4 DebugView**
2. Complete uma triagem
3. Verifique eventos: `report_view_gastro`, `cta_click_brand`

---

## ⚡ Comandos Úteis

### **Ativar todas as flags localmente:**
```bash
pnpm flags:on
```

### **Testar PDFs:**
```bash
pnpm qa:pdf
```

### **Build e lint:**
```bash
pnpm lint && pnpm build
```

### **Desativar flags (rollback):**
```bash
# Editar .env.local
NEXT_PUBLIC_COPY_OVERHAUL=0
NEXT_PUBLIC_STICKY_CTA_GI=0
NEXT_PUBLIC_REPORT_ENHANCED=0
NEXT_PUBLIC_CTA_ORDER_DYNAMIC=0
PDF_V2=0
```

---

## 🚨 Rollback Instantâneo

**Em caso de problemas:**

1. **Vercel Dashboard** → **Environment Variables**
2. **Alterar todas as flags para `0`**
3. **Redeploy**
4. **Resultado**: Sistema volta ao estado anterior (100% funcional)

---

## 📊 Monitoramento

### **Métricas para Acompanhar:**
- **Conversão**: CTAs com ordem dinâmica
- **Engajamento**: Sticky CTA na landing
- **Qualidade**: PDF v2 vs v1
- **UX**: Feedback sobre microcopy

### **Logs para Verificar:**
- **PDF v2 fallback**: `console.warn('PDF v2 failed, falling back to v1')`
- **Analytics**: Eventos `report_view_gastro`, `cta_click_brand`
- **Performance**: Tempo de geração de PDF

---

## ✅ Checklist de Deploy

- [ ] Flags configuradas no Vercel
- [ ] Redeploy executado
- [ ] QA manual realizado
- [ ] PDFs gerando corretamente
- [ ] CTAs com ordem dinâmica
- [ ] Microcopy sem "GI"
- [ ] Analytics funcionando
- [ ] Rollback testado

---

## 🎯 Próximos Passos

1. **Deploy em Preview** com todas as flags ON
2. **QA completo** em ambiente de teste
3. **Deploy em Production** quando aprovado
4. **Monitorar métricas** por 24-48h
5. **Ajustar flags** conforme necessário

**Sistema pronto para produção!** 🚀
