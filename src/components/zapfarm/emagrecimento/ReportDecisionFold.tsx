'use client';

import type { ReportViewModel } from '@/lib/report/derive';
import { getRecommendedPlan } from '@/lib/emagrecimento/planRecommendation';
import { planIdMapping } from '@/config/zapfarm/emagrecimento-plans';
import { getResultsInvestmentBand } from '@/lib/emagrecimento/launchPricing';
import {
  buildEmagrecimentoCheckoutUrl,
  trilhaFromPreferencia,
  type EmagrecimentoTrilha,
} from '@/lib/emagrecimento/checkoutUrls';
import { buildEmagrecimentoReportWhatsappUrl } from '@/lib/emagrecimento/whatsappCta';
import { trackFunnelEvent } from '@/lib/funnel/events-client';

interface Props {
  vm: ReportViewModel;
  reportId: string;
}

const NEXT_STEPS = [
  'Você confirma a trilha sugerida e segue para o fechamento do programa com seus dados já contextualizados.',
  'Nosso time oficial acompanha por WhatsApp e organiza sua continuidade com avaliação clínica.',
  'O médico confirma ou ajusta a conduta; nada é prescrito automaticamente pelo site.',
  'Se houver indicação, o tratamento original é organizado com farmácia parceira e acompanhamento do programa.',
  'Check-ups e retornos seguem o plano acordado na consulta.',
];

function eligibilityBlock(
  classification: string | undefined
): { title: string; body: string; tone: 'ok' | 'warn' | 'alert' } {
  switch (classification) {
    case 'candidato_glp1':
      return {
        title: 'Elegibilidade preliminar',
        body: 'Com base na triagem, você pode seguir para avaliação médica de programa com medicação — a decisão final é sempre do profissional na consulta.',
        tone: 'ok',
      };
    case 'nao_indicado':
      return {
        title: 'Elegibilidade preliminar',
        body: 'Seu perfil pede avaliação cuidadosa; o médico indicará se programa medicamentoso é adequado ou se outro caminho é mais seguro.',
        tone: 'warn',
      };
    case 'contraindicado':
      return {
        title: 'Atenção — avaliação prioritária',
        body: 'Há respostas que exigem revisão médica antes de qualquer programa com medicação. Continue pelo WhatsApp ou plantão para orientação segura.',
        tone: 'alert',
      };
    default:
      return {
        title: 'Próxima etapa',
        body: 'Finalize pelo canal oficial para o médico avaliar seu caso com contexto completo.',
        tone: 'ok',
      };
  }
}

