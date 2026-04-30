# 🎯 ALINHAR TUDO COM aistoteleapp-art

**Objetivo:** Garantir que Git e Vercel estejam usando a mesma conta `aistoteleapp-art`.

---

## ✅ STATUS ATUAL

- ✅ **Git:** Configurado com `aistoteleapp-art`
- ❌ **Vercel CLI:** Logado como `aistoteleapp-5530` (precisa corrigir)

---

## 🚀 COMO ALINHAR

### Opção 1: Script Automático (RECOMENDADO)

```bash
pnpm force:vercel-account
```

Este script vai:
1. ✅ Verificar a conta atual
2. ✅ Fazer logout se necessário
3. ✅ Pedir para você fazer login com `aistoteleapp-art`
4. ✅ Verificar se está na conta correta
5. ✅ Linkar o projeto se necessário

### Opção 2: Manual

```bash
# 1. Fazer logout
vercel logout

# 2. Fazer login com a conta correta
vercel login
# Use a conta: aistoteleapp-art

# 3. Linkar projeto (se necessário)
vercel link
# Selecionar: aistotele-projects / aistotele

# 4. Validar
pnpm validate:accounts
```

---

## ✅ VALIDAÇÃO

Após corrigir, execute:

```bash
pnpm validate:accounts
```

**Resultado esperado:**
```
✅ Git user correto: aistoteleapp-art
✅ Git email correto: aistoteleapp-art@users.noreply.github.com
✅ Git remote correto: https://github.com/aistoteleapp-art/aistotele.git
✅ Vercel org correto: team_iLgcoSdlWT4PyqOMtgGwSdIN
✅ Vercel project correto: aistotele
✅ Logado no Vercel como: aistoteleapp-art (alinhado com Git)

✅ Todas as validações passaram!
```

---

## 🛡️ PROTEÇÕES ATIVAS

Agora que está configurado para exigir `aistoteleapp-art`:

1. ✅ **Script de validação** - Bloqueia se conta diferente
2. ✅ **Script de deploy seguro** - Não permite deploy com conta errada
3. ✅ **Git hook pre-push** - Bloqueia push com conta errada
4. ✅ **Configuração local Git** - Sempre usa `aistoteleapp-art`

---

## 🎯 DEPOIS DE ALINHAR

Após alinhar tudo com `aistoteleapp-art`, você pode:

### Deploy via GitHub (Recomendado)
```bash
git push origin main
# Deploy automático via Git integration
```

### Deploy via CLI
```bash
pnpm deploy:prod    # Produção
pnpm deploy:preview # Preview
```

Ambos agora vão validar que você está usando `aistoteleapp-art` antes de fazer deploy.

---

## 📋 CHECKLIST

- [ ] Executar `pnpm force:vercel-account`
- [ ] Fazer login com `aistoteleapp-art`
- [ ] Validar com `pnpm validate:accounts`
- [ ] Confirmar que tudo está ✅

---

**Status:** 🟡 **Aguardando correção da conta Vercel CLI**

