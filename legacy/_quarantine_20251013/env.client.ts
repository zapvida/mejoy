// src/env.client.ts
// Client-side environment variables only (NEXT_PUBLIC_*)

import { z } from 'zod';

const clientEnvSchema = z.object({
  // Public Supabase config
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória"),
  
  // Public Stripe config
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: z.string().min(1, "NEXT_PUBLIC_STRIPE_PUBLIC_KEY é obrigatória"),
  
  // App config
  NEXT_PUBLIC_APP_NAME: z.string().default("Alloe Health"),
  NEXT_PUBLIC_FREE_TRIAGE_SLUG: z.string().default("gastro"),
  NEXT_PUBLIC_SITE_URL: z.string().url("NEXT_PUBLIC_SITE_URL deve ser uma URL válida"),
  NEXT_PUBLIC_BASE_URL: z.string().url("NEXT_PUBLIC_BASE_URL deve ser uma URL válida"),
  
  // Analytics
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: z.string().optional(),
  
  // Feature Flags (client-side only)
  FF_SCALES: z.string().default("false"),
  FF_UNIVERSAL_AUTOSAVE: z.string().default("true"),
  FF_RED_FLAGS: z.string().default("true"),
  FF_IMC_CALC: z.string().default("true"),
  FF_GA4_TRACKING: z.string().default("true"),
  FF_REPORT_HARDEN: z.string().default("true"),
  FF_TRIAGE_POLISH: z.string().default("true"),
  FF_PAYMENTS_HARDEN: z.string().default("true"),
  FF_GA4_ENFORCE: z.string().default("true"),
  FF_PRIVACY_HARDEN: z.string().default("true"),
  FF_PDF_POLISH: z.string().default("true"),
  FF_QA_STRICT: z.string().default("true"),
});

export function validateClientEnv() {
  try {
    return clientEnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`❌ Variáveis de ambiente do cliente inválidas:\n${missingVars.join('\n')}`);
    }
    throw error;
  }
}

export const clientEnv = validateClientEnv();
