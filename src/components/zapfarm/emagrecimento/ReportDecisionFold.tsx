"use client";

import Image from "next/image";
import type { ReportViewModel } from "@/lib/report/derive";
import { getRecommendedPlan } from "@/lib/emagrecimento/planRecommendation";
import { planIdMapping } from "@/config/zapfarm/emagrecimento-plans";
import { getResultsInvestmentBand } from "@/lib/emagrecimento/launchPricing";
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from "@/lib/emagrecimento/checkoutUrls";
import {
  estimateWeightLossRangeKg,
  getMedicationTrackCard,
  medicationTrackCards,
} from "@/lib/emagrecimento/medicationCards";
import { EMAGRECIMENTO_REPORT_ASSETS } from "@/lib/emagrecimento-lp-assets";
import { TREATMENT_TRACKS_BY_ID } from "@/lib/emagrecimento/treatmentTracks";
import { buildEmagrecimentoReportWhatsappUrl } from "@/lib/emagrecimento/whatsappCta";
import { trackFunnelEvent } from "@/lib/funnel/events-client";
import { cn } from "@/lib/utils";

interface Props {
  vm: ReportViewModel;
  reportId: string;
  selectedTrilha: EmagrecimentoTrilha;
  onSelectTrack?: (trilha: EmagrecimentoTrilha) => void;
  onOpenInlineCheckout?: () => void;
}

function getEligibilityCopy(classification: string | undefined): {
  title: string;
  body: string;
  tone: string;
} {
  switch (classification) {
    case "candidato_glp1":
      return {
        title: "Elegibilidade preliminar favoravel para seguir",
        body: "Sua triagem foi concluida e voce pode avancar para a avaliacao medica. A decisao sobre prescricao, dose e continuidade continua sendo individual e feita por medico habilitado.",
        tone: "border-emerald-200 bg-emerald-50 text-emerald-950",
      };
    case "contraindicado":
      return {
        title: "Avaliacao medica vem antes da prescricao",
        body: "Algumas respostas pedem uma leitura clinica mais cuidadosa. Voce pode confirmar o programa, mas nenhuma conduta medicamentosa segue sem validacao medica.",
        tone: "border-amber-200 bg-amber-50 text-amber-950",
      };
    default:
      return {
        title: "Plano pronto para revisao medica",
        body: "A triagem organizou seu contexto, seus objetivos e o caminho inicial. A consulta confirma o que faz sentido para o seu caso.",
        tone: "border-slate-200 bg-slate-50 text-slate-900",
      };
  }
}

