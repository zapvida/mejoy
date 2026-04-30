# ⚡ QUICK START - Configuração de Contas

## 🎯 Garantir que sempre use as contas corretas

### Antes de qualquer deploy ou push:

```bash
# Validar contas (Git + Vercel)
pnpm validate:accounts

# Ou direto:
bash scripts/validate-accounts.sh
```

### Para deploy seguro:

```bash
# Deploy para produção
pnpm deploy:prod

# Deploy para preview
pnpm deploy:preview
```

## ✅ O que está protegido:

1. **Git Hook Pre-Push** - Bloqueia push se usuário/email estiverem incorretos
2. **Configuração Local** - `.git/config` sempre usa `aistoteleapp-art`
3. **Script de Validação** - Valida e corrige automaticamente
4. **Script de Deploy Seguro** - Valida tudo antes de fazer deploy

## 📖 Documentação completa:

Veja `CONFIGURACAO_CONTAS_PERMANENTE.md` para detalhes completos.

