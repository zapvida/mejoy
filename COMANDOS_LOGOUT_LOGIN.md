# Comandos para Logout e Login - Git e Vercel

## Status Atual (ANTES DO LOGOUT)
- **Git**: `zapfarmx` (zapfarmx@gmail.com)
- **GitHub CLI**: `aimnesis` (ativa) e `zapvida` (inativa)
- **Vercel**: `aimnesis`

## ✅ Logout Executado
- ✓ Vercel: Logout realizado
- ✓ GitHub CLI: Logout de ambas as contas (aimnesis e zapvida)

---

## 🔴 LOGOUT (Execute primeiro)

### Git - Remover credenciais e configurações

```bash
# Remover credenciais do GitHub do keychain do macOS
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF

# Remover credenciais do GitHub CLI (se tiver múltiplas contas, faça logout de cada uma)
gh auth logout --hostname github.com --user NOME_DA_CONTA
# Ou para logout de todas as contas:
gh auth logout --hostname github.com

# Remover configurações de usuário do Git (opcional - você pode reconfigurar depois)
git config --global --unset user.name
git config --global --unset user.email
```

### Vercel - Fazer logout

```bash
vercel logout
```

---

## 🟢 LOGIN (Execute depois do logout)

### Git - Configurar usuário e fazer login

```bash
# 1. Configurar nome e email do Git (substitua pelos seus dados)
git config --global user.name "SEU_NOME"
git config --global user.email "SEU_EMAIL@exemplo.com"

# 2. Fazer login no GitHub via CLI (recomendado)
gh auth login

# Ou se preferir usar credenciais tradicionais:
# git config --global credential.helper osxkeychain
# (na próxima vez que fizer push/pull, será solicitado login)
```

### Vercel - Fazer login

```bash
# Login no Vercel
vercel login

# Ou login com um email específico
vercel login seu-email@exemplo.com
```

---

## 📝 Notas

- Após o logout do Git, você precisará autenticar novamente na próxima operação (push/pull)
- O `gh auth login` é a forma mais segura e moderna de autenticar no GitHub
- O Vercel CLI salvará suas credenciais localmente após o login
- Se estiver usando SSH keys para Git, não precisa fazer logout das credenciais HTTPS

---

## ⚡ Comandos Rápidos (Copie e cole)

### Logout completo:
```bash
# Verificar contas logadas primeiro
gh auth status

# Logout do Vercel
vercel logout

# Logout do GitHub CLI (substitua NOME_DA_CONTA pelas contas que aparecerem no gh auth status)
gh auth logout --hostname github.com --user NOME_DA_CONTA

# Remover configurações Git (opcional)
git config --global --unset user.name
git config --global --unset user.email
```

### Login (após configurar seus dados):
```bash
git config --global user.name "SEU_NOME" && git config --global user.email "SEU_EMAIL" && gh auth login && vercel login
```

