#!/usr/bin/env tsx
/**
 * Cria usuário de teste para validação em produção.
 * Execução: pnpm run setup:test-user
 * Requer: .env.local com SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const TEST_EMAIL = 'paciente-teste@mejoy.com.br';
const TEST_PASSWORD = 'Teste123!';
const TEST_NAME = 'Paciente Teste';

async function main() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('❌ Configure SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL no .env.local');
    process.exit(1);
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  console.log('🔧 Criando usuário de teste...\n');

  // 1. Criar usuário no Auth (ou atualizar senha se já existir)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message?.toLowerCase().includes('already') || authError.message?.includes('already been registered')) {
      console.log('⚠️  Usuário já existe no Auth. Atualizando senha...');
      const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 500 });
      const found = listData?.users?.find((u: { email?: string }) => u.email === TEST_EMAIL);
      const existingUser = found ? { user: found } : null;
      if (existingUser?.user?.id) {
        await supabase.auth.admin.updateUserById(existingUser.user.id, { password: TEST_PASSWORD });
        console.log('✅ Senha atualizada.');
      } else {
        console.error('❌ Usuário existe mas não foi possível obter ID.');
        process.exit(1);
      }
    } else {
      console.error('❌ Erro ao criar usuário Auth:', authError.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Usuário Auth criado:', authData?.user?.email);
  }

  // 2. Criar/atualizar profile em public.profiles
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('email', TEST_EMAIL)
    .maybeSingle();

  if (existingProfile) {
    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ name: TEST_NAME, updated_at: new Date().toISOString() })
      .eq('email', TEST_EMAIL);
    if (updateErr) {
      console.error('❌ Erro ao atualizar profile:', updateErr.message);
      process.exit(1);
    }
    console.log('✅ Profile atualizado.');
  } else {
    const { error: insertErr } = await supabase.from('profiles').insert({
      email: TEST_EMAIL,
      name: TEST_NAME,
      whatsapp: null,
    });
    if (insertErr) {
      console.error('❌ Erro ao criar profile:', insertErr.message);
      process.exit(1);
    }
    console.log('✅ Profile criado.');
  }

  console.log('\n✅ Usuário de teste pronto!');
  console.log('   Email:', TEST_EMAIL);
  console.log('   Senha:', TEST_PASSWORD);
  console.log('\n   Teste em: https://www.mejoy.com.br/login');
  console.log('   Tab: E-mail e senha\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
