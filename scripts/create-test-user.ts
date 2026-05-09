#!/usr/bin/env tsx
/**
 * Cria usuário de teste para validação em produção.
 * Execução: pnpm run setup:test-user
 * Opcional: pnpm run setup:test-user -- --ensure-order
 * Requer: .env.local com SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL
 */

import crypto from 'node:crypto';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client as PgClient } from 'pg';

config({ path: '.env.local' });

const TEST_EMAIL = 'paciente-teste@mejoy.com.br';
const TEST_PASSWORD = 'Teste123!';
const TEST_NAME = 'Paciente Teste';
const ENSURE_ORDER = process.argv.includes('--ensure-order');

type EnvConfig = {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
  databaseUrl: string;
};

function getEnvConfig(): EnvConfig {
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      '',
    databaseUrl: process.env.DATABASE_URL || '',
  };
}

async function updatePasswordForExistingUser(supabase: ReturnType<typeof createClient>) {
  const { data: listData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 500 });
  const existingUser = listData?.users?.find((u: { email?: string }) => u.email === TEST_EMAIL) || null;

  if (!existingUser?.id) {
    return null;
  }

  await supabase.auth.admin.updateUserById(existingUser.id, { password: TEST_PASSWORD });
  console.log('✅ Senha atualizada no Auth.');
  return existingUser.id;
}

