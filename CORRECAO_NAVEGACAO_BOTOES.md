# 🔧 CORREÇÃO: Navegação dos Botões

## Problema Identificado

**Requisito:** 
- Logo ZapFarm → sempre volta para LPAC principal (`/` ou `zapfarm.com.br`)
- Botão "Voltar" → sempre volta para `/protocolos`

---

## Correções Aplicadas

### 1. **HeaderZapfarm.tsx** - Logo ZapFarm
```typescript
// Antes:
<a href="/emagrecimento" className="flex items-center gap-2.5 sm:gap-3">

// Depois:
<a href="/" className="flex items-center gap-2.5 sm:gap-3">
```

**Onde aparece:**
- Todas as LPACs (`/[product]`)
- Todos os relatórios (`/[product]/relatorio`)
- Todos os checkouts (`/[product]/checkout`)
- Página de emagrecimento (`/emagrecimento`)

**Resultado:** Logo sempre volta para home (`/`)

---

### 2. **Runner.tsx** - Botão "Voltar" (Header)
```typescript
// Antes:
onClick={() => window.location.href = brand === 'zapfarm' ? '/emagrecimento' : '/triagem'}

// Depois:
onClick={() => window.location.href = brand === 'zapfarm' ? '/protocolos' : '/triagem'}
```

**Onde aparece:**
- Durante a triagem (componente Runner)
- Header da triagem com botão "Voltar"

**Resultado:** Botão "Voltar" sempre vai para `/protocolos` quando brand é zapfarm

---

### 3. **Runner.tsx** - Botão "Voltar" (Tela de Loading)
```typescript
// Antes:
onClick={() => window.location.href = appendUtmsToUrl('/triagem')}

// Depois:
onClick={() => window.location.href = brand === 'zapfarm' ? '/protocolos' : appendUtmsToUrl('/triagem')}
title={brand === 'zapfarm' ? 'Voltar para protocolos' : 'Voltar às triagens'}
```

**Onde aparece:**
- Tela de loading da triagem
- Botão no canto superior esquerdo

**Resultado:** Botão "Voltar" sempre vai para `/protocolos` quando brand é zapfarm

---

## ✅ Validação

### **Logo ZapFarm**
- [x] Em LPACs → vai para `/`
- [x] Em relatórios → vai para `/`
- [x] Em checkouts → vai para `/`
- [x] Em obrigado → vai para `/`

### **Botão "Voltar"**
- [x] Durante triagem → vai para `/protocolos`
- [x] Tela de loading → vai para `/protocolos`
- [x] Header da triagem → vai para `/protocolos`

---

## 📋 Checklist de Navegação

| Componente | Antes | Depois | Status |
|------------|-------|--------|--------|
| Logo ZapFarm (HeaderZapfarm) | `/emagrecimento` | `/` | ✅ Corrigido |
| Botão "Voltar" (Runner header) | `/emagrecimento` | `/protocolos` | ✅ Corrigido |
| Botão "Voltar" (Loading screen) | `/triagem` | `/protocolos` | ✅ Corrigido |

---

## 🎯 Resultado Final

**✅ Logo ZapFarm:** Sempre volta para home (`/`)  
**✅ Botão "Voltar":** Sempre volta para `/protocolos`

**Navegação consistente em todo o fluxo!**

