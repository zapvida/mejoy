import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { hasProfileData } from "@/lib/triage/schema";
import { setSentryTriageTag } from "@/lib/observability";

type AnswerPayload = {
  ok: true;
  progress: number;
};

const PROFILE_KEYS = new Set(["name", "sex", "whatsapp", "dob", "weight", "height", "email"]);

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { triageId, stepKey, value, progress } = req.body as {
    triageId?: string;
    stepKey?: string;
    value: any;
    progress?: number;
  };

  if (!triageId || !stepKey) {
    return res.status(400).json({ error: "triageId e stepKey são obrigatórios." });
  }

  setSentryTriageTag(triageId);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Supabase não configurado." });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { error: upsertError } = await supabase
    .from("triage_steps")
    .upsert({
      triage_id: triageId,
      step_key: stepKey,
      answer: value,
      updated_at: new Date().toISOString()
    });

  if (upsertError) {
    return res.status(500).json({ error: upsertError.message });
  }

  const { data: session, error: sessionError } = await supabase
    .from("triage_sessions")
    .select("answers, client_id, profile_id, profile_snapshot, progress_percent")
    .eq("triage_id", triageId)
    .single();

  if (sessionError || !session) {
    return res.status(404).json({ error: "Sessão não encontrada." });
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

  return res.status(200).json({
    ok: true,
    progress: nextProgress
  });
}
