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
const ENSURE_REPORT = process.argv.includes('--ensure-report');
const PRINT_MAGIC_LINK = process.argv.includes('--print-magic-link');
const JSON_OUTPUT = process.argv.includes('--json');
const FIXTURE_WHATSAPP = '11999998888';
const FIXTURE_TRIAGE_SLUG = 'emagrecimento';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br';

type EnvConfig = {
  url: string;
  serviceRoleKey: string;
  anonKey: string;
  databaseUrl: string;
};

type FixtureSummary = {
  email: string;
  password: string;
  profileId: string | null;
  orderId: string | null;
  triageId: string | null;
  reportUrl: string | null;
  dashboardMagicUrl: string | null;
};

type PublicFixtureResult = {
  triageId: string;
  reportUrl: string;
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

async function ensureProfileViaAdmin(supabase: ReturnType<typeof createClient>) {
  const normalizedEmail = TEST_EMAIL.toLowerCase();
  const existing = await supabase
    .from('profiles')
    .select('id')
    .eq('email', normalizedEmail)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing.data?.id) {
    await supabase
      .from('profiles')
      .update({
        name: TEST_NAME,
        whatsapp: FIXTURE_WHATSAPP,
        sex: 'female',
        birth_date: '1987-04-17',
        weight_kg: 96,
        height_cm: 168,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.data.id);

    console.log('✅ Profile atualizado via admin.');
    return existing.data.id;
  }

  const inserted = await supabase
    .from('profiles')
    .insert({
      email: normalizedEmail,
      name: TEST_NAME,
      whatsapp: FIXTURE_WHATSAPP,
      sex: 'female',
      birth_date: '1987-04-17',
      weight_kg: 96,
      height_cm: 168,
    })
    .select('id')
    .single();

  if (inserted.data?.id) {
    console.log('✅ Profile criado via admin.');
    return inserted.data.id;
  }

  if (inserted.error) {
    console.warn(`⚠️  Não foi possível criar profile via admin: ${inserted.error.message}`);
  }

  return null;
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

async function getQaProfileId(config: EnvConfig) {
  if (!config.databaseUrl) return null;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const client = new PgClient({
    connectionString: config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    const profile = await client.query<{ id: string }>(
      'select id from profiles where lower(email) = $1 order by updated_at desc nulls last, created_at desc nulls last limit 1',
      [TEST_EMAIL.toLowerCase()]
    );

    return profile.rows[0]?.id ?? null;
  } finally {
    await client.end();
  }
}

function buildFixtureAnswers() {
  return {
    aceita_termos: true,
    altura: 168,
    peso: 96,
    peso_meta: 74,
    sexo: 'Feminino',
    sex: 'F',
    gestacao: 'nao',
    data_nascimento: '1987-04-17',
    dob: '1987-04-17',
    contraindicacoes_glp1: ['nenhuma'],
    comorbidades: ['pre_diabetes', 'apneia_sono'],
    cirurgia_bariatrica_previa: 'nao',
    uso_opioides_3meses: 'nao',
    medicamentos_prescritos_atual: 'metformina',
    uso_medicacao_emagrecimento_recente: 'nao',
    efeitos_colaterais_previos: 'nao_tive',
    pressao_arterial_faixa: 'estagio1',
    frequencia_cardiaca_repouso: '60_79',
    impacto_vida: 'muito',
    objetivo_principal: 'perder_peso_rapido',
    preferencia_principio_ativo: 'tirzepatida',
    primeiro_nome: TEST_NAME,
    name: TEST_NAME,
    email: TEST_EMAIL,
    whatsapp: FIXTURE_WHATSAPP,
    consentimento_whatsapp: true,
  };
}

function buildFixtureAnswerSequence() {
  const answers = buildFixtureAnswers();
  return [
    ['aceita_termos', answers.aceita_termos],
    ['altura', answers.altura],
    ['peso', answers.peso],
    ['peso_meta', answers.peso_meta],
    ['sexo', answers.sexo],
    ['email', answers.email],
    ['data_nascimento', answers.data_nascimento],
    ['gestacao', answers.gestacao],
    ['contraindicacoes_glp1', answers.contraindicacoes_glp1],
    ['comorbidades', answers.comorbidades],
    ['cirurgia_bariatrica_previa', answers.cirurgia_bariatrica_previa],
    ['uso_opioides_3meses', answers.uso_opioides_3meses],
    ['medicamentos_prescritos_atual', answers.medicamentos_prescritos_atual],
    ['uso_medicacao_emagrecimento_recente', answers.uso_medicacao_emagrecimento_recente],
    ['efeitos_colaterais_previos', answers.efeitos_colaterais_previos],
    ['pressao_arterial_faixa', answers.pressao_arterial_faixa],
    ['frequencia_cardiaca_repouso', answers.frequencia_cardiaca_repouso],
    ['impacto_vida', answers.impacto_vida],
    ['objetivo_principal', answers.objetivo_principal],
    ['preferencia_principio_ativo', answers.preferencia_principio_ativo],
    ['primeiro_nome', answers.primeiro_nome],
    ['whatsapp', answers.whatsapp],
    ['consentimento_whatsapp', answers.consentimento_whatsapp],
  ] as const;
}

function buildFixtureProfileSnapshot() {
  return {
    name: TEST_NAME,
    email: TEST_EMAIL.toLowerCase(),
    whatsapp: FIXTURE_WHATSAPP,
    sex: 'F',
    birth_date: '1987-04-17',
    weight_kg: 96,
    height_cm: 168,
  };
}

async function ensureProdSmokeReport(config: EnvConfig, profileId: string) {
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
    const existing = await client.query<{
      triage_id: string;
      status: string | null;
    }>(
      `
        select ts.triage_id, tr.status
        from triage_sessions ts
        left join triage_reports tr on tr.triage_id = ts.triage_id
        where ts.profile_id = $1
          and ts.triage_slug = $2
        order by coalesce(ts.completed_at, ts.updated_at, ts.created_at) desc
        limit 1
      `,
      [profileId, FIXTURE_TRIAGE_SLUG]
    );

    const triageId = existing.rows[0]?.triage_id ?? crypto.randomUUID();
    const existingStatus = existing.rows[0]?.status ?? null;

    if (existingStatus === 'completed') {
      console.log(`✅ Relatório de smoke reutilizado: ${triageId}`);
      return triageId;
    }

    const answers = buildFixtureAnswers();
    const profileSnapshot = buildFixtureProfileSnapshot();
    const completedAt = new Date().toISOString();

    await client.query(
      `
        insert into triage_sessions (
          triage_id, client_id, profile_id, triage_slug, answers, profile_snapshot,
          progress_percent, completed_at, updated_at
        ) values ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8,$9)
        on conflict (triage_id) do update
        set
          profile_id = excluded.profile_id,
          triage_slug = excluded.triage_slug,
          answers = excluded.answers,
          profile_snapshot = excluded.profile_snapshot,
          progress_percent = excluded.progress_percent,
          completed_at = excluded.completed_at,
          updated_at = excluded.updated_at
      `,
      [
        triageId,
        `launch-fixture-${profileId}`,
        profileId,
        FIXTURE_TRIAGE_SLUG,
        JSON.stringify(answers),
        JSON.stringify(profileSnapshot),
        100,
        completedAt,
        completedAt,
      ]
    );

    const { deriveReport } = await import('../src/lib/report/derive');
    const vm = await deriveReport(
      {
        triageId,
        sessionData: {
          answers,
          profile: {
            name: TEST_NAME,
            sex: 'F',
            age: 39,
            bmi: 34,
            whatsapp: FIXTURE_WHATSAPP,
            weightKg: 96,
            heightCm: 168,
          },
          triageSlug: FIXTURE_TRIAGE_SLUG,
        },
        options: {
          includeAudio: false,
        },
      },
      { persist: false }
    );

    const reportSections = {
      ...vm,
      answers,
    };
    const summary = Array.isArray(vm.content.executiveSummary)
      ? vm.content.executiveSummary.slice(0, 2).join(' ')
      : 'Relatório MeJoy pronto para validação.';

    await client.query(
      `
        insert into triage_reports (
          triage_id, status, sections, summary, updated_at
        ) values ($1,$2,$3::jsonb,$4,$5)
        on conflict (triage_id) do update
        set
          status = excluded.status,
          sections = excluded.sections,
          summary = excluded.summary,
          updated_at = excluded.updated_at,
          error = null
      `,
      [triageId, 'completed', JSON.stringify(reportSections), summary, completedAt]
    );

    console.log(`✅ Relatório de smoke garantido: ${triageId}`);
    return triageId;
  } finally {
    await client.end();
  }
}

async function createDashboardMagicUrl(profileId: string) {
  const { createMagicLink } = await import('../src/lib/auth/magic-link');
  const result = await createMagicLink({
    profileId,
    redirectPath: '/dashboard',
  });

  return result?.magicUrl ?? null;
}

async function createReportFixtureViaPublicApi(): Promise<PublicFixtureResult> {
  const cookieJar: string[] = [];
  const headers = () => {
    const headerMap: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (cookieJar.length > 0) {
      headerMap.Cookie = cookieJar.join('; ');
    }
    return headerMap;
  };
  const absorbCookies = (response: Response) => {
    const setCookie = (response.headers as any).getSetCookie?.() as string[] | undefined;
    if (!setCookie?.length) return;
    for (const value of setCookie) {
      const pair = value.split(';')[0];
      const name = pair.split('=')[0];
      const existingIndex = cookieJar.findIndex((entry) => entry.startsWith(`${name}=`));
      if (existingIndex >= 0) cookieJar.splice(existingIndex, 1);
      cookieJar.push(pair);
    }
  };

  const sessionResponse = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/triage/session`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      triageSlug: FIXTURE_TRIAGE_SLUG,
      forceNew: true,
    }),
  });
  absorbCookies(sessionResponse);

  if (!sessionResponse.ok) {
    throw new Error(`Falha ao criar sessão de triagem pública: ${sessionResponse.status}`);
  }

  const sessionData = (await sessionResponse.json()) as { triageId?: string };
  if (!sessionData.triageId) {
    throw new Error('API pública não retornou triageId.');
  }

  const answerSequence = buildFixtureAnswerSequence();
  for (let index = 0; index < answerSequence.length; index += 1) {
    const [stepKey, value] = answerSequence[index];
    const answerResponse = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/triage/answer`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        triageId: sessionData.triageId,
        stepKey,
        value,
        progress: Math.round(((index + 1) / answerSequence.length) * 100),
      }),
    });

    if (!answerResponse.ok) {
      throw new Error(`Falha ao responder ${stepKey}: ${answerResponse.status}`);
    }
  }

  const finalizeResponse = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/triage/finalize`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      triageId: sessionData.triageId,
      triageSlug: FIXTURE_TRIAGE_SLUG,
      answers: buildFixtureAnswers(),
    }),
  });

  if (!finalizeResponse.ok) {
    throw new Error(`Falha ao finalizar triagem: ${finalizeResponse.status}`);
  }

  for (let attempt = 0; attempt < 15; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const reportResponse = await fetch(
      `${BASE_URL.replace(/\/$/, '')}/api/triage/session?triageId=${sessionData.triageId}`,
      { headers: headers() }
    );
    if (!reportResponse.ok) continue;
    const reportData = (await reportResponse.json()) as { reportId?: string; completed?: boolean };
    if (reportData.reportId || reportData.completed) {
      return {
        triageId: sessionData.triageId,
        reportUrl: `${BASE_URL.replace(/\/$/, '')}/emagrecimento/relatorio?id=${sessionData.triageId}`,
      };
    }
  }

  throw new Error('Relatório público de fixture não ficou pronto a tempo.');
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

  let profileId =
    (adminClient ? await ensureProfileViaAdmin(adminClient) : null) ||
    (await getQaProfileId(envConfig));
  let orderId: string | null = null;
  let triageId: string | null = null;
  let reportUrl: string | null = null;

  if (ENSURE_ORDER) {
    if (envConfig.databaseUrl) {
      orderId = await ensureProdSmokeOrder(envConfig);
    } else {
      console.warn('⚠️  DATABASE_URL indisponível localmente. Pedido fixture não foi materializado.');
    }
  }

  if (ENSURE_REPORT) {
    if (profileId && envConfig.databaseUrl) {
      triageId = await ensureProdSmokeReport(envConfig, profileId);
      reportUrl = triageId ? `${BASE_URL.replace(/\/$/, '')}/emagrecimento/relatorio?id=${triageId}` : null;
    } else {
      const publicFixture = await createReportFixtureViaPublicApi();
      triageId = publicFixture.triageId;
      reportUrl = publicFixture.reportUrl;
      profileId = profileId || null;
      console.log(`✅ Relatório de fixture criado via API pública: ${triageId}`);
    }
  }

  const dashboardMagicUrl =
    profileId && (PRINT_MAGIC_LINK || ENSURE_REPORT) ? await createDashboardMagicUrl(profileId) : null;
  const summary: FixtureSummary = {
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    profileId,
    orderId,
    triageId,
    reportUrl,
    dashboardMagicUrl,
  };

  console.log('\n✅ Usuário de teste pronto!');
  console.log('   Email:', TEST_EMAIL);
  console.log('   Senha:', TEST_PASSWORD);
  console.log('   Profile:', profileId);
  if (orderId) {
    console.log('   Pedido smoke:', orderId);
  }
  if (triageId) {
    console.log('   Relatório fixture:', triageId);
    console.log('   URL relatório:', reportUrl);
  }
  if (dashboardMagicUrl) {
    console.log('   Magic link dashboard:', dashboardMagicUrl);
  }
  console.log('\n   Teste em: https://www.mejoy.com.br/login');
  console.log('   Tab: E-mail e senha\n');

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(summary));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
