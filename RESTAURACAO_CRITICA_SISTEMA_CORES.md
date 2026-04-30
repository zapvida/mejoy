# 🚨 RESTAURAÇÃO CRÍTICA: Sistema de Cores

**Status:** ⚠️ **CÓDIGO CRÍTICO PERDIDO**

---

## ✅ **O QUE ESTÁ INTACTO**

1. ✅ `src/lib/theme/brand.ts` - Funções `deriveBrand()`, `applyBrandVars()`, `CURATED_PALETTES`
2. ✅ `src/lib/stripe/provision.ts` - Normalização de cores ao criar tenant
3. ✅ `src/components/b2b/wizard/StepColors.tsx` - Wizard usa `deriveBrand()`
4. ✅ `src/components/b2b/PreviewFrame.tsx` - Preview usa `deriveBrand()`
5. ✅ `src/components/b2b/B2BLanding.tsx` - Componentes LPAC intactos

---

## ❌ **O QUE FOI PERDIDO**

### **1. APLICAÇÃO DE CORES POR TENANT (`_app.tsx`)**
**CRÍTICO:** O código que aplica cores do tenant no carregamento foi removido!

**Antes (o que tínhamos):**
```typescript
useEffect(() => {
  const applyTenantColors = async () => {
    try {
      const t = detectTenantByHost(window.location.hostname);
      setVars(toCssVars(t));
      
      if (t.brand?.primary) {
        const brandSeed = (t.brand.primary as Hex) || '#10b981';
        const base = deriveBrand(brandSeed);
        applyBrandVars(
          base,
          t.brand.secondary as Hex | undefined
        );
        return;
      }
    } catch {}
    
    try {
      const res = await fetch('/api/tenant/info');
      if (res.ok) {
        const data = await res.json();
        if (data.primaryColor) {
          const brandSeed = (data.primaryColor as Hex) || '#10b981';
          const base = deriveBrand(brandSeed);
          applyBrandVars(
            base,
            data.secondaryColor as Hex | undefined
          );
        }
      }
    } catch {}
  };
  
  applyTenantColors();
}, []);
```

**Agora:** Removido completamente!

---

### **2. TOKENS CSS COMPLETOS (`theme.css`)**
**MODERADO:** Tokens simplificados, mas funcionalidades essenciais removidas:

**Removido:**
- `--brand-600`, `--brand-700`, `--accent-600`, `--accent-700` (agora só `--brand`, `--accent`)
- Utilitários: `.card-surface`, `.card-ghost`, `.btn-gradient-brand`, `.focus-ring`, `.chip-soft`
- Gradientes LPAC (6 variações)
- Dark mode tokens (`--ink`, `--ink-muted` no dark)
- Safe-area utilities (`.pb-safe`, `.sticky-bottom`)

**Mantido:**
- `--brand`, `--accent`, `--muted`, `--ink`, `--subtle`, `--ring`
- `.btn-brand`, `.btn-ghost`, `.badge-accent`

---

## 🔧 **CORREÇÕES NECESSÁRIAS**

### **1. RESTAURAR APLICAÇÃO DE CORES NO `_app.tsx`**

**Ação:** Adicionar `useEffect` que aplica cores do tenant usando `deriveBrand()` e `applyBrandVars()`

### **2. RESTAURAR TOKENS CSS COMPLETOS**

**Ação:** Adicionar de volta:
- `--brand-600`, `--brand-700`, `--accent-600`, `--accent-700`
- Utilitários LPAC (`.card-surface`, `.btn-gradient-brand`, etc.)
- Dark mode tokens completos
- Safe-area utilities

### **3. GARANTIR COMPATIBILIDADE**

**Ação:** Garantir que `applyBrandVars()` define `--brand-600` e `--brand-700` além de `--brand`

---

## 📊 **IMPACTO**

### **Sem correção:**
- ❌ Cores do tenant NÃO serão aplicadas automaticamente
- ❌ White-label não funcionará
- ❌ Sistema de cores personalizáveis quebrado

### **Com correção:**
- ✅ Cores aplicadas automaticamente por tenant
- ✅ White-label funcionando
- ✅ Sistema completo de cores restaurado

---

## ✅ **PRÓXIMOS PASSOS**

1. Restaurar `useEffect` em `_app.tsx` para aplicar cores do tenant
2. Restaurar tokens CSS completos em `theme.css`
3. Testar aplicação de cores por tenant
4. Validar que tudo funciona

