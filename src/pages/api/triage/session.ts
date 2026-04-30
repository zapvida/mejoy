import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

import { setSentryTriageTag } from "@/lib/observability";
import { coercePhoneLike } from "@/lib/phone/normalize";
import { flowsMap } from "@/lib/triage/flows";
import { hasProfileData } from "@/lib/triage/schema";

type SessionPayload = {
  triageId: string;
  firstVisit: boolean;
  answers?: Record<string, any>;
  progress?: number;
  completed?: boolean;
  reportId?: string;
  triageSlug?: string;
  profile_snapshot?: Record<string, any> | null;
  flowVersion?: string;
  schemaVersion?: string;
};

const FLOW_VERSION_KEY = "__flowVersion";
const SCHEMA_VERSION_KEY = "__schemaVersion";

const mapSnapshotToAnswers = (snapshot: Record<string, any> | null | undefined) => {
  if (!snapshot) return {};
  const normalizedSnapshot = normalizeProfileSnapshot(snapshot);
  const parsed: Record<string, any> = {};
  if (normalizedSnapshot.name) {
    parsed.name = normalizedSnapshot.name;
    parsed.primeiro_nome = normalizedSnapshot.name;
  }
  if (normalizedSnapshot.sex) {
    parsed.sex = normalizedSnapshot.sex;
    parsed.sexo = normalizedSnapshot.sex;
  }
  if (normalizedSnapshot.whatsapp) parsed.whatsapp = normalizedSnapshot.whatsapp;
  if (normalizedSnapshot.birth_date) {
    parsed.dob = normalizedSnapshot.birth_date;
    parsed.data_nascimento = normalizedSnapshot.birth_date;
  }
  if (normalizedSnapshot.weight_kg !== undefined && normalizedSnapshot.weight_kg !== null) {
    const weightNumber = Number(normalizedSnapshot.weight_kg);
    if (!Number.isNaN(weightNumber)) {
      parsed.weight = weightNumber;
      parsed.peso = weightNumber;
    }
  }
  if (normalizedSnapshot.height_cm !== undefined && normalizedSnapshot.height_cm !== null) {
    const heightNumber = Number(normalizedSnapshot.height_cm);
    if (!Number.isNaN(heightNumber)) {
      parsed.height = heightNumber;
      parsed.altura = heightNumber;
    }
  }
  if (normalizedSnapshot.email) parsed.email = normalizedSnapshot.email;
  return parsed;
};

const normalizeProfileSnapshot = (snapshot: Record<string, any> | null | undefined) => {
  if (!snapshot) return null;

  const normalized = { ...snapshot };
  const whatsapp = coercePhoneLike(snapshot.whatsapp);
  if (whatsapp) normalized.whatsapp = whatsapp;
  else delete normalized.whatsapp;

  return normalized;
};

const normalizeAnswersPayload = (answers: Record<string, any> | null | undefined) => {
  if (!answers) return {};

  const normalized = { ...answers };
  delete normalized[FLOW_VERSION_KEY];
  delete normalized[SCHEMA_VERSION_KEY];
  const whatsapp = coercePhoneLike(answers.whatsapp);
  if (whatsapp) normalized.whatsapp = whatsapp;
  else if ("whatsapp" in normalized && !answers.whatsapp) delete normalized.whatsapp;

  return normalized;
};

const resolveReportId = (
  triageId: string,
  triageReports: Array<{ id?: string | null }> | { id?: string | null } | null | undefined
) => {
  if (Array.isArray(triageReports)) {
    return triageReports.length > 0 ? triageId : undefined;
  }

  return triageReports?.id ? triageId : undefined;
};

const isLocalHost = (host: string | undefined) => {
  if (!host) return false;
  return (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]")
  );
};

const shouldAllowMockSession = (req: NextApiRequest) => {
  if (process.env.ALLOW_MOCK_TRIAGE_SESSION === "1") return true;
  if (process.env.NODE_ENV !== "production") return true;
  return isLocalHost(req.headers.host);
};

