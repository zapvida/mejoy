import { createClient } from "@supabase/supabase-js";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { ReportViewModel } from "@/lib/report/derive";
import { HeaderZapfarm } from "@/components/zapfarm/emagrecimento/HeaderZapfarm";
import { EmagrecimentoCheckoutExperience } from "@/components/checkout/EmagrecimentoCheckoutExperience";
import { ReportAnalysisEmagrecimento } from "@/components/zapfarm/report/ReportAnalysisEmagrecimento";
import { ReportEvidenceEmagrecimento } from "@/components/zapfarm/report/ReportEvidenceEmagrecimento";
import { ReportCtasEmagrecimento } from "@/components/zapfarm/report/ReportCtasEmagrecimento";
import { ReportScientificFactsEmagrecimento } from "@/components/zapfarm/report/ReportScientificFactsEmagrecimento";
import { ReportRedFlagsBanner } from "@/components/zapfarm/report/ReportRedFlagsBanner";
import { ReportPrePrescription } from "@/components/zapfarm/report/ReportPrePrescription";
import { ReportDecisionFold } from "@/components/zapfarm/emagrecimento/ReportDecisionFold";
import {
  emagrecimentoLegalNote,
  planIdMapping,
  type EmagrecimentoPlan,
} from "@/config/zapfarm/emagrecimento-plans";
import { getMedicationTrackCard } from "@/lib/emagrecimento/medicationCards";
import { getRecommendedPlan } from "@/lib/emagrecimento/planRecommendation";
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from "@/lib/emagrecimento/checkoutUrls";
import {
  buildEmagrecimentoCheckoutPlanCatalog,
  getEmagrecimentoPlanFromCatalog,
} from "@/lib/emagrecimento/checkout-plan-catalog";
import { trackFunnelEvent } from "@/lib/funnel/events-client";
import { buildEmagrecimentoReportWhatsappUrl } from "@/lib/emagrecimento/whatsappCta";
import { EMAGRECIMENTO_REPORT_ASSETS } from "@/lib/emagrecimento-lp-assets";
import { getSupabaseServerConfig } from "@/lib/supabase/runtime-config";

interface RelatorioEmagrecimentoProps {
  vm: ReportViewModel | null;
  reportId: string | null;
  planCatalog: EmagrecimentoPlan[];
  checkoutIsTestMode?: boolean;
  error?: string;
}

async function resolveTriageId(supabase: any, id: string): Promise<string> {
  const sessionQuery = await supabase
    .from("triage_sessions")
    .select("triage_id")
    .eq("triage_id", id)
    .maybeSingle();
  const sessionMatch = sessionQuery.data as { triage_id?: string } | null;

  if (sessionMatch?.triage_id) return sessionMatch.triage_id;

  const reportQuery = await supabase
    .from("triage_reports")
    .select("triage_id")
    .eq("id", id)
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
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 text-xl font-light text-slate-700 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="border-t border-zinc-100 px-5 py-5 sm:px-6 sm:py-6">
        {children}
      </div>
    </details>
  );
}

function buildOutcomeHighlights(vm: ReportViewModel, comorbidades: string[]) {
  const weightKg = vm.basics.weightKg;
  const bmi = vm.basics.bmi;
  const estimatedFivePercent = weightKg
    ? Math.round(weightKg * 0.05 * 10) / 10
    : null;
  const estimatedTenPercent = weightKg
    ? Math.round(weightKg * 0.1 * 10) / 10
    : null;

  return [
    {
      title: "Primeiro marco clínico útil",
      body:
        estimatedFivePercent && estimatedTenPercent
          ? `Para o seu peso atual, perder algo perto de ${estimatedFivePercent} a ${estimatedTenPercent} kg já costuma entrar na faixa em que pressão, glicose, fígado gorduroso e disposição podem começar a melhorar.`
          : "Mesmo perdas de 5% a 10% do peso corporal já costumam produzir melhora relevante em risco cardiometabólico e qualidade de vida.",
    },
    {
      title: "Resultado não é só estético",
      body:
        bmi >= 30
          ? "Com IMC nessa faixa, o ganho clínico mais importante costuma ser reduzir carga inflamatória, fome excessiva, oscilação de energia e risco cardiovascular acumulado."
          : "Mesmo antes de chegar a uma grande mudança de peso, melhorar saciedade, sono, energia e constância já costuma ser um sinal de que a estratégia está funcionando.",
    },
    {
      title:
        comorbidades.length > 0
          ? "O impacto tende a ser sistêmico"
          : "O efeito costuma aparecer em múltiplas frentes",
      body:
        comorbidades.length > 0
          ? "Quando o excesso de peso se mistura com glicose alterada, pressão alta, apneia, dislipidemia ou fígado gorduroso, pequenas reduções sustentadas já podem aliviar várias frentes ao mesmo tempo."
          : "Peso, apetite, sono, mobilidade e energia costumam responder juntos. Isso ajuda a paciente perceber valor cedo, antes mesmo do resultado final na balança.",
    },
  ];
}

