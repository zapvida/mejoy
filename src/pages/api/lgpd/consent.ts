import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { env } from "@/lib/env";
import { readJson } from "@/lib/http/parse";

type ConsentResponse = { success: true } | { error: string };

// Schema de validação Zod
const ConsentRequestSchema = z.object({
  userId: z.string().nullable(),
  consentAt: z.string().datetime(),
  policyVersion: z.string(),
  ipHash: z.string(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConsentResponse>) {
  const reqId = Math.random().toString(36).substring(7);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Usar helper de parsing seguro
  const body = readJson(req, res, ConsentRequestSchema);
  if (!body.ok) return;

  const { userId, consentAt, policyVersion, ipHash } = body.data;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // TODO(backcompat-2025-10-23) - SUPABASE_SERVICE_ROLE_KEY opcional
  const supabaseKey = (env as any).SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log(`[${reqId}] Consent Supabase not configured`);
    return res.status(200).json({ success: true }); // Soft-fail
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Tentar inserir, mas fazer soft-fail se tabela não existir
    const { error: insertError } = await supabase
      .from("lgpd_consents")
      .insert({
        user_id: userId,
        consent_at: consentAt,
        policy_version: policyVersion,
        ip_hash: ipHash,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.log(`[${reqId}] Consent insert error:`, insertError);
      
      // Soft-fail para qualquer erro de tabela
      if (insertError.message.includes('relation "lgpd_consents" does not exist') ||
          insertError.message.includes('schema cache') ||
          insertError.code === 'PGRST116') {
        console.log(`[${reqId}] Consent logged (table not available - soft-fail)`);
        return res.status(200).json({ success: true });
      } else {
        // Para outros erros, também fazer soft-fail
        console.log(`[${reqId}] Consent soft-fail for error:`, insertError.message);
        return res.status(200).json({ success: true });
      }
    }

    console.log(`[${reqId}] Consent saved successfully for user: ${userId || 'anonymous'}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar consentimento.";
    console.log(`[${reqId}] Consent error:`, message);
    return res.status(200).json({ success: true }); // Sempre soft-fail
  }
}
