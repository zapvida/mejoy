import type { EmagrecimentoTrilha } from '@/lib/emagrecimento/checkoutUrls';

export interface TreatmentTrackContent {
  id: EmagrecimentoTrilha;
  title: string;
  shortTitle: string;
  badge: string;
  subtitle: string;
  format: string;
  potency: string;
  certainty: string;
  efficacy: string;
  estimate: string;
  safety: string;
  bestFor: string;
  image: string;
  principle?: string;
}

/**
 * Fonte resumida para comparacao publica das trilhas.
 *
 * Base clinica usada na copy:
 * - Tirzepatida: SURMOUNT-1 / Zepbound (site oficial Lilly)
 * - Semaglutida 2.4 mg: STEP 1 / Wegovy (site oficial Novo Nordisk)
 * - Contrave: estudos pivotais de 56 semanas / site oficial Contrave
 * - Alternativas clinicas: diretrizes de obesidade e metas de 5% a 10% de perda ponderal
 *
 * Todas as faixas abaixo sao medias de estudo, nunca promessa individual.
 */
export const TREATMENT_TRACKS: TreatmentTrackContent[] = [
  {
    id: 'tirzepatida',
    title: 'Tirzepatida',
    shortTitle: 'Tirzepatida',
    badge: 'Mais potente nos estudos',
    subtitle: 'Opcao injetavel semanal para quando o medico quer buscar a resposta mais forte possivel.',
    format: 'Injetavel semanal',
    potency: 'Potencia alta',
    certainty: 'Evidencia muito robusta',
    efficacy: 'Em estudos longos, a media ficou perto de 15% a 21% do peso corporal.',
    estimate: 'Partindo de 100 kg, isso pode representar algo perto de 15 a 21 kg em media.',
    safety:
      'Pede avaliacao medica, subida gradual de dose e checagem seria de tolerancia e contraindicacoes.',
    bestFor: 'Costuma entrar quando a meta de perda e maior ou quando o caso pede mais potencia.',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    principle: 'tirzepatida',
  },
  {
    id: 'semaglutida',
    title: 'Semaglutida',
    shortTitle: 'Semaglutida',
    badge: 'Mais consolidada',
    subtitle: 'Opcao injetavel semanal forte, previsivel e com base clinica muito conhecida.',
    format: 'Injetavel semanal',
    potency: 'Potencia alta',
    certainty: 'Evidencia muito robusta',
    efficacy: 'Em estudos longos, a media ficou perto de 10% a 15% do peso.',
    estimate: 'Partindo de 100 kg, isso costuma equivaler a algo perto de 10 a 15 kg em media.',
    safety:
      'Tambem pede avaliacao medica, titulacao gradual e checagem de contraindicacoes.',
    bestFor: 'Costuma fazer sentido quando o medico busca equilibrio forte entre eficacia e previsibilidade.',
    image: '/images/emagrecimento/medvi/treatment-escolha.avif',
    principle: 'semaglutida',
  },
  {
    id: 'contrave',
    title: 'Contrave',
    shortTitle: 'Contrave',
    badge: 'Opcao oral',
    subtitle: 'Comprimido diario para perfis em que uma trilha sem injetavel pode fazer mais sentido.',
    format: 'Comprimido oral diario',
    potency: 'Potencia moderada',
    certainty: 'Evidencia moderada',
    efficacy: 'Em estudos longos, a media ficou perto de 4% a 8% do peso.',
    estimate: 'Partindo de 100 kg, isso pode representar algo perto de 4 a 8 kg em media.',
    safety:
      'Pede triagem cuidadosa de pressao, frequencia cardiaca, saude mental e interacoes medicamentosas.',
    bestFor: 'Pode ajudar quando via oral faz mais sentido e fome ou impulso pesam bastante na rotina.',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    principle: 'contrave',
  },
  {
    id: 'alternativas_clinicas',
    title: 'Alternativas clinicas',
    shortTitle: 'Alternativas',
    badge: 'Quando seguranca vem primeiro',
    subtitle: 'Trilha sem pressa de travar um principio ativo agora. Boa quando o caso pede mais leitura clinica.',
    format: 'Conduta clinica guiada',
    potency: 'Potencia depende do caso',
    certainty: 'Beneficio metabolico bem conhecido',
    efficacy: 'Perder 5% a 10% do peso ja costuma melhorar glicemia, pressao e risco metabolico.',
    estimate: 'Partindo de 100 kg, algo perto de 5 a 10 kg ja pode mudar bastante a leitura do caso.',
    safety:
      'Aqui o foco e reduzir risco, ganhar consistencia e decidir com calma se medicacao entra agora, depois ou talvez nem precise entrar.',
    bestFor: 'Muito util quando seguranca, contraindicacoes, exames ou adesao precisam vir antes da potencia.',
    image: '/images/emagrecimento/medvi/metabolism-habits.avif',
  },
];

export const TREATMENT_TRACKS_BY_ID: Record<EmagrecimentoTrilha, TreatmentTrackContent> =
  TREATMENT_TRACKS.reduce(
    (acc, track) => {
      acc[track.id] = track;
      return acc;
    },
    {} as Record<EmagrecimentoTrilha, TreatmentTrackContent>,
  );
