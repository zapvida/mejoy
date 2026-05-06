import { createClient } from '@supabase/supabase-js';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ReportViewModel } from '@/lib/report/derive';
import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { EmagrecimentoCheckoutExperience } from '@/components/checkout/EmagrecimentoCheckoutExperience';
import { ReportAnalysisEmagrecimento } from '@/components/zapfarm/report/ReportAnalysisEmagrecimento';
import { ReportEvidenceEmagrecimento } from '@/components/zapfarm/report/ReportEvidenceEmagrecimento';
import { ReportCtasEmagrecimento } from '@/components/zapfarm/report/ReportCtasEmagrecimento';
import { ReportScientificFactsEmagrecimento } from '@/components/zapfarm/report/ReportScientificFactsEmagrecimento';
import { ReportRedFlagsBanner } from '@/components/zapfarm/report/ReportRedFlagsBanner';
import { ReportPrePrescription } from '@/components/zapfarm/report/ReportPrePrescription';
import { ReportDecisionFold } from '@/components/zapfarm/emagrecimento/ReportDecisionFold';
import {
  emagrecimentoLegalNote,
  getPlanById,
  planIdMapping,
} from '@/config/zapfarm/emagrecimento-plans';
import { getMedicationTrackCard } from '@/lib/emagrecimento/medicationCards';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import { getSupabaseServerConfig } from '@/lib/supabase/runtime-config';

interface RelatorioEmagrecimentoProps {
  vm: ReportViewModel | null;
  reportId: string | null;
  error?: string;
}

async function resolveTriageId(
  supabase: any,
  id: string
): Promise<string> {
  const sessionQuery = await supabase
    .from('triage_sessions')
    .select('triage_id')
    .eq('triage_id', id)
    .maybeSingle();
  const sessionMatch = sessionQuery.data as { triage_id?: string } | null;

  if (sessionMatch?.triage_id) return sessionMatch.triage_id;

  const reportQuery = await supabase
    .from('triage_reports')
    .select('triage_id')
    .eq('id', id)
    .maybeSingle();
  const reportMatch = reportQuery.data as { triage_id?: string } | null;

  return reportMatch?.triage_id || id;
}

function ReportAccordionSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-[28px] border border-zinc-200 bg-white open:shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div>
          <p className="text-lg font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 text-xl font-light text-slate-700 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-zinc-100 px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </details>
  );
}

