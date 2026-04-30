# Envs Vercel — Copiar e Colar

**Projeto:** zapfarm (monjoy-mejoy)  
**Onde:** https://vercel.com/monjoy-mejoy/zapfarm/settings/environment-variables  

---

## Envs críticas (atualizar / adicionar)

Cole cada par **Name** / **Value** na Vercel → Environment Variables → Add New.

### 1. DATABASE_URL (OBRIGATÓRIO — pooler para serverless)

```
postgresql://postgres.xbfhvepljmcaztpjbryn:RXw8X5B7LOaNHEkE@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Environment:** Production, Preview, Development

---

### 2. Store V2

| Name | Value | Environment |
|------|-------|-------------|
| `STORE_V2` | `1` | Production |
| `NEXT_PUBLIC_STORE_V2` | `1` | Production |

---

### 3. ADMIN_SECRET_KEY (import catálogo)

Use o valor que já está na Vercel ou defina um novo (ex.: 64 caracteres aleatórios).  
Para o import funcionar, o valor no `.env.local` deve ser o mesmo da Vercel.

---

## Próximos passos (ordem)

### 0. Build timeout corrigido

O `postbuild` não roda mais `prisma migrate deploy` (causava timeout de 45 min). Migrations rodar manualmente quando necessário. Ver `docs/FIX_BUILD_TIMEOUT.md`.

---

### 1. Atualizar DATABASE_URL na Vercel

1. Acesse: https://vercel.com/monjoy-mejoy/zapfarm/settings/environment-variables  
2. Edite `DATABASE_URL` (ou crie se não existir)  
3. Cole o valor abaixo (pooler, porta 6543):

```
postgresql://postgres.xbfhvepljmcaztpjbryn:RXw8X5B7LOaNHEkE@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

4. Garanta `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` em **Production**  
5. Em **Deployments** → último deploy → **Redeploy**

---

### 2. Importar catálogo (após redeploy)

```bash
cd /Users/teobeckert/desenvolvimento/mejoy
bash scripts/import-catalog-production.sh
```

Se der "Unauthorized", confira se `ADMIN_SECRET_KEY` no `.env.local` é igual ao da Vercel.

---

### 3. Validação final

```bash
BASE_URL=https://www.mejoy.com.br bash scripts/validate-store-v2-production.sh
```

Resultado esperado:

```
✅ Health OK (200)
✅ Home OK (200)
✅ /c/sono OK (200)
✅ PDP OK (200)
✅ /cart OK (200)
✅ API cart OK (200)
```

---

## Checklist

- [ ] `DATABASE_URL` atualizada (pooler, porta 6543) na Vercel  
- [ ] `STORE_V2=1` e `NEXT_PUBLIC_STORE_V2=1` em Production  
- [ ] Redeploy feito  
- [ ] Import do catálogo executado  
- [ ] Script de validação passando  
