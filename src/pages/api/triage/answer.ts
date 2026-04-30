import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { serverEnv } from "@/lib/env";
import { withTriageMonitoring, captureTriageEvent } from "@/lib/monitoring/api-middleware";
import { setSentryTriageTag } from "@/lib/observability";
import { coercePhoneLike } from "@/lib/phone/normalize";
import { rateLimit } from "@/lib/rateLimit";
import { hasProfileData } from "@/lib/triage/schema";

type AnswerPayload = {
  ok: true;
  progress: number;
};

// Schema de validação Zod
const AnswerRequestSchema = z.object({
  triageId: z.string().uuid(),
  stepKey: z.string().min(1),
  value: z.any(),
  progress: z.number().min(0).max(100).optional(),
});

const PROFILE_KEYS = new Set(["name", "sex", "whatsapp", "dob", "weight", "height", "peso", "altura", "email"]);

// Rate limiting otimizado para triagem (permite fluxo normal)
// Removed duplicate rate limiting system - using single rateLimit function below

// Autenticação via NextAuth (simulada para este exemplo)
async function authenticateRequest(req: NextApiRequest): Promise<{ userId: string | null; isAuthenticated: boolean }> {
  // TODO: Implementar NextAuth real
  // Por enquanto, permitir acesso anônimo para triagem gratuita
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    // Simular validação de token
    const token = authHeader.substring(7);
    // Em produção: validar JWT token
    return { userId: token, isAuthenticated: true };
  }
  
  return { userId: null, isAuthenticated: false };
}

const extractProfileFromAnswers = (answers: Record<string, any>) => {
  const snapshot: Record<string, any> = {};
  const displayName =
    (typeof answers.primeiro_nome === 'string' && answers.primeiro_nome.trim()) ||
    (typeof answers.name === 'string' && answers.name.trim());
  if (displayName) snapshot.name = displayName;
  if (answers.sex) snapshot.sex = answers.sex;
  if (answers.sexo && !snapshot.sex) {
    const m: Record<string, string> = { M: 'M', F: 'F', Masculino: 'M', Feminino: 'F' };
    snapshot.sex = m[String(answers.sexo)] ?? answers.sexo;
  }
  const whatsapp = coercePhoneLike(answers.whatsapp);
  if (whatsapp) snapshot.whatsapp = whatsapp;
  if (answers.data_nascimento) snapshot.birth_date = answers.data_nascimento;
  if (answers.dob) snapshot.birth_date = answers.dob;
  
  // Suportar tanto 'weight' quanto 'peso' (formulário emagrecimento usa 'peso')
  const weightValue = answers.weight ?? answers.peso;
  if (weightValue !== undefined && weightValue !== null && weightValue !== "__skipped__") {
    const numericWeight = Number(weightValue);
    if (!Number.isNaN(numericWeight) && numericWeight > 0) {
      // Normalizar: se for muito grande, assumir que está em gramas
      snapshot.weight_kg = numericWeight > 1000 ? numericWeight / 1000 : numericWeight;
    }
  }
  
  // Suportar tanto 'height' quanto 'altura' (formulário emagrecimento usa 'altura')
  const heightValue = answers.height ?? answers.altura;
  if (heightValue !== undefined && heightValue !== null && heightValue !== "__skipped__") {
    const numericHeight = Number(heightValue);
    if (!Number.isNaN(numericHeight) && numericHeight > 0) {
      // Normalizar: se for menor que 3, assumir que está em metros e converter para cm
      snapshot.height_cm = numericHeight < 3 ? numericHeight * 100 : numericHeight;
    }
  }
  
  if (answers.email) snapshot.email = answers.email;
  return snapshot;
};