const resolveFlowMetadata = (triageSlug?: string) => {
  const flow = triageSlug ? flowsMap[triageSlug] : undefined;
  return {
    flowVersion: flow?.flowVersion,
    schemaVersion: flow?.schemaVersion,
  };
};

const buildAnswersMetadata = (triageSlug?: string) => {
  const { flowVersion, schemaVersion } = resolveFlowMetadata(triageSlug);
  return {
    ...(flowVersion ? { [FLOW_VERSION_KEY]: flowVersion } : {}),
    ...(schemaVersion ? { [SCHEMA_VERSION_KEY]: schemaVersion } : {}),
  };
};

const isSessionCompatibleWithFlow = (
  triageSlug: string | undefined,
  answers: Record<string, any> | null | undefined
) => {
  const { flowVersion, schemaVersion } = resolveFlowMetadata(triageSlug);
  if (!flowVersion && !schemaVersion) return true;
  return (
    (!flowVersion || answers?.[FLOW_VERSION_KEY] === flowVersion) &&
    (!schemaVersion || answers?.[SCHEMA_VERSION_KEY] === schemaVersion)
  );
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<SessionPayload | { error: string }>) {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = Date.now();
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (req.method === "GET") {
      const triageId = String(req.query.triageId || "");
      if (!triageId) {
        return res.status(400).json({ error: "triageId é obrigatório." });
      }

      if (!supabaseUrl || !serviceKey) {
        if (shouldAllowMockSession(req)) {
          const { flowVersion, schemaVersion } = resolveFlowMetadata("emagrecimento");
          return res.status(200).json({
            triageId,
            firstVisit: false,
            triageSlug: "emagrecimento",
            profile_snapshot: null,
            answers: {},
            progress: 0,
            completed: false,
            flowVersion,
            schemaVersion,
          });
        }
        return res.status(500).json({ error: "Serviço temporariamente indisponível. Tente novamente em alguns instantes." });
      }

      const supabase = createClient(supabaseUrl, serviceKey);
      const { data: sessionRow, error: sessionError } = await supabase
        .from("triage_sessions")
        .select("triage_id, triage_slug, profile_snapshot, answers, progress_percent, completed_at, triage_reports:triage_reports(id)")
        .eq("triage_id", triageId)
        .maybeSingle();

      if (sessionError || !sessionRow) {
        return res.status(404).json({ error: "Triagem não encontrada." });
      }

      setSentryTriageTag(sessionRow.triage_id);

      const normalizedSnapshot = normalizeProfileSnapshot(sessionRow.profile_snapshot);
      const profileAnswers = mapSnapshotToAnswers(normalizedSnapshot);
      const answers = {
        ...profileAnswers,
        ...normalizeAnswersPayload(sessionRow.answers)
      };

      return res.status(200).json({
        triageId: sessionRow.triage_id,
        triageSlug: sessionRow.triage_slug,
        firstVisit: !hasProfileData(profileAnswers),
        profile_snapshot: normalizedSnapshot,
        answers,
        progress: sessionRow.progress_percent ?? 0,
        completed: !!sessionRow.completed_at,
        reportId: resolveReportId(sessionRow.triage_id, sessionRow.triage_reports),
        ...resolveFlowMetadata(sessionRow.triage_slug),
      });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use GET ou POST" });
    }

    const { triageSlug, forceNew } = req.body as { triageSlug?: string; forceNew?: boolean };
    if (!triageSlug) {
      console.error(`[${requestId}] Missing triageSlug`);
      return res.status(400).json({ error: "triageSlug é obrigatório." });
    }

    console.log(`[${requestId}] Starting session creation for triage: ${triageSlug}`);
    
    // Para desenvolvimento local, permitir funcionamento sem Supabase
    if (!supabaseUrl || !serviceKey) {
      console.warn(`[${requestId}] ⚠️ Supabase não configurado. URL: ${!!supabaseUrl}, Key: ${!!serviceKey}`);
      
      if (shouldAllowMockSession(req)) {
        console.warn(`[${requestId}] Usando modo mock para desenvolvimento.`);
        
        // Gerar um triageId mock
        const mockTriageId = crypto.randomUUID();
        
        return res.status(200).json({
          triageId: mockTriageId,
          firstVisit: true,
          triageSlug,
          profile_snapshot: null,
          answers: {},
          progress: 0,
          completed: false,
          reportId: undefined,
          ...resolveFlowMetadata(triageSlug),
        });
      }
      
      console.error(`[${requestId}] Supabase não configurado em produção`);
      return res.status(500).json({ error: "Serviço temporariamente indisponível. Tente novamente em alguns instantes." });
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    let clientId = req.cookies.client_id;
    if (!clientId) {
      clientId = crypto.randomUUID();
      const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
      res.setHeader("Set-Cookie", `client_id=${clientId}; Path=/; Max-Age=31536000; SameSite=Lax; HttpOnly;${secure}`);
      console.log(`[${requestId}] Created new client_id: ${clientId}`);
    } else {
      console.log(`[${requestId}] Using existing client_id: ${clientId}`);
    }

    if (!forceNew) {
      console.log(`[${requestId}] Checking for existing session...`);
      const { data: existing, error: existingError } = await supabase
        .from("triage_sessions")
        .select("triage_id, answers, profile_snapshot, progress_percent, completed_at, triage_reports:triage_reports(id)")
        .eq("client_id", clientId)
        .eq("triage_slug", triageSlug)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingError) {
        console.error(`[${requestId}] Error fetching existing session:`, existingError);
        return res.status(500).json({ error: "Erro ao verificar sessão existente. Tente novamente." });
      }

      if (existing) {
        const isCompatible = isSessionCompatibleWithFlow(triageSlug, existing.answers);
        if (!isCompatible && !existing.completed_at) {
          console.log(`[${requestId}] Resetting legacy session ${existing.triage_id} due to schema mismatch`);
          const { error: resetError } = await supabase
            .from("triage_sessions")
            .update({
              answers: buildAnswersMetadata(triageSlug),
              progress_percent: 0,
              completed_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq("triage_id", existing.triage_id);

          if (!resetError) {
            const normalizedSnapshot = normalizeProfileSnapshot(existing.profile_snapshot);
            const profileAnswers = mapSnapshotToAnswers(normalizedSnapshot);
            return res.status(200).json({
              triageId: existing.triage_id,
              firstVisit: false,
              triageSlug,
              profile_snapshot: normalizedSnapshot,
              answers: profileAnswers,
              progress: 0,
              completed: false,
              reportId: undefined,
              ...resolveFlowMetadata(triageSlug),
            });
          }
        }

        if (isCompatible) {
          console.log(`[${requestId}] Found existing session: ${existing.triage_id}`);
          setSentryTriageTag(existing.triage_id);
          const normalizedSnapshot = normalizeProfileSnapshot(existing.profile_snapshot);
          const profileAnswers = mapSnapshotToAnswers(normalizedSnapshot);
          const answers = {
            ...profileAnswers,
            ...normalizeAnswersPayload(existing.answers)
          };

          return res.status(200).json({
            triageId: existing.triage_id,
            firstVisit: false, // Não coletamos mais dados pessoais no início
            triageSlug,
            profile_snapshot: normalizedSnapshot,
            answers,
            progress: existing.progress_percent ?? 0,
            completed: !!existing.completed_at,
            reportId: resolveReportId(existing.triage_id, existing.triage_reports),
            ...resolveFlowMetadata(triageSlug),
          });
        }
      }
    }

    console.log(`[${requestId}] Fetching profile for client_id: ${clientId}`);
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("client_id", clientId)
      .maybeSingle();

    if (profileError) {
      console.error(`[${requestId}] Error fetching profile:`, profileError);
      // Não falhar se não houver perfil, apenas continuar sem snapshot
    }

    const snapshot = profile
      ? {
          name: profile.name,
          sex: profile.sex,
          whatsapp: coercePhoneLike(profile.whatsapp),
          birth_date: profile.birth_date,
          weight_kg: profile.weight_kg,
          height_cm: profile.height_cm,
          email: profile.email
        }
      : null;

    console.log(`[${requestId}] Creating new session...`);
    const { data: created, error: createError } = await supabase
      .from("triage_sessions")
      .insert({
        client_id: clientId,
        profile_id: profile?.id ?? null,
        triage_slug: triageSlug,
        profile_snapshot: snapshot,
        answers: buildAnswersMetadata(triageSlug),
      })
      .select()
      .single();

    if (createError || !created) {
      console.error(`[${requestId}] Error creating session:`, createError);
      const errorMessage = createError?.message || "Falha ao criar sessão.";
      
      // Verificar se é erro de constraint (sessão já existe)
      if (createError?.code === '23505' || errorMessage.includes('duplicate')) {
        console.log(`[${requestId}] Session already exists, fetching it...`);
        // Tentar buscar a sessão existente
        const { data: existing } = await supabase
          .from("triage_sessions")
          .select("triage_id, answers, profile_snapshot, progress_percent, completed_at, triage_reports:triage_reports(id)")
          .eq("client_id", clientId)
          .eq("triage_slug", triageSlug)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (existing) {
          const isCompatible = isSessionCompatibleWithFlow(triageSlug, existing.answers);
          setSentryTriageTag(existing.triage_id);
          const normalizedSnapshot = normalizeProfileSnapshot(existing.profile_snapshot);
          const profileAnswers = mapSnapshotToAnswers(normalizedSnapshot);
          const answers = {
            ...profileAnswers,
            ...normalizeAnswersPayload(existing.answers)
          };

          if (isCompatible) {
            return res.status(200).json({
              triageId: existing.triage_id,
              firstVisit: false, // Não coletamos mais dados pessoais no início
              triageSlug,
              profile_snapshot: normalizedSnapshot,
              answers,
              progress: existing.progress_percent ?? 0,
              completed: !!existing.completed_at,
              reportId: resolveReportId(existing.triage_id, existing.triage_reports),
              ...resolveFlowMetadata(triageSlug),
            });
          }

          if (!existing.completed_at) {
            const { error: resetError } = await supabase
              .from("triage_sessions")
              .update({
                answers: buildAnswersMetadata(triageSlug),
                progress_percent: 0,
                completed_at: null,
                updated_at: new Date().toISOString(),
              })
              .eq("triage_id", existing.triage_id);

            if (!resetError) {
              return res.status(200).json({
                triageId: existing.triage_id,
                firstVisit: false,
                triageSlug,
                profile_snapshot: normalizedSnapshot,
                answers: profileAnswers,
                progress: 0,
                completed: false,
                reportId: undefined,
                ...resolveFlowMetadata(triageSlug),
              });
            }
          }
        }
      }
      
      return res.status(500).json({ error: "Não foi possível iniciar a triagem. Tente novamente em alguns instantes." });
    }

    console.log(`[${requestId}] Session created successfully: ${created.triage_id} (${Date.now() - startTime}ms)`);
    setSentryTriageTag(created.triage_id);
    const normalizedSnapshot = normalizeProfileSnapshot(snapshot);
    const profileAnswers = mapSnapshotToAnswers(normalizedSnapshot);

    return res.status(200).json({
      triageId: created.triage_id,
      firstVisit: !hasProfileData(profileAnswers),
      triageSlug,
      profile_snapshot: normalizedSnapshot,
      answers: profileAnswers,
      progress: 0,
      completed: false,
      reportId: undefined,
      ...resolveFlowMetadata(triageSlug),
    });
  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    return res.status(500).json({ error: "Erro ao processar solicitação. Tente novamente." });
  }
}