function buildCardiometabolicHighlights(
  vm: ReportViewModel,
  answers: Record<string, any>,
  comorbidades: string[],
) {
  const pressure = answers.pressao_arterial_faixa as string | undefined;
  const lifeImpact = answers.impacto_vida as string | undefined;
  const hasHypertension = comorbidades.some((item) =>
    item.includes("hipertens"),
  );
  const hasDiabetes = comorbidades.some(
    (item) => item.includes("diabetes") || item.includes("pre_diabetes"),
  );
  const hasSleepApnea = comorbidades.some((item) => item.includes("apneia"));

  return [
    {
      title: "Coração e vasos",
      body:
        hasHypertension || pressure
          ? "Se pressão já entra na conversa, o controle de peso deixa de ser só estética e passa a ser estratégia para reduzir sobrecarga cardiovascular ao longo do tempo."
          : "Peso e composição corporal influenciam pressão, frequência cardíaca, inflamação e condicionamento. Por isso o risco cardiovascular entra cedo na leitura do relatório.",
    },
    {
      title: "Glicose e energia",
      body: hasDiabetes
        ? "Quando há diabetes ou pré-diabetes, perder peso e ganhar saciedade costuma melhorar glicose, reduzir picos de fome e simplificar a rotina terapêutica."
        : "Mesmo sem diabetes declarado, melhorar sensibilidade à insulina costuma ajudar fome, energia depois das refeições e consistência ao longo do dia.",
    },
    {
      title: "Sono, apetite e recuperação",
      body:
        hasSleepApnea || lifeImpact === "alto" || lifeImpact === "muito_alto"
          ? "Sono ruim, fadiga e apneia podem amplificar fome, compulsão e dificuldade de manter hábito. Tratar peso e rotina juntos costuma destravar esse ciclo."
          : "Sono e recuperação interferem diretamente em grelina, leptina e disposição. Sem isso, até o melhor plano perde eficiência na prática.",
    },
  ];
}

function buildLifestyleHighlights(answers: Record<string, any>) {
  const objective = answers.objetivo_principal as string | undefined;
  const preference = answers.preferencia_principio_ativo as string | undefined;

  return [
    {
      title: "Proteger sono e fome no mesmo movimento",
      body: "Sono curto costuma piorar fome, impulsividade alimentar e energia. Organizar janela de sono é uma das alavancas mais subestimadas do resultado.",
    },
    {
      title:
        "Comida com mais proteína e fibra costuma sustentar melhor a jornada",
      body: "Saciedade verdadeira normalmente depende mais da composição da refeição do que da força de vontade isolada. Proteína, fibra e regularidade ajudam muito.",
    },
    {
      title:
        preference === "contrave"
          ? "Rotina e comportamento importam ainda mais na trilha oral"
          : "Medicação ajuda, mas não substitui o sistema ao redor",
      body:
        objective === "perder_peso_rapido"
          ? "Buscar velocidade sem estrutura costuma aumentar rebote. O que protege faturamento recorrente e saúde real é construir um método que o paciente aguente repetir."
          : "O melhor cenário continua sendo combinar conduta médica, rotina viável, ambiente alimentar menos caótico e algum movimento regular ao longo da semana.",
    },
  ];
}

