// src/env.ts
// Server-side environment variables only (NO NEXT_PUBLIC_*)

import { z } from 'zod';

const serverEnvSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().optional(),
  MOCK_AI: z.enum(['0', '1']).optional(),

  // Supabase (server-side only)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Stripe (server-side only)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ALL_ACCESS: z.string().optional(),
  STRIPE_PRICE_GIFT: z.string().optional(),

  // NextAuth (server-side only)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),

  // Admin (server-side only)
  ADMIN_SECRET_KEY: z.string().optional(),

  // External APIs (server-side only)
  NEXT_PUBLIC_META_API_TOKEN: z.string().optional(),
  GSH_TOKEN: z.string().optional(),
  GSH_LOCATION_ID: z.string().optional(),
  ASAAS_API_KEY: z.string().optional(),
  // Mantemos flexível para evitar derrubar a aplicação inteira por valor mal formatado.
  // A validação de URL deve acontecer no ponto de uso da integração.
  WEBHOOK_ASAAS_URL: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | null = null;

export function validateServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;

  try {
    const parsed = serverEnvSchema.parse(process.env);

    // Não validar DATABASE_URL durante o build (Next.js build time)
    // A validação será feita em runtime quando necessário
    const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                        process.env.NEXT_PHASE === 'phase-development-build' ||
                        typeof window === 'undefined' && !process.env.VERCEL_ENV;

    if (parsed.NODE_ENV === 'production' && !parsed.DATABASE_URL && !isBuildTime) {
      throw new Error('❌ DATABASE_URL deve estar configurada em produção.');
    }

    cachedEnv = parsed;
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`❌ Variáveis de ambiente do servidor inválidas:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

export const serverEnv = validateServerEnv();

// Runtime guards para verificar disponibilidade de serviços
export const runtimeGuards = {
  hasDB: Boolean(serverEnv.DATABASE_URL),
  hasAI: Boolean(serverEnv.OPENAI_API_KEY) || serverEnv.MOCK_AI === '1',
  isMockAI: serverEnv.MOCK_AI === '1',
  isProduction: serverEnv.NODE_ENV === 'production',
};