export function ReportDecisionFold({ vm, reportId }: Props) {
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as
    | 'candidato_glp1'
    | 'nao_indicado'
    | 'contraindicado'
    | undefined;
  const preferencia = answers.preferencia_principio_ativo as string | undefined;
  const impactoVida = answers.impacto_vida;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];

  const recPlanOld = classification
    ? getRecommendedPlan(classification, impactoVida, comorbidades)
    : 'trimestral';
  const defaultPlano = planIdMapping[recPlanOld as keyof typeof planIdMapping] || 'programa-3m';

  let recomendacaoPrincipal = 'Programa com acompanhamento e avaliação médica; medicação somente se indicada.';
  if (preferencia === 'tirzepatida') {
    recomendacaoPrincipal =
      'Sua preferência inicial aponta para linha com tirzepatida (agonista GLP-1/GIP) — sujeita à consulta.';
  } else if (preferencia === 'semaglutida') {
    recomendacaoPrincipal =
      'Sua preferência inicial aponta para linha com semaglutida (agonista GLP-1) — sujeita à consulta.';
  } else if (preferencia === 'contrave') {
    recomendacaoPrincipal =
      'Sua preferência inicial aponta para linha com Contrave® (bupropiona + naltrexona), quando indicada — sujeita à consulta.';
  } else if (preferencia === 'nao_sei') {
    recomendacaoPrincipal = 'Recomendamos decisão guiada pelo médico após a consulta.';
  }

  const elig = eligibilityBlock(classification);
  const investment = getResultsInvestmentBand();
  const triageContextId = vm.triageId || reportId;
  const trilhaPreferida = trilhaFromPreferencia(preferencia);

  const trackTrilha = (trilha: EmagrecimentoTrilha) => {
    trackFunnelEvent('trilha_selected', {
      report_id: reportId,
      triage_id: triageContextId,
      trilha,
    });
  };

  const glpLocked = classification === 'contraindicado';

  const trilhas: {
    id: EmagrecimentoTrilha;
    title: string;
    subtitle: string;
    principio?: string;
  }[] = [
    {
      id: 'tirzepatida',
      title: 'Programa — tirzepatida (original)',
      subtitle: 'Quando indicada na consulta. Acompanhamento + suporte WhatsApp.',
      principio: 'tirzepatida',
    },
    {
      id: 'semaglutida',
      title: 'Programa — semaglutida (original)',
      subtitle: 'Quando indicada na consulta. Inclui alternativas orais/injetáveis avaliadas pelo médico.',
      principio: 'semaglutida',
    },
    {
      id: 'contrave',
      title: 'Programa — Contrave® (original)',
      subtitle: 'Associação bupropiona + naltrexona, quando indicada (sem GLP-1).',
      principio: 'contrave',
    },
    {
      id: 'alternativas_clinicas',
      title: 'Alternativas clínicas (ex.: apresentações originais)',
      subtitle:
        'Inclui linhas que o prescritor pode considerar após anamnese — sem escolha automática no site.',
    },
  ];

  const toneClass =
    elig.tone === 'alert'
      ? 'border-amber-300 bg-amber-50'
      : elig.tone === 'warn'
        ? 'border-amber-200 bg-amber-50/80'
        : 'border-emerald-200 bg-emerald-50/80';

  return (
    <section
      className="container mx-auto px-4 sm:px-6 max-w-4xl pt-2 pb-4"
      aria-label="Decisão do programa"
    >
      <div className={`rounded-2xl border-2 p-5 sm:p-6 shadow-sm ${toneClass}`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Sua leitura inicial</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{elig.title}</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-800 leading-relaxed">{elig.body}</p>

        <div className="mt-4 rounded-xl border border-white/60 bg-white/90 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Recomendação do relatório</p>
          <p className="mt-1 text-sm sm:text-base font-medium text-gray-900">{recomendacaoPrincipal}</p>
        </div>

        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase">Faixa de investimento</p>
          <p className="mt-1 text-sm text-gray-800 leading-relaxed">{investment}</p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-gray-900 mb-3">Escolha a trilha para o checkout (pode ajustar depois com o médico)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trilhas.map((t) => {
              const disabled = glpLocked && (t.id === 'tirzepatida' || t.id === 'semaglutida');
              const href = disabled
                ? '#'
                : buildEmagrecimentoCheckoutUrl({
                    reportId,
                    triageId: triageContextId,
                    plano: defaultPlano,
                    trilha: t.id,
                    principio: t.principio,
                  });
              return (
                <a
                  key={t.id}
                  href={disabled ? undefined : href}
                  onClick={
                    disabled
                      ? (e) => e.preventDefault()
                      : () => trackTrilha(t.id)
                  }
                  className={`block rounded-xl border p-4 transition ${
                    disabled
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 opacity-60'
                      : 'border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <p className="font-bold text-gray-900 text-sm">{t.title}</p>
                  <p className="mt-1 text-xs text-gray-600 leading-snug">{t.subtitle}</p>
                  {!disabled && (
                    <span className="mt-2 inline-block text-xs font-semibold text-emerald-700">
                      Continuar para checkout →
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Próximos passos</p>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-800">
            {NEXT_STEPS.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href={buildEmagrecimentoCheckoutUrl({
              reportId,
              triageId: triageContextId,
              plano: defaultPlano,
              trilha: trilhaPreferida,
              principio:
                preferencia === 'tirzepatida'
                  ? 'tirzepatida'
                  : preferencia === 'semaglutida'
                    ? 'semaglutida'
                    : preferencia === 'contrave'
                      ? 'contrave'
                      : undefined,
            })}
            onClick={() => trackTrilha(trilhaPreferida)}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-700"
          >
            Continuar para o checkout do programa
          </a>
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
                surface: 'decision_fold_primary',
              })
            }
            className="inline-flex flex-1 items-center justify-center rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800"
          >
            WhatsApp oficial — tirar dúvidas
          </a>
        </div>
      </div>
    </section>
  );
}