async function ensureAuthUserViaDatabase(config: EnvConfig) {
  if (!config.databaseUrl) {
    return null;
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const client = new PgClient({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const authUser = await client.query<{
      id: string;
      email_confirmed_at: string | null;
    }>(
      'select id, email_confirmed_at from auth.users where lower(email) = $1 order by created_at desc limit 1',
      [TEST_EMAIL.toLowerCase()]
    );

    const userId = authUser.rows[0]?.id ?? null;

    if (userId) {
      await client.query(
        'update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where id = $1',
        [userId]
      );
      console.log('✅ Email confirmado diretamente no banco.');
    }

    const profiles = await client.query<{ id: string }>(
      'select id from profiles where lower(email) = $1 order by updated_at desc nulls last, created_at desc nulls last',
      [TEST_EMAIL.toLowerCase()]
    );

    if (profiles.rows.length === 0) {
      await client.query(
        'insert into profiles (email, name, whatsapp) values ($1, $2, null)',
        [TEST_EMAIL.toLowerCase(), TEST_NAME]
      );
      console.log('✅ Profile criado no banco.');
    } else {
      const canonicalProfileId = profiles.rows[0].id;

      await client.query(
        'update profiles set email = $1, name = $2, updated_at = now() where id = $3',
        [TEST_EMAIL.toLowerCase(), TEST_NAME, canonicalProfileId]
      );

      if (profiles.rows.length > 1) {
        await client.query(
          'delete from profiles where id = any($1::uuid[])',
          [profiles.rows.slice(1).map((row) => row.id)]
        );
        console.log(`✅ Profiles duplicados consolidados (${profiles.rows.length - 1} removidos).`);
      } else {
        console.log('✅ Profile atualizado no banco.');
      }
    }

    return userId;
  } finally {
    await client.end();
  }
}

async function ensureProdSmokeOrder(config: EnvConfig) {
  if (!config.databaseUrl) {
    return null;
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const client = new PgClient({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const existingOrder = await client.query<{
      id: string;
      status: string;
    }>(
      'select id, status from "store_v2_orders" where lower("customerEmail") = $1 order by "createdAt" desc limit 1',
      [TEST_EMAIL.toLowerCase()]
    );

    if (existingOrder.rows[0]?.id) {
      console.log(`✅ Pedido de smoke reutilizado: ${existingOrder.rows[0].id}`);
      return existingOrder.rows[0].id;
    }

    const profile = await client.query<{ id: string }>(
      'select id from profiles where lower(email) = $1 order by updated_at desc nulls last, created_at desc nulls last limit 1',
      [TEST_EMAIL.toLowerCase()]
    );

    const orderId = `ord_prod_smoke_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
    const snapshot = {
      items: [
        {
          productId: 'mejoy-prod-smoke',
          productSlug: 'programa-emagrecimento-smoke',
          name: 'Programa MeJoy Premium',
          quantity: 1,
          priceCents: 1000,
          lineTotalCents: 1000,
        },
      ],
      subtotalCents: 1000,
      shippingCents: 0,
      totalCents: 1000,
      source: 'prod-smoke-fixture',
    };

    await client.query(
      `insert into "store_v2_orders" (
        id, "profileId", "customerEmail", "customerName", status, "paymentMethod",
        "totalCents", "shippingCents", snapshot, "trackingCode", "trackingUrl",
        "shippedAt", "deliveredAt", "updatedAt"
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,now(),now(),now())`,
      [
        orderId,
        profile.rows[0]?.id ?? null,
        TEST_EMAIL.toLowerCase(),
        TEST_NAME,
        'DELIVERED',
        'PIX',
        1000,
        0,
        JSON.stringify(snapshot),
        'MEJOYSMOKE123',
        'https://www.mejoy.com.br/pedidos/' + orderId,
      ]
    );

    await client.query(
      `insert into "store_v2_order_items" (
        id, "orderId", "productId", quantity, "priceCents", "isSubscription"
      ) values ($1,$2,$3,$4,$5,$6)`,
      [crypto.randomUUID(), orderId, 'mejoy-prod-smoke', 1, 1000, false]
    );

    console.log(`✅ Pedido de smoke criado: ${orderId}`);
    return orderId;
  } finally {
    await client.end();
  }
}

async function main() {
  const envConfig = getEnvConfig();
  const { url, serviceRoleKey, anonKey } = envConfig;

  if (!url) {
    console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_URL no .env.local');
    process.exit(1);
  }

  const adminClient = serviceRoleKey
    ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
    : null;
  const publicClient = anonKey
    ? createClient(url, anonKey, { auth: { persistSession: false } })
    : null;

  console.log('🔧 Criando usuário de teste...\n');

  let authUserId: string | null = null;

  if (adminClient) {
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

    if (!authError) {
      authUserId = authData.user?.id ?? null;
      console.log('✅ Usuário Auth criado via admin:', authData?.user?.email);
    } else if (
      authError.message?.toLowerCase().includes('already') ||
      authError.message?.includes('already been registered')
    ) {
      console.log('⚠️  Usuário já existe no Auth. Atualizando senha...');
      authUserId = await updatePasswordForExistingUser(adminClient);
    } else {
      console.warn(`⚠️  Admin createUser falhou: ${authError.message}`);
    }
  }

  if (!authUserId && publicClient) {
    const { data, error } = await publicClient.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (!error) {
      authUserId = data.user?.id ?? null;
      console.log('✅ Usuário criado via signup público.');
    } else if (
      error.message?.toLowerCase().includes('already') ||
      error.message?.toLowerCase().includes('registered')
    ) {
      console.log('⚠️  Usuário já existia no signup público.');
    } else {
      console.warn(`⚠️  Signup público falhou: ${error.message}`);
    }
  }

  const dbUserId = await ensureAuthUserViaDatabase(envConfig);
  authUserId = authUserId || dbUserId;

  if (!authUserId) {
    console.error('❌ Não foi possível garantir o usuário de teste no Auth.');
    process.exit(1);
  }

  const orderId = ENSURE_ORDER ? await ensureProdSmokeOrder(envConfig) : null;

  console.log('\n✅ Usuário de teste pronto!');
  console.log('   Email:', TEST_EMAIL);
  console.log('   Senha:', TEST_PASSWORD);
  if (orderId) {
    console.log('   Pedido smoke:', orderId);
  }
  console.log('\n   Teste em: https://www.mejoy.com.br/login');
  console.log('   Tab: E-mail e senha\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
