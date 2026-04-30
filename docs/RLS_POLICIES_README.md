# RLS Policies - Supabase Security

## 🔐 Row Level Security (RLS) Configuration

Este documento explica como aplicar as políticas de segurança RLS no Supabase para garantir que os usuários só acessem seus próprios dados.

---

## 📋 Pré-requisitos

- Projeto Supabase configurado
- Banco de dados PostgreSQL com as tabelas criadas
- Acesso ao SQL Editor do Supabase ou `psql`

---

## 🚀 Como Aplicar

### Opção 1: Supabase SQL Editor
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Cole o conteúdo de `supabase/rls_policies.sql`
4. Execute o script

### Opção 2: Via psql
```bash
psql $DATABASE_URL -f supabase/rls_policies.sql
```

---

## 📊 Políticas Implementadas

### Patient (Pacientes)
- **read_own_patient**: Usuários só podem ler seus próprios dados
- **update_own_patient**: Usuários só podem atualizar seus próprios dados
- **insert_patient**: Permite criação de pacientes anônimos

### Triage (Triagens)
- **read_own_triage**: Usuários só podem ler triagens de seus pacientes
- **insert_own_triage**: Usuários só podem criar triagens para seus pacientes
- **update_own_triage**: Usuários só podem atualizar triagens de seus pacientes

### Report (Relatórios)
- **read_own_report**: Usuários só podem ler relatórios de seus pacientes
- **insert_own_report**: Usuários só podem criar relatórios para seus pacientes
- **update_own_report**: Usuários só podem atualizar relatórios de seus pacientes

### Subscription (Assinaturas)
- **read_own_subscription**: Usuários só podem ler suas próprias assinaturas
- **insert_own_subscription**: Usuários só podem criar assinaturas para si
- **update_own_subscription**: Usuários só podem atualizar suas assinaturas

### Gift (Presentes)
- **read_own_gifts**: Usuários podem ler presentes que enviaram ou resgataram
- **insert_own_gift**: Usuários só podem criar presentes para si
- **redeem_gift**: Usuários só podem resgatar presentes válidos

---

## 🔒 Segurança

### Service Role Bypass
- Webhooks Stripe usam `service_role` que bypassa RLS automaticamente
- APIs internas podem usar `service_role` quando necessário
- Cliente browser sempre usa `anon` key com RLS ativo

### Validação
Para testar se RLS está funcionando:

```sql
-- Como usuário autenticado, deve retornar apenas seus dados
SELECT * FROM "Patient" WHERE id = auth.uid()::text;

-- Como usuário autenticado, não deve retornar dados de outros
SELECT * FROM "Patient" WHERE id != auth.uid()::text;
```

---

## 🎯 Benefícios

- **Isolamento de Dados**: Cada usuário só acessa seus próprios dados
- **Segurança Automática**: Não é possível acessar dados de outros usuários
- **Conformidade LGPD**: Proteção automática de dados pessoais
- **Auditoria**: Todas as operações são logadas pelo Supabase

---

## ⚠️ Importante

- **Sempre teste** as políticas após aplicá-las
- **Backup** do banco antes de aplicar mudanças
- **Monitore logs** para detectar tentativas de acesso indevido
- **Atualize políticas** conforme necessário para novos casos de uso
