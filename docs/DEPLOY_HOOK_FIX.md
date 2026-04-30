# Deploy sem convidar membros – Solução definitiva

## Problema

O Deploy Hook retorna `PENDING`, mas **nenhum deploy aparece** na Vercel. A Vercel bloqueia quando o **autor do commit** não é membro do time.

## Solução: GitHub Actions + dummy commit

O workflow cria um commit com o email autorizado quando você faz push com outro email. **Não precisa convidar ninguém.**

### 1. Configurar secrets no GitHub

1. Acesse: **https://github.com/zapfarmx/zapfarm/settings/secrets/actions**
2. Clique em **New repository secret** e adicione:

| Nome | Valor |
|------|-------|
| `VERCEL_DEPLOY_HOOK` | `https://api.vercel.com/v1/integrations/deploy/prj_HxEANEHVT9ixnoCJp43uZKAMHgST/OZ657hY5nr` |
| `DEPLOYER_EMAIL` | Email de quem **já tem acesso** ao time Vercel (monjoy-mejoy) |

3. (Opcional) `DEPLOYER_NAME` – nome para o commit (ex: `Me Joy Deploy`). Se não definir, usa `Deploy Bot`.

### 2. Descobrir o DEPLOYER_EMAIL

O `DEPLOYER_EMAIL` deve ser o email de alguém que **já está no time** monjoy-mejoy:

- Quem criou o projeto na Vercel
- Ou quem foi convidado e tem acesso

Para descobrir: faça login na Vercel com a conta que tem acesso → **Account Settings** → veja o email.

### 3. Fluxo

1. Você faz push em `main` (com qualquer email)
2. GitHub Actions roda
3. Se o autor do commit ≠ `DEPLOYER_EMAIL` → cria um commit vazio com o deployer e dá push
4. Na próxima run, o autor é o deployer → dispara o Deploy Hook
5. Deploy sobe na Vercel

---

## Alternativa: usar o mesmo email no Git e na Vercel

Se **você** já tem acesso ao projeto na Vercel:

1. Veja seu email na Vercel: **Account Settings**
2. Configure o Git:
   ```bash
   git config user.email "seu_email_vercel@exemplo.com"
   ```
3. Faça um novo commit e push – o deploy deve funcionar direto

---

## Resumo

| Situação | Solução |
|----------|---------|
| Você não tem acesso ao time | Configurar `DEPLOYER_EMAIL` (email de quem tem) nos secrets |
| Você tem acesso ao time | Usar `git config user.email` com seu email da Vercel |
| Deploy sobe commit errado | Verificar se o Deploy Hook está para branch `main` |
