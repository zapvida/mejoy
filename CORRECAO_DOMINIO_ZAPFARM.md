# ✅ CORREÇÃO DEFINITIVA - DOMÍNIO zapfarm.com.br

**Data**: 2025-01-28  
**Status**: 🟢 **CORRIGIDO NO CÓDIGO**

---

## 🔍 PROBLEMA IDENTIFICADO

O domínio principal `zapfarm.com.br` estava sendo redirecionado para a página errada porque:

1. **Configuração padrão incorreta**: O código estava configurado para reconhecer apenas `zapfarm.com` (sem `.br`), mas o domínio real é `zapfarm.com.br` (com `.br`)
2. **Função `isRootB2BDomain` não reconhecia o domínio**: Por isso mostrava `B2CLanding` em vez de `B2BLanding`
3. **Domínios preview do Vercel funcionavam**: Porque a função tinha uma condição especial para `vercel.app`

---

## ✅ CORREÇÕES APLICADAS

### 1. **Atualizado `src/lib/flags.ts`**
```typescript
// ANTES:
export const ROOT_B2B_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_B2B_DOMAINS ?? 'zapfarm.com,www.zapfarm.com')

// DEPOIS:
export const ROOT_B2B_DOMAINS = (process.env.NEXT_PUBLIC_ROOT_B2B_DOMAINS ?? 'zapfarm.com.br,www.zapfarm.com.br,zapfarm.com,www.zapfarm.com')
```

### 2. **Atualizado `src/lib/host.ts`**
```typescript
// ANTES:
return h === 'zapfarm.com' || h === 'www.zapfarm.com';

// DEPOIS:
return h === 'zapfarm.com.br' || h === 'www.zapfarm.com.br' || h === 'zapfarm.com' || h === 'www.zapfarm.com';
```

### 3. **Atualizado `src/pages/api/stripe/create-checkout-session.ts`**
```typescript
// ANTES:
const ALLOWED_DOMAINS = [
  'localhost:3000',
  'localhost:3001', 
  'zapfarm.com',
  'www.zapfarm.com'
];

// DEPOIS:
const ALLOWED_DOMAINS = [
  'localhost:3000',
  'localhost:3001', 
  'zapfarm.com.br',
  'www.zapfarm.com.br',
  'zapfarm.com',
  'www.zapfarm.com'
];
```

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA NO VERCEL

**IMPORTANTE**: Você precisa configurar a variável de ambiente no Vercel para garantir que funcione corretamente:

### Variável de Ambiente no Vercel (Production)

1. Acesse: **Vercel Dashboard → Projeto → Settings → Environment Variables**
2. Procure por: `NEXT_PUBLIC_ROOT_B2B_DOMAINS`
3. **Configure como**:
   ```
   zapfarm.com.br,www.zapfarm.com.br,zapfarm.com,www.zapfarm.com
   ```

   **OU** se preferir manter apenas o `.br`:
   ```
   zapfarm.com.br,www.zapfarm.com.br
   ```

4. **Salve** e faça um **redeploy** (ou aguarde o próximo deploy automático)

---

## 🧪 VALIDAÇÃO

Após o deploy, valide:

### 1. Domínio Principal (deve mostrar página B2B)
```bash
curl -s https://zapfarm.com.br | grep -i "White-label de Triagens" && echo "✅ B2B OK"
```

### 2. Domínio com www (deve mostrar página B2B)
```bash
curl -s https://www.zapfarm.com.br | grep -i "White-label de Triagens" && echo "✅ B2B WWW OK"
```

### 3. Preview Vercel (deve continuar funcionando)
```bash
curl -s https://zapfarm-git-main-zapfarms-projects.vercel.app | grep -i "White-label de Triagens" && echo "✅ PREVIEW OK"
```

---

## 📋 CHECKLIST FINAL

- [x] ✅ Código atualizado para reconhecer `zapfarm.com.br`
- [x] ✅ Função `isRootB2BDomain` corrigida
- [x] ✅ Função `isZapFarmDomain` corrigida
- [x] ✅ Allowlist do Stripe atualizada
- [ ] ⚠️ **VOCÊ PRECISA**: Configurar `NEXT_PUBLIC_ROOT_B2B_DOMAINS` no Vercel
- [ ] ⚠️ **VOCÊ PRECISA**: Fazer redeploy ou aguardar próximo deploy automático

---

## 🚀 PRÓXIMOS PASSOS

1. **Commit e push** das alterações (se ainda não fez)
2. **Configurar ENV no Vercel** (conforme instruções acima)
3. **Aguardar deploy** ou fazer redeploy manual
4. **Validar** que `zapfarm.com.br` mostra a página B2B correta

---

## 📝 NOTAS TÉCNICAS

- A função `isRootB2BDomain` agora reconhece tanto `zapfarm.com.br` quanto `zapfarm.com` (para compatibilidade)
- Domínios preview do Vercel (`*.vercel.app`) continuam funcionando automaticamente
- O código mantém compatibilidade com ambos os domínios (com e sem `.br`)

---

**Status**: 🟢 **CÓDIGO CORRIGIDO - AGUARDANDO CONFIGURAÇÃO NO VERCEL**

