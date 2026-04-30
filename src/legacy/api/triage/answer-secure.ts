import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { hasProfileData } from "@/lib/triage/schema";
import { setSentryTriageTag } from "@/lib/observability";
import { z } from "zod";
import { serverEnv } from "@/lib/env";
import { readJson } from "@/lib/http/parse";

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

const PROFILE_KEYS = new Set(["name", "sex", "whatsapp", "dob", "weight", "height", "email"]);

// Rate limiting simples (em produção usar Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 50; // Aumentado para permitir triagem completa

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

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
  if (answers.name) snapshot.name = answers.name;
  if (answers.sex) snapshot.sex = answers.sex;
  if (answers.whatsapp) snapshot.whatsapp = answers.whatsapp;
  if (answers.dob) snapshot.birth_date = answers.dob;
  if (answers.weight !== undefined && answers.weight !== null && answers.weight !== "__skipped__") {
    const numericWeight = Number(answers.weight);
    if (!Number.isNaN(numericWeight)) snapshot.weight_kg = numericWeight;
  }
  if (answers.height !== undefined && answers.height !== null && answers.height !== "__skipped__") {
    const numericHeight = Number(answers.height);
    if (!Number.isNaN(numericHeight)) snapshot.height_cm = numericHeight;
  }
  if (answers.email) snapshot.email = answers.email;
  return snapshot;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<AnswerPayload | { error: string }>) {
  const startTime = Date.now();
  const reqId = Math.random().toString(36).substring(7);
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  
  // Log estruturado
  console.log(`[${reqId}] ${req.method} ${req.url} - IP: ${ip}`);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Rate limiting
  if (!checkRateLimit(ip)) {
    console.log(`[${reqId}] Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  // Usar helper de parsing seguro
  const body = readJson(req, res, AnswerRequestSchema);
  if (!body.ok) return;

  const { triageId, stepKey, value, progress } = body.data;

  // Autenticação
  const { userId, isAuthenticated } = await authenticateRequest(req);
  
  setSentryTriageTag(triageId);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceKey) {
    console.log(`[${reqId}] Supabase not configured`);
    return res.status(500).json({ error: "Supabase não configurado." });
  }

  // Usar service_role apenas server-side, nunca expor ao cliente
  const supabase = createClient(supabaseUrl, serviceKey);

  // Verificar se a sessão pertence ao usuário (owner-only)
  const { data: session, error: sessionError } = await supabase
    .from("triage_sessions")
    .select("answers, client_id, profile_id, profile_snapshot, progress_percent")
    .eq("triage_id", triageId)
    .maybeSingle(); // Usar maybeSingle() em vez de single()

  if (sessionError) {
    console.log(`[${reqId}] Session query error:`, sessionError);
    return res.status(500).json({ error: "Erro ao buscar sessão." });
  }

  if (!session) {
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
      answer: value,
      updated_at: new Date().toISOString()
    });

  if (upsertError) {
    console.log(`[${reqId}] Upsert error:`, upsertError);
    return res.status(500).json({ error: upsertError.message });
  }

  const nextAnswers = { ...(session.answers ?? {}), [stepKey]: value };
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

  return res.status(200).json({
    ok: true,
    progress: nextProgress
  });
}
