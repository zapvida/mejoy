# 🚀 INSTRUÇÕES PARA DEPLOY NA VERCEL

## ✅ CONTA VERIFICADA
- ✅ Logado como: **aimnesis**
- ✅ Projeto linkado: **aimnesis-projects/aistotele**
- ✅ Configuração: **vercel.json** já configurado

## 🔧 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

Antes do deploy, confirme que todas as variáveis foram atualizadas na Vercel. Use o Supabase Transaction Pooler para o banco (porta 6543) e mantenha os valores sensíveis no dashboard da Vercel — nunca faça commit dessas chaves.

### **Obrigatórias (produção):**
```
DATABASE_URL=postgresql://your_user:your_password@your_host:5432/your_database
OPENAI_API_KEY=sk-...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://alloehealth.com.br
NEXT_PUBLIC_SITE_URL=https://alloehealth.com.br
NEXT_PUBLIC_BASE_URL=https://alloehealth.com.br
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
STRIPE_SECRET_KEY=your_secret_from_provider
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=your_secret_from_provider
```

### **Opcionais / integrações:**
```
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_API_TOKEN=EAGr...
GSH_TOKEN=pit-...
GSH_LOCATION_ID=PWb...
```

## 📋 PASSOS PARA DEPLOY:

1. **Configure as variáveis** no dashboard da Vercel.
2. **Execute o deploy** com: `vercel --prod`.
3. **Verifique o build** no dashboard.
4. **Teste a aplicação** no domínio gerado.

### 🔁 Migrações Prisma no deploy
- O script `postinstall` agora executa `prisma migrate deploy` automaticamente quando `VERCEL`/`CI` estiver definido e `DATABASE_URL` disponível.
- Se o banco não estiver acessível, o build falhará para evitar deploys sem tabelas.
- Em ambiente local, o script apenas gera o cliente Prisma e ignora as migrações (sem `VERCEL`/`CI`), evitando rodar contra produção por engano.

## 🎯 COMANDO DE DEPLOY:
```bash
vercel --prod
```

## ✅ STATUS ATUAL:
- ✅ Build local: Funcionando
- ✅ Testes: 39/39 passando
- ✅ Configuração: Pronta
- ✅ Conta: Verificada (aimnesis)
- ⏳ Deploy: Pronto para executar
