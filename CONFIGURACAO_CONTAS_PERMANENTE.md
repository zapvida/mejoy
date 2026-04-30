# 🔐 CONFIGURAÇÃO PERMANENTE DE CONTAS - Aistotele

Este documento explica como garantir que as contas corretas do **Git** e **Vercel** sejam sempre usadas, mesmo quando você trocar de projeto na sua máquina.

---

## ✅ O QUE ESTÁ CONFIGURADO

### Git
- **Usuário**: `aistoteleapp-art`
- **Email**: `aistoteleapp-art@users.noreply.github.com`
- **Remote**: `https://github.com/aistoteleapp-art/aistotele.git`

### Vercel
- **Team**: `aistotele-projects` (orgId: `team_iLgcoSdlWT4PyqOMtgGwSdIN`)
- **Projeto**: `aistotele` (projectId: `prj_NYCR3pvGHIoTbNeSyzJHszUmXtfA`)

---

## 🛡️ PROTEÇÕES IMPLEMENTADAS

### 1. Configuração Local do Git (`.git/config`)

O Git já está configurado **localmente** neste repositório. Isso significa que mesmo se você mudar a configuração global do Git, este projeto sempre usará as contas corretas.

**Verificar configuração:**
```bash
git config user.name
git config user.email
git config remote.origin.url
```

**Se precisar corrigir:**
```bash
git config user.name "aistoteleapp-art"
git config user.email "aistoteleapp-art@users.noreply.github.com"
```

### 2. Hook Git Pre-Push

Foi criado um hook `pre-push` que **valida automaticamente** antes de cada push:
- ✅ Verifica se o usuário está correto
- ✅ Verifica se o email está correto
- ❌ Bloqueia o push se estiver incorreto

O hook está em: `.git/hooks/pre-push`

**Status:** ✅ **Ativo e funcionando**

### 3. Script de Validação

Script que valida e corrige automaticamente as configurações:
```bash
bash scripts/validate-accounts.sh
```

**O que ele faz:**
- ✅ Verifica configuração do Git (e corrige se necessário)
- ✅ Verifica configuração do Vercel
- ✅ Valida projeto linkado
- ✅ Mostra resumo com erros/avisos

### 4. Script de Deploy Seguro

Script que valida tudo antes de fazer deploy:
```bash
bash scripts/deploy-safe.sh --prod    # Produção
bash scripts/deploy-safe.sh --preview # Preview
```

**O que ele faz:**
1. ✅ Valida contas (Git + Vercel)
2. ✅ Verifica mudanças não commitadas
3. ✅ Verifica branch (produção só de `main`)
4. ✅ Verifica sincronização com remote
5. ✅ Executa deploy

---

## 🚀 COMO USAR

### Antes de Qualquer Deploy

Sempre execute o script de validação:
```bash
bash scripts/validate-accounts.sh
```

### Para Deploy Seguro

Use o script de deploy seguro:
```bash
# Deploy para produção
bash scripts/deploy-safe.sh --prod

# Deploy para preview
bash scripts/deploy-safe.sh --preview
```

### Para Deploy Manual (Com Validação)

Se preferir usar comandos diretos, **sempre valide primeiro**:
```bash
# 1. Validar
bash scripts/validate-accounts.sh

# 2. Deploy
vercel deploy --prod
```

---

## 🔧 TROUBLESHOOTING

### Problema: Git usando conta errada

**Sintoma:**
```
❌ Git user incorreto: teobeckert
```

**Solução:**
```bash
# Corrigir configuração local (apenas este projeto)
git config user.name "aistoteleapp-art"
git config user.email "aistoteleapp-art@users.noreply.github.com"

# Verificar
git config user.name
git config user.email
```

**Nota:** A configuração local tem prioridade sobre a global, então mesmo que você mude a global para outros projetos, este projeto sempre usará `aistoteleapp-art`.

### Problema: Vercel usando conta errada

**Sintoma:**
```
❌ Vercel org incorreto
```

**Solução:**
```bash
# 1. Verificar conta atual
vercel whoami

# 2. Se estiver na conta errada, fazer logout e login
vercel logout
vercel login

# 3. Linkar projeto novamente
vercel link

# 4. Selecionar:
#    - Team: aistotele-projects
#    - Project: aistotele
```

### Problema: Hook pre-push bloqueando push

**Sintoma:**
```
❌ ERRO: Git user incorreto!
```

**Solução:**
O hook está funcionando corretamente! Ele está te protegendo de fazer push com a conta errada.

Para corrigir:
```bash
git config user.name "aistoteleapp-art"
git config user.email "aistoteleapp-art@users.noreply.github.com"

# Tentar push novamente
git push
```

### Problema: Script não tem permissão de execução

**Sintoma:**
```
bash: scripts/validate-accounts.sh: Permission denied
```

**Solução:**
```bash
chmod +x scripts/validate-accounts.sh
chmod +x scripts/deploy-safe.sh
```

---

## 📋 CHECKLIST ANTES DE CADA DEPLOY

Antes de fazer qualquer deploy, certifique-se de:

- [ ] Executar `bash scripts/validate-accounts.sh` (deve passar sem erros)
- [ ] Verificar branch (produção só de `main`)
- [ ] Verificar se há mudanças não commitadas
- [ ] Verificar se está sincronizado com remote
- [ ] Usar `bash scripts/deploy-safe.sh --prod` ou validar manualmente

---

## 🎯 POR QUE ISSO É IMPORTANTE

1. **Evita commits com autor errado** - Todos os commits devem ter `aistoteleapp-art` como autor
2. **Evita deploys para projeto errado** - Garante que sempre deploy no projeto correto do Vercel
3. **Mantém histórico consistente** - Histórico Git limpo e organizado
4. **Previne erros de deploy** - Validações antes de fazer deploy

---

## 🔄 ATUALIZAÇÃO PERIÓDICA

Recomendamos executar a validação periodicamente:
```bash
# Adicionar ao seu workflow
bash scripts/validate-accounts.sh
```

Ou adicionar ao `package.json`:
```json
{
  "scripts": {
    "validate:accounts": "bash scripts/validate-accounts.sh",
    "deploy:prod": "bash scripts/deploy-safe.sh --prod",
    "deploy:preview": "bash scripts/deploy-safe.sh --preview"
  }
}
```

---

## ✅ STATUS ATUAL

- ✅ Git configurado localmente (`.git/config`)
- ✅ Hook pre-push ativo
- ✅ Script de validação criado
- ✅ Script de deploy seguro criado
- ✅ Documentação completa

**Tudo pronto para garantir que as contas corretas sejam sempre usadas!** 🎉

