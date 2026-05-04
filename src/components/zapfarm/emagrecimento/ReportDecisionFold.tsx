'use client';

import Image from 'next/image';
import type { ReportViewModel } from '@/lib/report/derive';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import { planIdMapping } from '@/config/zapfarm/emagrecimento-plans';
import { getResultsInvestmentBand } from '@/lib/emagrecimento/launchPricing';
import {
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';
import {
  estimateWeightLossRangeKg,
  getMedicationTrackCard,
  medicationTrackCards,
} from '@/lib/emagrecimento/medicationCards';
import { TREATMENT_TRACKS_BY_ID } from '@/lib/emagrecimento/treatmentTracks';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import { trackFunnelEvent } from '@/lib/funnel/events-client';
import { cn } from '@/lib/utils';

interface Props {
  vm: ReportViewModel;
  reportId: string;
  selectedTrilha: EmagrecimentoTrilha;
  onSelectTrack?: (trilha: EmagrecimentoTrilha) => void;
  onOpenInlineCheckout?: () => void;
}

function getEligibilityCopy(
  classification: string | undefined
): { title: string; body: string; tone: string } {
  switch (classification) {
    case 'candidato_glp1':
      return {
        title: 'Elegibilidade preliminar favoravel',
        body: 'Sua triagem aponta espaco para seguir com programa e avaliacao medica, com definicao clinica final somente na consulta.',
        tone: 'border-emerald-200 bg-emerald-50 text-emerald-950',
      };
    case 'contraindicado':
      return {
        title: 'Avaliacao medica vem antes da prescricao',
        body: 'Algumas respostas pedem confirmacao clinica mais cuidadosa. O fechamento continua disponivel, mas a seguranca vem primeiro.',
        tone: 'border-amber-200 bg-amber-50 text-amber-950',
      };
    default:
      return {
        title: 'Seu caso pede leitura medica final',
        body: 'O relatorio ja organiza a melhor direcao de fechamento, mas a decisao clinica final continua sendo do medico.',
        tone: 'border-slate-200 bg-slate-50 text-slate-900',
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
    | 'candidato_glp1'
    | 'nao_indicado'
    | 'contraindicado'
    | undefined;
  const preferencia = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((item: string) => item !== 'nenhuma')
    : [];
  const recommendedLegacyPlan = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  const recommendedPlanId =
    planIdMapping[recommendedLegacyPlan as keyof typeof planIdMapping] || 'programa-3m';
  const investment = getResultsInvestmentBand();
  const eligibility = getEligibilityCopy(classification);
  const preferredTrack = trilhaFromPreferencia(preferencia);
  const preferredTrackTitle =
    medicationTrackCards.find((track) => track.id === preferredTrack)?.title || 'Definicao clinica';
  const selectedTrackCard = getMedicationTrackCard(selectedTrilha);
  const selectedTrack = TREATMENT_TRACKS_BY_ID[selectedTrilha];
  const estimatedRange = estimateWeightLossRangeKg(
    vm.basics.weightKg,
    selectedTrackCard.efficacyRangePercent
  );

  const recommendation =
    preferencia === 'tirzepatida'
      ? 'Sua preferencia atual aponta para a trilha com tirzepatida, sujeita a confirmacao medica.'
      : preferencia === 'semaglutida'
        ? 'Sua preferencia atual aponta para a trilha com semaglutida, sujeita a confirmacao medica.'
        : preferencia === 'contrave'
          ? 'Sua preferencia atual aponta para a trilha oral com Contrave, sujeita a confirmacao medica.'
          : 'Seu relatorio indica fechar o programa agora e deixar o principio ativo final para a consulta.';

  const handleSelectTrack = (trilha: EmagrecimentoTrilha) => {
    trackFunnelEvent('trilha_selected', {
      report_id: reportId,
      triage_id: vm.triageId || reportId,
      trilha,
    });
    onSelectTrack?.(trilha);
  };

  return (
    <section className="container mx-auto px-4 pb-2 pt-4 sm:px-6" aria-label="Decisao do programa">
      <div className="overflow-hidden rounded-[34px] border border-[#d7e3da] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full bg-[#f3ece4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5f4b3a]">
              Relatorio pos-triagem
            </span>

            <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-[3.25rem] lg:leading-[1.02]">
              Seu programa pode ser fechado agora, nesta mesma pagina
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Elegibilidade, trilha, plano e pagamento ficam no mesmo fluxo. O dashboard da Me Joy so abre depois da confirmacao real do pagamento.
            </p>

            <div className={cn('mt-6 rounded-[28px] border p-5', eligibility.tone)}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Leitura principal do relatorio</p>
              <h2 className="mt-2 text-xl font-bold">{eligibility.title}</h2>
              <p className="mt-2 text-sm leading-relaxed sm:text-base">{eligibility.body}</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Recomendacao resumida
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{recommendation}</p>
              </div>
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Faixa de investimento
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{investment}</p>
                <p className="mt-3 text-xs font-semibold text-emerald-700">
                  Plano-base sugerido: {recommendedPlanId.replace('programa-', '').replace('m', ' meses')}
                </p>
              </div>
              <div className="rounded-[24px] border border-zinc-100 bg-[#f8faf8] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Regra de acesso
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  Pagou e confirmou, entra no dashboard. Antes disso, voce continua aqui com checkout e suporte oficial.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onOpenInlineCheckout}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
              >
                Continuar com meu plano
              </button>
              <a
                href={buildEmagrecimentoReportWhatsappUrl({
                  reportId,
                  firstName: vm.basics.firstName,
                  triageSlug: 'emagrecimento',
                })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackFunnelEvent('whatsapp_report_cta', {
                    report_id: reportId,
                    surface: 'decision_fold',
                  })
                }
                className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                WhatsApp oficial
              </a>
            </div>
          </div>

          <div className="border-t border-[#d7e3da] bg-[#f3f7f3] lg:border-l lg:border-t-0">
            <div className="grid h-full gap-4 p-6 sm:p-8">
              <div className="grid grid-cols-[1.05fr_0.95fr] gap-4">
                <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[0.96] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/hero-main.webp"
                      alt="Programa Me Joy"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 52vw, 28vw"
                      priority
                    />
                  </div>
                </div>
                <div className="overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                  <div className="relative aspect-[0.78] overflow-hidden rounded-[22px]">
                    <Image
                      src="/images/emagrecimento/medvi/hero-secondary.webp"
                      alt="Suporte do programa"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 44vw, 22vw"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Preferencia atual
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{preferredTrackTitle}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    O relatorio respeita sua preferencia, mas a trilha final continua clinica.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Escolha atual
                  </p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{selectedTrack.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {estimatedRange ? `Faixa media observada: ${estimatedRange.label}.` : selectedTrack.estimate}
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
                Trilha terapêutica
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-slate-950 sm:text-3xl">
                Escolha a trilha terapêutica do seu programa
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">
              Cada opcao abaixo resume potencia, previsibilidade, faixa media de perda e seguranca clinica em linguagem direta.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {medicationTrackCards.map((track) => {
              const selected = selectedTrilha === track.id;
              const range = estimateWeightLossRangeKg(vm.basics.weightKg, track.efficacyRangePercent);
              const trackContent = TREATMENT_TRACKS_BY_ID[track.id];
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={cn(
                    'overflow-hidden rounded-[28px] border bg-white text-left transition-all',
                    selected
                      ? 'border-emerald-500 shadow-[0_20px_50px_rgba(5,150,105,0.14)]'
                      : 'border-zinc-200 hover:border-emerald-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.06)]'
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
                        {selected ? 'Selecionado' : 'Disponivel'}
                      </span>
                      <span className="rounded-full bg-emerald-950/88 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                        {track.potencyLabel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <p className="text-lg font-bold text-slate-950">{track.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{track.subtitle}</p>
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
                        <p className="font-semibold text-slate-900">Quanto isso pode representar</p>
                        <p className="mt-1">
                          {range ? range.label : 'A faixa real depende da dose, da adesao e da resposta individual.'}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Seguranca clinica</p>
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
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{selectedTrackCard.title}</h3>
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