export default function RelatorioEmagrecimentoPage({
  vm,
  reportId,
  planCatalog: _planCatalog,
  checkoutIsTestMode = false,
  error,
}: RelatorioEmagrecimentoProps) {
  const answers = vm ? (vm as any).answers || {} : {};
  const classification = vm
    ? ((vm as any).classification as
        | "candidato_glp1"
        | "nao_indicado"
        | "contraindicado"
        | undefined)
    : undefined;
  const preferenciaPrincipioAtivo = answers.preferencia_principio_ativo as
    | string
    | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidadesRaw = answers.comorbidades;
  const comorbidades = useMemo(
    () =>
      Array.isArray(comorbidadesRaw)
        ? comorbidadesRaw.filter((item: string) => item !== "nenhuma")
        : [],
    [comorbidadesRaw],
  );
  const defaultTrilha = useMemo(
    () => trilhaFromPreferencia(preferenciaPrincipioAtivo),
    [preferenciaPrincipioAtivo],
  );
  const recommendedPlanLegacy = useMemo(
    () =>
      classification
        ? getRecommendedPlan(classification, impactoVida, comorbidades)
        : "trimestral",
    [classification, impactoVida, comorbidades],
  );
  const defaultPlanId = useMemo(
    () =>
      planIdMapping[recommendedPlanLegacy as keyof typeof planIdMapping] ||
      "programa-3m",
    [recommendedPlanLegacy],
  );

  const [selectedTrilha, setSelectedTrilha] =
    useState<EmagrecimentoTrilha>(defaultTrilha);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlanId);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const dynamicPlanCatalog = useMemo(
    () =>
      buildEmagrecimentoCheckoutPlanCatalog(
        selectedTrilha,
        preferenciaPrincipioAtivo,
      ).planCatalog,
    [preferenciaPrincipioAtivo, selectedTrilha],
  );
  const selectedPlan =
    getEmagrecimentoPlanFromCatalog(dynamicPlanCatalog, selectedPlanId) ||
    dynamicPlanCatalog[1] ||
    null;
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);
  const outcomeHighlights = useMemo(
    () => (vm ? buildOutcomeHighlights(vm, comorbidades) : []),
    [vm, comorbidades],
  );
  const cardiometabolicHighlights = useMemo(
    () => (vm ? buildCardiometabolicHighlights(vm, answers, comorbidades) : []),
    [vm, answers, comorbidades],
  );
  const lifestyleHighlights = useMemo(
    () => buildLifestyleHighlights(answers),
    [answers],
  );

  const defaultsForSelectionRef = useRef({ defaultTrilha, defaultPlanId });
  defaultsForSelectionRef.current = { defaultTrilha, defaultPlanId };

  useEffect(() => {
    if (!reportId) return;
    trackFunnelEvent("report_viewed", { report_id: reportId });
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
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openInlineCheckout = () => {
    if (!reportId) return;
    if (!checkoutOpen) {
      trackFunnelEvent("report_inline_checkout_opened", {
        report_id: reportId,
        triage_id: vm?.triageId || reportId,
        plano: selectedPlanId,
        trilha: selectedTrilha,
      });
    }
    setCheckoutOpen(true);
    window.setTimeout(() => scrollToSection("report-inline-checkout"), 80);
  };

  const editSelection = () => {
    window.setTimeout(() => scrollToSection("report-planos"), 80);
  };

  if (error || !vm) {
    return (
      <>
        <Head>
          <title>Relatório não encontrado | MeJoy</title>
        </Head>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">
              Relatório não encontrado
            </h1>
            <p className="text-emerald-50 mb-6">
              O relatório solicitado não foi encontrado.
            </p>
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
        <title>Relatório de Emagrecimento | MeJoy</title>
        <meta
          name="description"
          content={`Relatório personalizado de emagrecimento para ${vm.basics.firstName}`}
        />
      </Head>

      <div className="min-h-screen bg-[#faf7f1]">
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
              {checkoutOpen ? "Voltar ao checkout" : "Continuar com meu plano"}
            </button>
            <a
              href={buildEmagrecimentoReportWhatsappUrl({
                reportId: reportId || "",
                firstName: vm.basics.firstName,
                triageSlug: "emagrecimento",
              })}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackFunnelEvent("whatsapp_report_cta", {
                  report_id: reportId,
                  surface: "sticky_mobile",
                })
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
                  typeof r === "string" ? r : r.title || r.message || String(r),
                )}
                classification={(vm as any).classification}
              />
            )}

            <section className="overflow-hidden rounded-[32px] border border-[#d7e3da] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
              <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
                <div className="p-5 sm:p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Autoridade e confiança
                  </p>
                  <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                    Por que pacientes escolhem a MeJoy antes de iniciar
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    O pagamento confirma sua entrada no programa, mas a decisão
                    sobre medicação, dose, exames e continuidade continua sendo
                    feita por médico habilitado. Antes do preço, o valor real é
                    este: avaliação médica, WhatsApp oficial, dashboard,
                    suporte, orientação clínica e política clara antes de
                    qualquer envio.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      "Avaliação médica antes de qualquer prescrição",
                      "Medicamentos originais quando prescritos e indicados",
                      "Entrega expressa em regiões atendidas, após confirmação logística",
                      "Dados protegidos e contato oficial pelo WhatsApp",
                      "Dashboard liberado após pagamento confirmado",
                      "Reembolso antes do envio se a conduta esperada não for indicada",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-[20px] border border-[#e3e7df] bg-[#fafbf8] px-4 py-3 text-sm text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 border-t border-[#d7e3da] bg-[#f6f7f1] p-5 sm:p-6 md:p-8 lg:border-l lg:border-t-0">
                  <div className="relative aspect-[1.72] overflow-hidden rounded-[28px] border border-white bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.07)]">
                    <div className="relative h-full w-full overflow-hidden rounded-[20px]">
                      <Image
                        src={EMAGRECIMENTO_REPORT_ASSETS.socialProofWide}
                        alt="Espaço reservado para reel de prova social"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 36vw"
                      />
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-dashed border-[#d7e3da] bg-white px-4 py-4 text-sm text-slate-600">
                    Garantia de conduta segura: se a avaliação médica concluir
                    que a terapia esperada não é indicada, nenhuma medicação é
                    enviada sem sua concordância. Você pode seguir por protocolo
                    alternativo ou solicitar reembolso integral antes do envio,
                    conforme política aplicável.
                  </div>
                </div>
              </div>
            </section>

            <section id="report-planos" className="scroll-mt-28">
              <ReportCtasEmagrecimento
                reportId={reportId || ""}
                preferenciaPrincipioAtivo={preferenciaPrincipioAtivo}
                vm={vm}
                selectedPlanId={selectedPlanId}
                selectedTrilha={selectedTrilha}
                onSelectPlan={setSelectedPlanId}
                onOpenInlineCheckout={openInlineCheckout}
                planCatalog={dynamicPlanCatalog}
              />
            </section>

            <section id="report-inline-checkout" className="scroll-mt-28">
              {!checkoutOpen ? (
                <div className="rounded-[32px] border border-[#d7e3da] bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-8">
                  <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                        Pagamento nesta página
                      </p>
                      <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                        O pagamento continua no mesmo lugar do seu relatório
                      </h2>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        Seus dados da triagem entram preenchidos, o PIX ou
                        cartão aparece aqui mesmo e o painel só é liberado
                        quando o pagamento for realmente confirmado.
                      </p>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">
                            Plano selecionado
                          </p>
                          <p className="mt-2 text-slate-600">
                            {selectedPlan?.title || selectedPlanId}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">
                            Trilha clínica
                          </p>
                          <p className="mt-2 text-slate-600">
                            {selectedTrackCard.title}
                          </p>
                          <p className="mt-2 text-xs font-semibold text-emerald-700">
                            {selectedTrackCard.potencyLabel}
                          </p>
                        </div>
                        <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                          <p className="text-sm font-bold text-slate-900">
                            Acesso ao painel
                          </p>
                          <p className="mt-2 text-slate-600">
                            Liberado automaticamente após a confirmação do
                            pagamento.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-[24px] border border-[#dbe4d7] bg-[linear-gradient(180deg,#fbfcfa_0%,#f2f6ef_100%)] p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          O que acontece depois do clique
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {[
                            "Pagamento abre aqui, sem tirar você do relatório.",
                            "O PIX continua no mesmo fluxo com orientação clara.",
                            "Dashboard abre só após confirmação real do pagamento.",
                          ].map((item) => (
                            <div
                              key={item}
                              className="rounded-[20px] border border-[#e3e7df] bg-white px-4 py-3 text-sm text-slate-700"
                            >
                              {item}
                            </div>
                          ))}
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
                      {EMAGRECIMENTO_REPORT_ASSETS.inlineCheckoutCards.map(
                        (item) => (
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
                              <p className="text-sm font-bold text-slate-900">
                                {item.title}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
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
                    name: vm.basics.name || vm.basics.firstName || "",
                    weightKg: vm.basics.weightKg,
                  }}
                  onRequestEditSelection={editSelection}
                  planCatalog={dynamicPlanCatalog}
                  isTestMode={checkoutIsTestMode}
                />
              )}
            </section>

            <section
              aria-label="Conteudo clinico detalhado"
              className="space-y-4"
            >
              <ReportAccordionSection
                title="Seu quadro hoje"
                description="Leitura aprofundada do caso, mantida fora da zona principal de fechamento."
              >
                <ReportAnalysisEmagrecimento vm={vm} />
              </ReportAccordionSection>

              <ReportAccordionSection
                title="O que muda quando o peso começa a ceder"
                description="Marcos clínicos que costumam aparecer antes mesmo do resultado final desejado."
              >
                <div className="grid gap-4 lg:grid-cols-3">
                  {outcomeHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-[#e1e8df] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8f4_100%)] p-5"
                    >
                      <p className="text-lg font-bold text-slate-950">
                        {item.title}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-700">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </ReportAccordionSection>

              <ReportAccordionSection
                title="Impacto em risco cardiometabólico"
                description="Por que pressão, glicose, sono, fadiga e risco cardiovascular entram no centro da conversa."
              >
                <div className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {cardiometabolicHighlights.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-[#e1e8df] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8f4_100%)] p-5"
                      >
                        <p className="text-lg font-bold text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                  <ReportEvidenceEmagrecimento vm={vm} />
                </div>
              </ReportAccordionSection>

              <ReportAccordionSection
                title="Hábitos que aceleram resultado"
                description="Ajustes simples de rotina que costumam proteger adesão, saciedade e recuperação."
              >
                <div className="space-y-6">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {lifestyleHighlights.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-[#e1e8df] bg-[linear-gradient(180deg,#ffffff_0%,#f5f8f4_100%)] p-5"
                      >
                        <p className="text-lg font-bold text-slate-950">
                          {item.title}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">
                          {item.body}
                        </p>
                      </div>
                    ))}
                  </div>
                  <ReportScientificFactsEmagrecimento
                    vm={vm}
                    reportId={reportId || undefined}
                  />
                </div>
              </ReportAccordionSection>

              <ReportAccordionSection
                title="Medicação quando indicada"
                description="Resumo médico preliminar e pontos de segurança para a consulta."
              >
                <ReportPrePrescription vm={vm} />
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

export const getServerSideProps: GetServerSideProps<
  RelatorioEmagrecimentoProps
> = async ({ query }) => {
  const id = query.id as string | undefined;
  const { planCatalog, isTestMode: checkoutIsTestMode } =
    buildEmagrecimentoCheckoutPlanCatalog();

  if (!id) {
    return {
      props: {
        vm: null,
        reportId: null,
        planCatalog,
        checkoutIsTestMode,
        error: "ID não fornecido",
      },
    };
  }

  try {
    const { url: supabaseUrl, readKey: supabaseKey } =
      getSupabaseServerConfig();

    // Modo mock para desenvolvimento
    if (!supabaseUrl || !supabaseKey) {
      if (process.env.NODE_ENV === "development") {
        const { deriveReport } = await import("@/lib/report/derive");
        console.warn("[relatorio] Supabase não configurado, usando modo mock");

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

        console.warn(
          "[relatorio] ⚠️ MODO MOCK: Usando dados padrão. Em produção, configure Supabase para usar dados reais.",
        );
        console.warn(
          "[relatorio] 💡 Dica: Em desenvolvimento, os dados reais são usados quando você finaliza a triagem (não ao acessar o relatório diretamente).",
        );

        const vm = await deriveReport(
          {
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
              triageSlug: "emagrecimento",
            },
            options: {
              includeAudio: false,
            },
          },
          { persist: false },
        );

        (vm as any).answers = {};
        return {
          props: {
            vm,
            reportId: id,
            planCatalog,
            checkoutIsTestMode,
          },
        };
      }

      return {
        props: {
          vm: null,
          reportId: id,
          planCatalog,
          checkoutIsTestMode,
          error: "Ambiente não configurado",
        },
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const resolvedId = await resolveTriageId(supabase, id);
    const { data: sessionRow, error: sessionError } = await supabase
      .from("triage_sessions")
      .select(
        `
        *,
        triage_reports(status, sections)
      `,
      )
      .eq("triage_id", resolvedId)
      .single();

    if (sessionError || !sessionRow) {
      return {
        props: {
          vm: null,
          reportId: id,
          planCatalog,
          checkoutIsTestMode,
          error: "Sessão não encontrada",
        },
      };
    }

    const reportRow = Array.isArray(sessionRow.triage_reports)
      ? sessionRow.triage_reports[0]
      : sessionRow.triage_reports;
    const patientSnapshot = sessionRow.profile_snapshot || {};
    const answers = sessionRow.answers || {};
    const triageSlug = sessionRow.triage_slug || "emagrecimento";

    if (
      reportRow?.status === "completed" &&
      reportRow?.sections &&
      typeof reportRow.sections === "object"
    ) {
      const cached = reportRow.sections as ReportViewModel;
      if (cached?.id && cached?.basics && cached?.content) {
        (cached as any).answers = answers;
        return {
          props: {
            vm: cached,
            reportId: resolvedId,
            planCatalog,
            checkoutIsTestMode,
          },
        };
      }
    }

    // Extrair dados do snapshot e answers (priorizar snapshot)
    const weightKg =
      patientSnapshot.weight_kg ?? answers.peso ?? answers.weight ?? null;
    const heightCm =
      patientSnapshot.height_cm ?? answers.altura ?? answers.height ?? null;
    const name = patientSnapshot.name ?? answers.name ?? "Paciente";

    // Calcular idade se necessário
    let age: number | null = null;
    if (patientSnapshot.age) {
      age = patientSnapshot.age;
    } else if (patientSnapshot.birth_date) {
      const birthDate = new Date(patientSnapshot.birth_date);
      const today = new Date();
      age = Math.floor(
        (today.getTime() - birthDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365.25),
      );
    } else if (answers.idade_faixa) {
      // Converter faixa etária para idade média
      const faixaMap: Record<string, number> = {
        "18-30": 24,
        "31-45": 38,
        "46-60": 53,
        "61+": 70,
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
      bmi =
        typeof patientSnapshot.bmi === "number"
          ? patientSnapshot.bmi
          : ((patientSnapshot.bmi as any)?.bmi ?? null);
    }

    console.log("[relatorio] Dados recuperados:", {
      name,
      weightKg,
      heightCm,
      bmi,
      age,
      sex: patientSnapshot.sex || answers.sex,
    });

    const { deriveReport } = await import("@/lib/report/derive");
    const vm = await deriveReport(
      {
        triageId: resolvedId,
        sessionData: {
          answers,
          profile: {
            id: resolvedId,
            name: name,
            sex: patientSnapshot.sex ?? answers.sex ?? "undisclosed",
            age: age ?? null,
            birthDate:
              patientSnapshot.birth_date ?? patientSnapshot.birthDate ?? null,
            bmi: bmi ?? null,
            whatsapp: patientSnapshot.whatsapp ?? answers.whatsapp ?? "",
            weightKg: weightKg ? Number(weightKg) : null,
            heightCm: heightCm ? Number(heightCm) : null,
          },
          triageSlug,
        },
        options: {
          includeAudio: false,
        },
      },
      { persist: false },
    );

    // Adicionar preferência ao contexto do VM para passar para o componente
    (vm as any).answers = answers;

    return {
      props: {
        vm,
        reportId: resolvedId,
        planCatalog,
        checkoutIsTestMode,
      },
    };
  } catch (error: any) {
    console.error("[relatorio] Error:", error);
    return {
      props: {
        vm: null,
        reportId: id,
        planCatalog,
        checkoutIsTestMode,
        error: error?.message || "Erro ao gerar relatório",
      },
    };
  }
};