export default withTriageMonitoring(async function handler(req: NextApiRequest, res: NextApiResponse<AnswerPayload | { error: string }>) {
  const startTime = Date.now();
  const reqId = Math.random().toString(36).substring(7);
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  
  // Log estruturado
  console.log(`[${reqId}] ${req.method} ${req.url} - IP: ${ip}`);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Validação Zod primeiro para obter triageId
  const validationResult = AnswerRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    console.log(`[${reqId}] Validation error:`, validationResult.error);
    return res.status(400).json({ 
      error: "Dados inválidos: " + validationResult.error.errors.map(e => e.message).join(", ")
    });
  }

  const { triageId, stepKey, value, progress } = validationResult.data;
  const normalizedValue =
    stepKey === "whatsapp" ? coercePhoneLike(value) ?? String(value ?? "").trim() : value;

  // Rate limiting with triageId for allow more requests during triage
  const rateLimitKey = `triage:${ip}:${triageId}`;
  if (!rateLimit(rateLimitKey, 500, 120000)) { // 500 requests per 120 seconds - very generous for triage flow
    console.log(`[${reqId}] Rate limit exceeded for IP: ${ip}, triageId: ${triageId}`);
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  // Autenticação
  const { userId, isAuthenticated } = await authenticateRequest(req);
  
  setSentryTriageTag(triageId);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  
  // Para desenvolvimento local, permitir funcionamento sem Supabase
  if (!supabaseUrl || !serviceKey) {
    console.warn(`[${reqId}] ⚠️ Supabase não configurado. URL: ${!!supabaseUrl}, Key: ${!!serviceKey}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[${reqId}] Usando modo mock para desenvolvimento.`);
      
      // Em desenvolvimento, retornar sucesso sem salvar no banco
      // O cliente já está usando localStorage de qualquer forma
      const mockProgress = Math.min(100, Math.max(progress ?? 0, 0));
      
      return res.status(200).json({
        ok: true,
        progress: mockProgress
      });
    }
    
    console.error(`[${reqId}] Supabase não configurado em produção`);
    return res.status(500).json({ error: "Serviço temporariamente indisponível. Tente novamente em alguns instantes." });
  }

  // Usar service_role apenas server-side, nunca expor ao cliente
  const supabase = createClient(supabaseUrl, serviceKey);

  // Verificar se a sessão pertence ao usuário (owner-only)
  const { data: session, error: sessionError } = await supabase
    .from("triage_sessions")
    .select("answers, client_id, profile_id, profile_snapshot, progress_percent")
    .eq("triage_id", triageId)
    .single();

  if (sessionError || !session) {
    console.log(`[${reqId}] Session not found: ${triageId}`);
    return res.status(404).json({ error: "Sessão não encontrada." });
  }

  // Verificação de ownership (se autenticado)
  if (isAuthenticated && userId && session.client_id !== userId) {
    console.log(`[${reqId}] Access denied - user ${userId} trying to access session ${triageId} owned by ${session.client_id}`);
    return res.status(403).json({ error: "Acesso negado. Esta sessão não pertence a você." });
  }

  // Audit log
  console.log(`[${reqId}] User ${userId || 'anonymous'} updating session ${triageId}, step ${stepKey}`);

  const { error: upsertError } = await supabase
    .from("triage_steps")
    .upsert({
      triage_id: triageId,
      step_key: stepKey,
      answer: normalizedValue,
      updated_at: new Date().toISOString()
    });

  if (upsertError) {
    console.log(`[${reqId}] Upsert error:`, upsertError);
    return res.status(500).json({ error: upsertError.message });
  }

  const nextAnswers = { ...(session.answers ?? {}), [stepKey]: normalizedValue };
  const nextProgress = Math.min(100, Math.max(progress ?? 0, session.progress_percent ?? 0));

  const profileSnapshot = extractProfileFromAnswers(nextAnswers);
  const mergedSnapshot = Object.keys(profileSnapshot).length
    ? { ...(session.profile_snapshot ?? {}), ...profileSnapshot }
    : session.profile_snapshot;

  const { error: updateError } = await supabase
    .from("triage_sessions")
    .update({
      answers: nextAnswers,
      progress_percent: nextProgress,
      profile_snapshot: mergedSnapshot,
      updated_at: new Date().toISOString()
    })
    .eq("triage_id", triageId);

  if (updateError) {
    console.log(`[${reqId}] Update error:`, updateError);
    return res.status(500).json({ error: updateError.message });
  }

  if (PROFILE_KEYS.has(stepKey) && session.client_id) {
    const profilePayload = extractProfileFromAnswers(nextAnswers);
    const profileCheck = {
      name: profilePayload.name,
      sex: profilePayload.sex,
      whatsapp: profilePayload.whatsapp,
      dob: profilePayload.birth_date,
      weight: profilePayload.weight_kg,
      height: profilePayload.height_cm,
      email: profilePayload.email
    };

    if (hasProfileData(profileCheck as Record<string, any>)) {
      if (session.profile_id) {
        await supabase.from("profiles").update(profilePayload).eq("id", session.profile_id);
      } else {
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("client_id", session.client_id)
          .maybeSingle();

        if (existingProfile?.id) {
          await supabase.from("profiles").update(profilePayload).eq("id", existingProfile.id);
          await supabase
            .from("triage_sessions")
            .update({ profile_id: existingProfile.id })
            .eq("triage_id", triageId);
        } else {
          const { data: createdProfile } = await supabase
            .from("profiles")
            .insert({
              client_id: session.client_id,
              ...profilePayload
            })
            .select()
            .single();

          if (createdProfile?.id) {
            await supabase
              .from("triage_sessions")
              .update({ profile_id: createdProfile.id })
              .eq("triage_id", triageId);
          }
        }
      }
    }
  }

  const duration = Date.now() - startTime;
  console.log(`[${reqId}] Success - Duration: ${duration}ms`);

  // Capturar evento de negócio
  captureTriageEvent('answer_saved', {
    triageId,
    stepKey,
    progress: nextProgress,
    userId: userId || 'anonymous'
  });

  // Track triage completion (but don't generate report here - that's done in /finalize)
  if (nextProgress >= 100) {
    // Disparar evento TRIAGE_COMPLETED para GHL (sem gerar relatório aqui)
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/analytics/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'TRIAGE_COMPLETED',
            payload: { 
              name: mergedSnapshot?.name,
              email: mergedSnapshot?.email,
              phone: mergedSnapshot?.whatsapp
            }
          })
        });
      } catch (ghlError) {
        console.error('[TRIAGE_COMPLETED] GHL event failed:', ghlError);
        // Não falhar a requisição se o evento GHL falhar
    }
  }

  return res.status(200).json({
    ok: true,
    progress: nextProgress
  });
});