export default function RelatorioEmagrecimentoPage({ vm, reportId, error }: RelatorioEmagrecimentoProps) {
  const answers = vm ? (vm as any).answers || {} : {};
  const classification = vm
    ? ((vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined)
    : undefined;
  const preferenciaPrincipioAtivo = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidadesRaw = answers.comorbidades;
  const comorbidades = useMemo(
    () =>
      Array.isArray(comorbidadesRaw)
        ? comorbidadesRaw.filter((item: string) => item !== 'nenhuma')
        : [],
    [comorbidadesRaw]
  );
  const defaultTrilha = useMemo(
    () => trilhaFromPreferencia(preferenciaPrincipioAtivo),
    [preferenciaPrincipioAtivo]
  );
  const recommendedPlanLegacy = useMemo(
    () =>
      classification ? getRecommendedPlan(classification, impactoVida, comorbidades) : 'trimestral',
    [classification, impactoVida, comorbidades]
  );
  const defaultPlanId = useMemo(
    () => planIdMapping[recommendedPlanLegacy as keyof typeof planIdMapping] || 'programa-3m',
    [recommendedPlanLegacy]
  );

  const [selectedTrilha, setSelectedTrilha] = useState<EmagrecimentoTrilha>(defaultTrilha);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const selectedPlan = getPlanById(selectedPlanId);
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);

  const defaultsForSelectionRef = useRef({ defaultTrilha, defaultPlanId });
  defaultsForSelectionRef.current = { defaultTrilha, defaultPlanId };

  useEffect(() => {
    if (!reportId) return;
    trackFunnelEvent('report_viewed', { report_id: reportId });
  }, [reportId]);

  /** Só quando `reportId` muda: snapshot atual dos defaults (evita resets por memos instáveis). */
  useEffect(() => {
    if (!reportId) return;
    const snap = defaultsForSelectionRef.current;
    setSelectedTrilha(snap.defaultTrilha);
    setSelectedPlanId(snap.defaultPlanId);
  }, [reportId]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openInlineCheckout = () => {
    if (!reportId) return;
    if (!checkoutOpen) {
      trackFunnelEvent('report_inline_checkout_opened', {
        report_id: reportId,
        triage_id: vm?.triageId || reportId,
        plano: selectedPlanId,
        trilha: selectedTrilha,
      });
    }
    setCheckoutOpen(true);
    window.setTimeout(() => scrollToSection('report-inline-checkout'), 80);
  };

  const editSelection = () => {
    window.setTimeout(() => scrollToSection('report-planos'), 80);
  };

  if (error || !vm) {
    return (
      <>
        <Head>
        <title>Relatório não encontrado | Me Joy</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Relatório não encontrado</h1>
            <p className="text-emerald-50 mb-6">O relatório solicitado não foi encontrado.</p>
            <a
              href="/emagrecimento"
              className="inline-block px-6 py-3 bg-white text-emerald-800 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
            >
              Voltar para início
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Relatório de Emagrecimento | Me Joy</title>
        <meta name="description" content={`Relatório personalizado de emagrecimento para ${vm.basics.firstName}`} />
      </Head>

      <div className="min-h-screen bg-[#f4f7f2]">
        <div className="relative z-50">
          <HeaderZapfarm
            primaryCtaHref="#report-inline-checkout"
            primaryCtaLabel="Continuar com meu plano"
            primaryCtaMobileLabel="Continuar"
            primaryCtaOnClick={openInlineCheckout}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white/96 p-3.5 shadow-[0_-12px_40px_rgba(15,23,42,0.16)] backdrop-blur md:hidden">
          <div className="space-y-2">
            <button
              type="button"
              onClick={openInlineCheckout}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md"
            >
              {checkoutOpen ? 'Voltar ao checkout' : 'Continuar com meu plano'}
            </button>
            <a
              href={buildEmagrecimentoReportWhatsappUrl({
                reportId: reportId || '',
                firstName: vm.basics.firstName,
                triageSlug: 'emagrecimento',
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackFunnelEvent('whatsapp_report_cta', { report_id: reportId, surface: 'sticky_mobile' })
              }
              className="block text-center text-sm font-semibold text-emerald-800 underline underline-offset-2"
            >
              WhatsApp oficial
            </a>
          </div>
        </div>

        <main className="pb-32 pt-20 sm:pt-24 md:pb-14 md:pt-24">
          <div className="container mx-auto space-y-8 px-4 py-6 sm:px-6 sm:py-8 md:space-y-10">
            {reportId && (
              <ReportDecisionFold
                vm={vm}
                reportId={reportId}
                selectedTrilha={selectedTrilha}
                onSelectTrack={setSelectedTrilha}
                onOpenInlineCheckout={openInlineCheckout}
              />
            )}

            {vm.context.redFlags && vm.context.redFlags.length > 0 && (
              <ReportRedFlagsBanner
                redFlags={vm.context.redFlags.map((r: any) =>
                  typeof r === 'string' ? r : r.title || r.message || String(r)
                )}
                classification={(vm as any).classification}
              />
            )}

            <section id="report-planos" className="scroll-mt-28">
              <ReportCtasEmagrecimento
                reportId={reportId || ''}
                preferenciaPrincipioAtivo={preferenciaPrincipioAtivo}
                vm={vm}
                selectedPlanId={selectedPlanId}
                selectedTrilha={selectedTrilha}
                onSelectPlan={setSelectedPlanId}
                onOpenInlineCheckout={openInlineCheckout}
              />
            </section>

            <section id="report-inline-checkout" className="scroll-mt-28">
              {!checkoutOpen ? (
                <div className="rounded-[32px] border border-[#d7e3da] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-8">
                  <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                        Fechamento nesta página
                      </p>
                      <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                        Continue seu plano sem sair desta página
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Seus dados da triagem já entram preenchidos. O PIX (ou cartão) aparece aqui mesmo e o seu painel é liberado automaticamente assim que o pagamento é confirmado.
                      </p>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">Plano selecionado</p>
                          <p className="mt-2 text-slate-600">{selectedPlan?.title || selectedPlanId}</p>
                        </div>
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">Trilha clínica</p>
                          <p className="mt-2 text-slate-600">{selectedTrackCard.title}</p>
                          <p className="mt-2 text-xs font-semibold text-emerald-700">
                            {selectedTrackCard.potencyLabel}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">Acesso ao painel</p>
                          <p className="mt-2 text-slate-600">Liberado automaticamente após a confirmação do pagamento.</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <button
                          type="button"
                          onClick={openInlineCheckout}
                          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                        >
                          Continuar com meu plano
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        {
                          src: '/images/emagrecimento/medvi/journey-triagem.avif',
                          alt: 'Triagem concluída',
                          title: 'Triagem aproveitada',
                        },
                        {
                          src: '/images/emagrecimento/medvi/journey-consulta.avif',
                          alt: 'Consulta médica online',
                          title: 'Consulta valida a conduta',
                        },
                        {
                          src: '/images/emagrecimento/medvi/support-whatsapp.avif',
                          alt: 'Suporte oficial no WhatsApp',
                          title: 'Suporte oficial pós-pagamento',
                        },
                      ].map((item) => (
                        <div
                          key={item.src}
                          className="overflow-hidden rounded-[28px] border border-zinc-200 bg-[#f8faf8] shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                        >
                          <div className="relative aspect-[0.92] overflow-hidden">
                            <Image
                              src={item.src}
                              alt={item.alt}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 18vw"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm font-bold text-slate-900">{item.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <EmagrecimentoCheckoutExperience
                  mode="inline"
                  selectionVariant="locked"
                  reportId={reportId}
                  triageId={vm.triageId || reportId}
                  defaultPlanId={selectedPlanId}
                  defaultTrilha={selectedTrilha}
                  defaultPrincipio={preferenciaPrincipioAtivo}
                  prefillProfile={{
                    name: vm.basics.name || vm.basics.firstName || '',
                    weightKg: vm.basics.weightKg,
                  }}
                  onRequestEditSelection={editSelection}
                />
              )}
            </section>

            <section aria-label="Conteudo clinico detalhado" className="space-y-4">
              <ReportAccordionSection
                title="Analise detalhada do relatorio"
                description="Leitura aprofundada do seu caso, mantida fora da zona principal de fechamento."
              >
                <ReportAnalysisEmagrecimento vm={vm} />
              </ReportAccordionSection>

              <ReportAccordionSection
                title="Pre-prescricao e criterios clinicos"
                description="Resumo medico preliminar e pontos de seguranca para consulta."
              >
                <ReportPrePrescription vm={vm} />
              </ReportAccordionSection>

              <ReportAccordionSection
                title="Evidencias e referencias"
                description="Base cientifica resumida para quem quiser revisar os fundamentos do programa."
              >
                <div className="space-y-8">
                  <ReportEvidenceEmagrecimento vm={vm} />
                  <ReportScientificFactsEmagrecimento vm={vm} reportId={reportId || undefined} />
                </div>
              </ReportAccordionSection>
            </section>

            <section className="rounded-[28px] border border-zinc-200 bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Informações importantes
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {emagrecimentoLegalNote}
                  </p>
                </div>
                <a
                  href={`/api/pdf/report?id=${reportId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Baixar PDF do relatório
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RelatorioEmagrecimentoProps> = async ({ query }) => {
  const id = query.id as string | undefined;

  if (!id) {
    return { props: { vm: null, reportId: null, error: 'ID não fornecido' } };
  }

  try {
    const { url: supabaseUrl, readKey: supabaseKey } = getSupabaseServerConfig();

    // Modo mock para desenvolvimento
    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === 'development') {
        const { deriveReport } = await import('@/lib/report/derive');
        console.warn('[relatorio] Supabase não configurado, usando modo mock');
        
        // Em modo mock, os dados já foram processados no finalize
        // O relatório foi gerado lá, então aqui apenas retornamos erro
        // para forçar o usuário a passar pelo fluxo correto
        // OU podemos tentar gerar novamente com dados padrão
        
        // Por enquanto, usar dados padrão mas avisar que em produção precisa Supabase
        const mockProfile = {
          name: "Paciente",
          sex: "M" as const,
          age: 35,
          birthDateISO: "1990-01-01",
          weightKg: 75,
          heightCm: 170,
          whatsapp: "",
        };

        console.warn('[relatorio] ⚠️ MODO MOCK: Usando dados padrão. Em produção, configure Supabase para usar dados reais.');
        console.warn('[relatorio] 💡 Dica: Em desenvolvimento, os dados reais são usados quando você finaliza a triagem (não ao acessar o relatório diretamente).');

        const vm = await deriveReport({
          triageId: id,
          sessionData: {
            answers: {},
            profile: {
              name: mockProfile.name,
              sex: mockProfile.sex,
              age: mockProfile.age,
              birthDate: mockProfile.birthDateISO,
              weightKg: mockProfile.weightKg,
              heightCm: mockProfile.heightCm,
              whatsapp: mockProfile.whatsapp,
            },
            triageSlug: 'emagrecimento',
          },
          options: {
            includeAudio: false,
          },
        }, { persist: false });

        (vm as any).answers = {};
        return { props: { vm, reportId: id } };
      }
      
      return { props: { vm: null, reportId: id, error: 'Ambiente não configurado' } };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resolvedId = await resolveTriageId(supabase, id);
    const { data: sessionRow, error: sessionError } = await supabase
      .from('triage_sessions')
      .select(`
        *,
        triage_reports(status, sections)
      `)
      .eq('triage_id', resolvedId)
      .single();

    if (sessionError || !sessionRow) {
      return { props: { vm: null, reportId: id, error: 'Sessão não encontrada' } };
    }

    const reportRow = Array.isArray(sessionRow.triage_reports)
      ? sessionRow.triage_reports[0]
      : sessionRow.triage_reports;
    const patientSnapshot = sessionRow.profile_snapshot || {};
    const answers = sessionRow.answers || {};
    const triageSlug = sessionRow.triage_slug || 'emagrecimento';

    if (reportRow?.status === 'completed' && reportRow?.sections && typeof reportRow.sections === 'object') {
      const cached = reportRow.sections as ReportViewModel;
      if (cached?.id && cached?.basics && cached?.content) {
        (cached as any).answers = answers;
        return { props: { vm: cached, reportId: resolvedId } };
      }
    }
    
    // Extrair dados do snapshot e answers (priorizar snapshot)
    const weightKg = patientSnapshot.weight_kg ?? answers.peso ?? answers.weight ?? null;
    const heightCm = patientSnapshot.height_cm ?? answers.altura ?? answers.height ?? null;
    const name = patientSnapshot.name ?? answers.name ?? 'Paciente';
    
    // Calcular idade se necessário
    let age: number | null = null;
    if (patientSnapshot.age) {
      age = patientSnapshot.age;
    } else if (patientSnapshot.birth_date) {
      const birthDate = new Date(patientSnapshot.birth_date);
      const today = new Date();
      age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    } else if (answers.idade_faixa) {
      // Converter faixa etária para idade média
      const faixaMap: Record<string, number> = {
        '18-30': 24,
        '31-45': 38,
        '46-60': 53,
        '61+': 70
      };
      age = faixaMap[answers.idade_faixa] ?? null;
    }
    
    // Calcular IMC se tivermos peso e altura
    let bmi: number | null = null;
    if (weightKg && heightCm && heightCm > 0 && weightKg > 0) {
      const heightM = heightCm / 100;
      bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    } else if (patientSnapshot.bmi) {
      // Se já existe IMC calculado, usar ele
      bmi = typeof patientSnapshot.bmi === 'number' 
        ? patientSnapshot.bmi 
        : (patientSnapshot.bmi as any)?.bmi ?? null;
    }
    
    console.log('[relatorio] Dados recuperados:', {
      name,
      weightKg,
      heightCm,
      bmi,
      age,
      sex: patientSnapshot.sex || answers.sex
    });

    const { deriveReport } = await import('@/lib/report/derive');
    const vm = await deriveReport({
      triageId: resolvedId,
      sessionData: {
        answers,
        profile: {
          id: resolvedId,
          name: name,
          sex: patientSnapshot.sex ?? answers.sex ?? 'undisclosed',
          age: age ?? null,
          birthDate: patientSnapshot.birth_date ?? patientSnapshot.birthDate ?? null,
          bmi: bmi ?? null,
          whatsapp: patientSnapshot.whatsapp ?? answers.whatsapp ?? '',
          weightKg: weightKg ? Number(weightKg) : null,
          heightCm: heightCm ? Number(heightCm) : null,
        },
        triageSlug,
      },
      options: {
        includeAudio: false,
      },
    }, { persist: false });

    // Adicionar preferência ao contexto do VM para passar para o componente
    (vm as any).answers = answers;

    return { props: { vm, reportId: resolvedId } };
  } catch (error: any) {
    console.error('[relatorio] Error:', error);
    return { props: { vm: null, reportId: id, error: error?.message || 'Erro ao gerar relatório' } };
  }
};
