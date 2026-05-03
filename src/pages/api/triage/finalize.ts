import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

import { createMagicLink } from "@/lib/auth/magic-link";
import { advanceLead } from "@/lib/funnel/service";
import { serverEnv } from "@/lib/env";
import { coercePhoneLike } from "@/lib/phone/normalize";
import { deriveReport } from "@/lib/report/derive";
import { getSupabaseServerConfig } from "@/lib/supabase/runtime-config";
import { sendEvolutionMessage } from "@/lib/evolution/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  
  try {
    const { triageId, triageSlug, answers } = req.body as { 
      triageId?: string; 
      triageSlug?: string; 
      answers?: Record<string, any> 
    };
    if (!triageId) return res.status(400).json({ error: "triageId required" });

    console.log(`[finalize] Processing triageId: ${triageId}, triageSlug: ${triageSlug || 'not provided'}`);

    // Verificar se Supabase está configurado
    const { url: supabaseUrl } = getSupabaseServerConfig();
    const supabaseKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Em desenvolvimento, permitir funcionamento sem Supabase
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[finalize] Supabase não configurado, usando modo mock para triageId: ${triageId}`);
        
        // Usar triageSlug do body ou fallback para emagrecimento
        const mockTriageSlug = triageSlug || 'emagrecimento';
        
        // Extrair dados reais das respostas se disponíveis
        const mockAnswers = answers || {};
        
        // Extrair dados do perfil das respostas
        const extractProfileFromAnswers = (ans: Record<string, any>) => {
          const profile: any = {};
          
          // Nome
          if (ans.primeiro_nome) profile.name = ans.primeiro_nome;
          else if (ans.name) profile.name = ans.name;
          
          // Sexo
          if (ans.sex) profile.sex = ans.sex;
          else if (ans.sexo) {
            const sexMap: Record<string, string> = {
              'Masculino': 'M',
              'Feminino': 'F',
              'masculino': 'M',
              'feminino': 'F',
              'M': 'M',
              'F': 'F'
            };
            profile.sex = sexMap[ans.sexo] || 'M';
          }
          
          // Peso (suporta 'peso' ou 'weight')
          const weightValue = ans.peso ?? ans.weight;
          if (weightValue !== undefined && weightValue !== null && weightValue !== "__skipped__") {
            const numericWeight = Number(weightValue);
            if (!Number.isNaN(numericWeight) && numericWeight > 0) {
              profile.weightKg = numericWeight > 1000 ? numericWeight / 1000 : numericWeight;
            }
          }
          
          // Altura (suporta 'altura' ou 'height')
          const heightValue = ans.altura ?? ans.height;
          if (heightValue !== undefined && heightValue !== null && heightValue !== "__skipped__") {
            const numericHeight = Number(heightValue);
            if (!Number.isNaN(numericHeight) && numericHeight > 0) {
              profile.heightCm = numericHeight < 3 ? numericHeight * 100 : numericHeight;
            }
          }
          
          // Idade
          if (ans.age) {
            profile.age = Number(ans.age);
          } else if (ans.idade) {
            profile.age = Number(ans.idade);
          } else if (ans.idade_faixa) {
            // Converter faixa etária para idade média
            const faixaMap: Record<string, number> = {
              '18-30': 24,
              '31-45': 38,
              '46-60': 53,
              '61+': 70
            };
            profile.age = faixaMap[ans.idade_faixa] ?? 35;
          }
          
          // Data de nascimento
          if (ans.data_nascimento) {
            profile.birthDate = ans.data_nascimento;
          } else if (ans.dob) {
            profile.birthDate = ans.dob;
          } else if (profile.age) {
            // Calcular data de nascimento aproximada
            const today = new Date();
            const birthYear = today.getFullYear() - profile.age;
            profile.birthDate = `${birthYear}-01-01`;
          }
          
          // WhatsApp
          const whatsapp = coercePhoneLike(ans.whatsapp);
          if (whatsapp) profile.whatsapp = whatsapp;
          
          return profile;
        };
        
        const extractedProfile = extractProfileFromAnswers(mockAnswers);
        
        // Usar dados reais se disponíveis, senão usar padrão
        const mockProfile = {
          name: extractedProfile.name || "Paciente",
          sex: (extractedProfile.sex === 'M' || extractedProfile.sex === 'F') 
            ? extractedProfile.sex as 'M' | 'F'
            : "M" as const,
          age: extractedProfile.age || 35,
          birthDateISO: extractedProfile.birthDate || "1990-01-01",
          weightKg: extractedProfile.weightKg || 75,
          heightCm: extractedProfile.heightCm || 170,
          whatsapp: extractedProfile.whatsapp || "",
        };
        
        console.log(`[finalize] Modo mock - Dados extraídos:`, {
          name: mockProfile.name,
          weightKg: mockProfile.weightKg,
          heightCm: mockProfile.heightCm,
          age: mockProfile.age
        });

        // Gerar relatório mock sem persistir, usando dados reais
        await deriveReport({
          triageId,
          sessionData: {
            answers: mockAnswers,
            profile: {
              name: mockProfile.name,
              sex: mockProfile.sex,
              age: mockProfile.age,
              birthDate: mockProfile.birthDateISO,
              weightKg: mockProfile.weightKg,
              heightCm: mockProfile.heightCm,
              whatsapp: mockProfile.whatsapp,
            },
            triageSlug: mockTriageSlug,
          },
          options: {
            includeAudio: false,
          },
        }, { persist: false });

        // Determinar redirect baseado no slug correto
        const zapfarmProducts = [
          'emagrecimento',
          'calvicie',
          'sono',
          'ansiedade',
          'intestino',
          'figado',
          'libido-masculina',
          'menopausa',
          'articulacoes',
          'imunidade'
        ];
        
        const redirectPath = zapfarmProducts.includes(mockTriageSlug)
          ? `/${mockTriageSlug}/relatorio?id=${triageId}`
          : `/relatorio/${triageId}`;
        
        return res.status(200).json({ ok: true, redirect: redirectPath });
      }
      
      console.error(`[finalize] Supabase não configurado em produção`);
      return res.status(500).json({ error: "Serviço temporariamente indisponível. Tente novamente em alguns instantes." });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1) Carrega sessão
    const { data: sessionRow, error: sErr } = await supabase
      .from("triage_sessions")
      .select("*")
      .eq("triage_id", triageId)
      .single();
    
    if (sErr || !sessionRow) {
      console.error(`[finalize] Session not found for triageId: ${triageId}`, sErr);
      return res.status(404).json({ error: "triage not found" });
    }

    // 2) Já existe relatório? (verificação otimizada com cache)
    const { data: existing } = await supabase
      .from("triage_reports")
      .select("id, triage_id, status")
      .eq("triage_id", triageId)
      .maybeSingle(); // Usar maybeSingle para evitar erro quando não existe

    if (existing && existing.status === 'completed') {
      console.log(`[finalize] Report already exists and completed for triageId: ${triageId}`);
      // marca completed_at se ainda não marcado (operação assíncrona, não bloqueia resposta)
      if (!sessionRow.completed_at) {
        Promise.resolve(
          supabase
            .from("triage_sessions")
            .update({ completed_at: new Date().toISOString() })
            .eq("triage_id", triageId)
        )
          .then(() => console.log(`[finalize] Marked completed_at for triageId: ${triageId}`))
          .catch((err: unknown) => console.warn(`[finalize] Failed to mark completed_at:`, err));
      }
      
      // Determinar redirect baseado no slug (garantir que usa o slug correto da sessão)
      const finalTriageSlug = sessionRow.triage_slug || triageSlug || 'geral';
      
      // Lista de produtos ZapFarm que usam rota /[product]/relatorio
      const zapfarmProducts = [
        'emagrecimento',
        'calvicie',
        'sono',
        'ansiedade',
        'intestino',
        'figado',
        'libido-masculina',
        'menopausa',
        'articulacoes',
        'imunidade'
      ];
      
      let redirectPath = `/relatorio/${triageId}`;
      if (zapfarmProducts.includes(finalTriageSlug)) {
        redirectPath = `/${finalTriageSlug}/relatorio?id=${triageId}`;
      }
      
      return res.status(200).json({ ok: true, redirect: redirectPath });
    }

    // Se existe mas está em processamento, retornar status running
    if (existing && existing.status === 'running') {
      console.log(`[finalize] Report already running for triageId: ${triageId}`);
      return res.status(200).json({ ok: true, status: 'running', redirect: null });
    }
    
    // Se existe mas falhou, permitir retry (marcar como running novamente)
    if (existing && existing.status === 'failed') {
      console.log(`[finalize] Report previously failed for triageId: ${triageId}, allowing retry`);
      // Continuar para marcar como running novamente e tentar gerar
    }

    // 3) Marcar como "running" antes de gerar (evita duplicação)
    const { error: markRunningError } = await supabase
      .from("triage_reports")
      .upsert({
        triage_id: triageId,
        status: "running",
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'triage_id'
      });

    if (markRunningError) {
      console.warn(`[finalize] Failed to mark as running:`, markRunningError);
      // Continuar mesmo se falhar - pode ser race condition
    }

    // 4) IMPORTANTE: Retornar imediatamente com status "running" para evitar timeout
    // A geração do relatório acontecerá em background de forma assíncrona
    const finalTriageSlug = sessionRow.triage_slug || triageSlug || "geral";
    console.log(`[finalize] Marked as running, starting async generation for triageId: ${triageId}, triageSlug: ${finalTriageSlug}`);
    
    // Iniciar geração assíncrona sem bloquear a resposta
    Promise.resolve().then(async () => {
      try {
        console.log(`[finalize] Starting async report generation for triageId: ${triageId}`);

        if (sessionRow.profile_id) {
          advanceLead({
            profileId: sessionRow.profile_id,
            productSlug: finalTriageSlug,
            triageSlug: finalTriageSlug,
            step: 'triage_completed',
            source: 'finalize',
          }).catch((e) => console.warn('[finalize] advanceLead triage_completed:', e));
        }
        
        // Extrair dados do profile_snapshot e answers para garantir que temos todos os dados necessários
        const profileSnapshot = sessionRow.profile_snapshot ?? {};
        const answers = sessionRow.answers ?? {};
        
        // Priorizar dados do profile_snapshot, mas usar answers como fallback
        const weightKg = profileSnapshot.weight_kg ?? answers.peso ?? answers.weight;
        const heightCm = profileSnapshot.height_cm ?? answers.altura ?? answers.height;
        
        // Calcular idade a partir de dob / data_nascimento ou idade_faixa (legado)
        let age: number | undefined;
        const birthIso =
          profileSnapshot.birth_date ?? answers.data_nascimento ?? answers.dob;
        if (birthIso) {
          age = Math.floor(
            (Date.now() - new Date(birthIso).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
          );
        } else if (answers.idade_faixa) {
          const faixaMap: Record<string, number> = {
            '18-30': 24,
            '31-45': 38,
            '46-60': 53,
            '61+': 70
          };
          age = faixaMap[answers.idade_faixa];
        }

        const resolvedName =
          profileSnapshot.name ?? answers.primeiro_nome ?? answers.name ?? 'Paciente';
        const rawSex = profileSnapshot.sex ?? answers.sexo ?? answers.sex;
        const resolvedSex =
          rawSex === 'M' || rawSex === 'F' || rawSex === 'Outro'
            ? rawSex
            : rawSex === 'Masculino'
              ? 'M'
              : rawSex === 'Feminino'
                ? 'F'
                : 'M';
        
        // Calcular IMC se tivermos peso e altura
        // Schema Zod espera: number OU { bmi: number, classification: string }
        // Enviar apenas o número (mais simples e compatível)
        let bmi: number | undefined;
        if (weightKg && heightCm && heightCm > 0 && weightKg > 0) {
          const heightM = heightCm / 100;
          bmi = Number((weightKg / (heightM ** 2)).toFixed(1));
          console.log(`[finalize] Calculado IMC: ${bmi} para peso ${weightKg}kg e altura ${heightCm}cm`);
        } else {
          console.warn(`[finalize] Não foi possível calcular IMC: weightKg=${weightKg}, heightCm=${heightCm}`);
        }
        
        const reportDTO = await deriveReport({
          triageId,
          sessionData: {
            answers: answers,
            profile: {
              name: resolvedName,
              sex: resolvedSex,
              age: age,
              bmi: bmi,
              whatsapp: coercePhoneLike(profileSnapshot.whatsapp ?? answers.whatsapp),
              weightKg: weightKg ? Number(weightKg) : undefined,
              heightCm: heightCm ? Number(heightCm) : undefined,
            },
            triageSlug: finalTriageSlug,
          },
          options: {
            includeAudio: serverEnv.TTS_ENABLED,
          }
        }, { persist: true });

        // Persiste relatório como completed + marca sessão concluída
        const { error: persistError } = await supabase
          .from("triage_reports")
          .upsert({
            triage_id: triageId,
            status: "completed",
            sections: reportDTO ?? {},
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'triage_id'
          });

        if (persistError) {
          console.error(`[finalize] Failed to persist report:`, persistError);
          // Marcar como failed em caso de erro
          await supabase
            .from("triage_reports")
            .update({
              status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("triage_id", triageId);
          return;
        }

        await supabase
          .from("triage_sessions")
          .update({ completed_at: new Date().toISOString() })
          .eq("triage_id", triageId);

        console.log(`[finalize] Successfully finalized triageId: ${triageId}, triageSlug: ${finalTriageSlug}`);

        if (sessionRow.profile_id) {
          advanceLead({
            profileId: sessionRow.profile_id,
            productSlug: finalTriageSlug,
            triageSlug: finalTriageSlug,
            step: 'report_ready',
            source: 'finalize',
          }).catch((e) => console.warn('[finalize] advanceLead:', e));
        }

        if (process.env.EVOLUTION_MAGIC_LINK_ENABLED === 'true' || process.env.EVOLUTION_MAGIC_LINK_ENABLED === '1') {
          (async () => {
            try {
              const profileId = sessionRow.profile_id;
              const snapshot = sessionRow.profile_snapshot ?? {};
              const answers = sessionRow.answers ?? {};
              const whatsapp = coercePhoneLike(snapshot.whatsapp ?? answers.whatsapp);
              const nome = (snapshot.name ?? answers.name ?? 'Você').toString().trim().split(' ')[0] || 'Você';

              if (!profileId || !whatsapp) return;

              const magic = await createMagicLink({
                profileId,
                redirectPath: '/dashboard',
              });
              if (!magic) return;

              const msg = `Olá ${nome}! Seu relatório MeJoy está pronto. Acesse seu painel em 1 clique: ${magic.magicUrl}`;
              const sent = await sendEvolutionMessage(String(whatsapp).trim(), msg);
              if (!sent.success) {
                console.warn('[finalize] Evolution send failed:', sent.error);
              }
            } catch (e) {
              console.warn('[finalize] Magic Link/Evolution error (non-blocking):', e);
            }
          })();
        }
      } catch (error: any) {
        console.error(`[finalize] Error generating report asynchronously for triageId: ${triageId}:`, error);
        console.error(`[finalize] Error stack:`, error?.stack);
        console.error(`[finalize] Error message:`, error?.message);
        
        // Marcar como failed em caso de erro
        try {
          const { error: updateError } = await supabase
            .from("triage_reports")
            .update({
              status: "failed",
              updated_at: new Date().toISOString()
            })
            .eq("triage_id", triageId);
          
          if (updateError) {
            console.error(`[finalize] Failed to mark as failed:`, updateError);
          } else {
            console.log(`[finalize] Marked report as failed for triageId: ${triageId}`);
          }
        } catch (updateError) {
          console.error(`[finalize] Exception while marking as failed:`, updateError);
        }
      }
    }).catch((error) => {
      console.error(`[finalize] Unhandled error in async generation:`, error);
    });

    // Retornar imediatamente com status "running" para que o frontend faça polling
    return res.status(200).json({ ok: true, status: 'running', redirect: null });
  } catch (e: any) {
    console.error(`[finalize] Error:`, e);
    return res.status(500).json({ error: e?.message ?? "internal error" });
  }
}
