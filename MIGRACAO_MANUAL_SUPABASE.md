# 🚀 MIGRAÇÃO MANUAL - SUPABASE DASHBOARD

## INSTRUÇÕES PARA EXECUTAR A MIGRAÇÃO:

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto do Alloe Health

### 2. Vá para SQL Editor
- No menu lateral, clique em "SQL Editor"
- Clique em "New query"

### 3. Execute o SQL
- Copie todo o conteúdo do arquivo `migration_gift_tokens.sql`
- Cole no editor SQL
- Clique em "Run" para executar

### 4. Verificar Resultado
- Deve aparecer duas mensagens de sucesso:
  - "GiftToken table created successfully"
  - "Subscription table updated successfully"

### 5. Verificar Tabelas
- Vá em "Table Editor" no menu lateral
- Verifique se a tabela "GiftToken" foi criada
- Verifique se a tabela "Subscription" tem os novos campos "planType" e "planPrice"

## ✅ APÓS EXECUTAR A MIGRAÇÃO:
- Continue com o próximo passo do plano
- Configure o webhook do Stripe
- Execute os testes finais