export function ReportDecisionFold({
  vm,
  reportId,
  selectedTrilha,
  onSelectTrack,
  onOpenInlineCheckout,
}: Props) {
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as
    | "candidato_glp1"
    | "nao_indicado"
    | "contraindicado"
    | undefined;
  const preferencia = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== "nenhuma")
    : [];
  const recommendedLegacyPlan = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : "trimestral";
  const recommendedPlanId =
    planIdMapping[recommendedLegacyPlan as keyof typeof planIdMapping] ||
    "programa-3m";
  const investment = getResultsInvestmentBand();
  const eligibility = getEligibilityCopy(classification);
  const preferredTrack = trilhaFromPreferencia(preferencia);
  const preferredTrackTitle =
    medicationTrackCards.find((track) => track.id === preferredTrack)?.title ||
    "Definicao clinica";
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);
  const selectedTrack = TREATMENT_TRACKS_BY_ID[selectedTrilha];
  const estimatedRange = estimateWeightLossRangeKg(
    vm.basics.weightKg,
    selectedTrackCard.efficacyRangePercent,
  );

  const recommendation =
    preferencia === "tirzepatida"
      ? "Sua preferencia aponta para uma trilha de alta potencia metabolica, sujeita a confirmacao medica."
      : preferencia === "semaglutida"
        ? "Sua preferencia aponta para uma trilha de previsibilidade clinica, sujeita a confirmacao medica."
        : preferencia === "contrave"
          ? "Sua preferencia aponta para uma trilha oral estruturada, sujeita a confirmacao medica."
          : "Seu plano indica confirmar o programa agora e deixar a conduta final para a avaliacao medica.";

  const handleSelectTrack = (trilha: EmagrecimentoTrilha) => {
    trackFunnelEvent("trilha_selected", {
      report_id: reportId,
      triage_id: vm.triageId || reportId,
      trilha,
    });
    onSelectTrack?.(trilha);
  };

  const handleOpenCheckout = () => {
    trackFunnelEvent("cta_clinical_handoff", {
      report_id: reportId,
      triage_id: vm.triageId || reportId,
      surface: "decision_fold",
      trilha: selectedTrilha,
    });
    onOpenInlineCheckout?.();
  };

  return (
    <section
      className="container mx-auto px-4 pb-2 pt-4 sm:px-6"
      aria-label="Decisao do programa"
    >
      <div className="overflow-hidden rounded-[34px] border border-[#d7e3da] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-[#f3ece4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5f4b3a]">
              Plano MeJoy pronto
            </span>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[3.2rem] lg:leading-[1.02]">
              Seu Plano MeJoy esta pronto. Agora confirme o programa para seguir
              a avaliacao medica.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Sua triagem organizou contexto, caminho inicial e plano
              recomendado. Depois do pagamento confirmado, a MeJoy libera a
              jornada medica, o dashboard e os proximos passos oficiais.
            </p>

            <div
              className={cn("mt-6 rounded-[28px] border p-5", eligibility.tone)}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                Leitura principal do relatorio
              </p>
              <h2 className="mt-2 text-xl font-bold">{eligibility.title}</h2>
              <p className="mt-2 text-sm leading-relaxed sm:text-base">
                {eligibility.body}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Microvitoria da triagem
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {recommendation}
                </p>
              </div>
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Faixa de investimento
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {investment}
                </p>
                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  Plano-base sugerido:{" "}
                  {recommendedPlanId
                    .replace("programa-", "")
                    .replace("m", " meses")}
                </p>
              </div>
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Por que confirmar agora
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  O pagamento reserva sua entrada no programa e libera o
                  dashboard somente quando o status for confirmado.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1fr)_260px]">
              <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f7fbf8_0%,#eef8f2_100%)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Proximo passo agora
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  Confirmar o programa nesta pagina
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base">
                  Voce nao esta comprando uma medicacao isolada. Voce esta
                  contratando uma jornada medica com avaliacao, acompanhamento,
                  app e conduta individualizada.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={handleOpenCheckout}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
                  >
                    Confirmar meu programa agora
                  </button>
                  <p className="text-sm text-slate-600">
                    O app libera so depois da confirmacao real do pagamento.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Suporte oficial
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Se quiser validar algo antes de pagar, o WhatsApp oficial
                  entra sem quebrar a jornada.
                </p>
                <a
                  href={buildEmagrecimentoReportWhatsappUrl({
                    reportId,
                    firstName: vm.basics.firstName,
                    triageSlug: "emagrecimento",
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackFunnelEvent("whatsapp_report_cta", {
                      report_id: reportId,
                      surface: "decision_fold",
                    })
                  }
                  className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
                >
                  Falar no WhatsApp oficial
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#d7e3da] bg-[#f6f7f1] lg:border-l lg:border-t-0">
            <div className="grid h-full gap-4 p-6 sm:p-8">
              <div className="grid grid-cols-[1.02fr_0.98fr] gap-4">
                <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[0.96] overflow-hidden rounded-[22px]">
                    <Image
                      src={EMAGRECIMENTO_REPORT_ASSETS.decisionHeroPrimary}
                      alt="Programa MeJoy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 52vw, 28vw"
                      priority
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                    <div className="relative aspect-[0.82] overflow-hidden rounded-[22px]">
                      <Image
                        src={EMAGRECIMENTO_REPORT_ASSETS.decisionHeroSupport}
                        alt="Paciente MeJoy"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 44vw, 22vw"
                      />
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                    <div className="relative aspect-[1.12] overflow-hidden rounded-[22px]">
                      <Image
                        src={EMAGRECIMENTO_REPORT_ASSETS.decisionHeroSecondary}
                        alt="Suporte do programa"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 44vw, 22vw"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Preferencia atual
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {preferredTrackTitle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    O relatorio respeita sua preferencia, mas a trilha final
                    continua clinica.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Escolha atual
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {selectedTrack.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {estimatedRange
                      ? `Faixa media observada: ${estimatedRange.label}.`
                      : selectedTrack.estimate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#d7e3da] px-6 py-6 sm:px-8 lg:px-10">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Caminho inicial
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                Escolha o caminho que sera revisado pelo medico
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Cada opcao resume objetivo, intensidade e seguranca. A decisao
              final sobre prescricao continua medica.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {medicationTrackCards.map((track) => {
              const selected = selectedTrilha === track.id;
              const range = estimateWeightLossRangeKg(
                vm.basics.weightKg,
                track.efficacyRangePercent,
              );
              const trackContent = TREATMENT_TRACKS_BY_ID[track.id];
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={cn(
                    "overflow-hidden rounded-[28px] border bg-white text-left transition-all",
                    selected
                      ? "border-emerald-500 shadow-[0_20px_50px_rgba(5,150,105,0.14)]"
                      : "border-zinc-200 hover:border-emerald-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
                  )}
                >
                  <div className="relative aspect-[1.18] overflow-hidden bg-[#f3f6f3]">
                    <Image
                      src={trackContent.image}
                      alt={track.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <span className="rounded-full bg-white/92 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-sm">
                        {selected ? "Selecionado" : "Disponivel"}
                      </span>
                      <span className="rounded-full bg-emerald-950/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                        {track.potencyLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-lg font-bold text-slate-950">
                        {track.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {track.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                        {track.certaintyLabel}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm leading-relaxed text-slate-700">
                      <div>
                        <p className="font-semibold text-slate-900">Eficacia</p>
                        <p className="mt-1">{track.efficacyText}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Quanto isso pode representar
                        </p>
                        <p className="mt-1">
                          {range
                            ? range.label
                            : "A faixa real depende da dose, da adesao e da resposta individual."}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          Seguranca clinica
                        </p>
                        <p className="mt-1">{track.safetyText}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-[28px] border border-emerald-100 bg-[#f6fbf7] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Trilha selecionada agora
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">
                  {selectedTrackCard.title}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">
                  {selectedTrackCard.plainLanguageFit}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
                  {selectedTrackCard.potencyLabel}
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                  {selectedTrackCard.certaintyLabel}
                </span>
                {estimatedRange && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                    {estimatedRange.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
