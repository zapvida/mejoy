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
 * Fonte resumida para comparação pública das trilhas.
 *
 * Base clínica usada na copy:
 * - Tirzepatida: SURMOUNT-1 / Zepbound (site oficial Lilly)
 * - Semaglutida 2.4 mg: STEP 1 / Wegovy (site oficial Novo Nordisk)
 * - Contrave: estudos pivotais de 56 semanas / site oficial Contrave
 * - Alternativas clinicas: diretrizes de obesidade e metas de 5% a 10% de perda ponderal
 *
 * Todas as faixas abaixo são médias de estudo, nunca promessa individual.
 */
export const TREATMENT_TRACKS: TreatmentTrackContent[] = [
  {
    id: 'tirzepatida',
    title: 'Tirzepatida',
    shortTitle: 'Tirzepatida',
    badge: 'Mais potente nos estudos',
    subtitle: 'Injetável semanal que pode ser considerado quando o médico busca maior potência terapêutica.',
    format: 'Injetável semanal',
    potency: 'Potência alta',
    certainty: 'Evidência muito robusta',
    efficacy: 'Média observada perto de 15% a 21% do peso corporal.',
    estimate: 'Para alguém com 100 kg, isso pode se aproximar de 15 a 21 kg.',
    safety: 'Pede avaliação médica, subida gradual de dose e checagem séria de tolerância.',
    bestFor: 'Quando a meta é mais ambiciosa ou o caso pede mais potência, se houver indicação.',
    image: '/images/emagrecimento/medvi/treatment-injetavel.webp',
    principle: 'tirzepatida',
  },
  {
    id: 'semaglutida',
    title: 'Semaglutida',
    shortTitle: 'Semaglutida',
    badge: 'Mais consolidada',
    subtitle: 'Injetável semanal com ampla base clínica e boa previsibilidade de resposta.',
    format: 'Injetável semanal',
    potency: 'Potência alta',
    certainty: 'Evidência muito robusta',
    efficacy: 'Média observada perto de 10% a 15% do peso.',
    estimate: 'Para alguém com 100 kg, isso costuma equivaler a 10 a 15 kg.',
    safety: 'Também pede avaliação médica, titulação gradual e checagem de contraindicações.',
    bestFor: 'Quando o médico busca equilíbrio entre eficácia, tolerância e previsibilidade.',
    image: '/images/emagrecimento/medvi/treatment-escolha.avif',
    principle: 'semaglutida',
  },
  {
    id: 'contrave',
    title: 'Contrave',
    shortTitle: 'Contrave',
    badge: 'Opção oral',
    subtitle: 'Comprimido diário para perfis em que uma trilha sem injetável pode fazer mais sentido.',
    format: 'Comprimido oral diário',
    potency: 'Potência moderada',
    certainty: 'Evidência moderada',
    efficacy: 'Média observada perto de 4% a 8% do peso.',
    estimate: 'Para alguém com 100 kg, isso pode representar algo perto de 4 a 8 kg.',
    safety: 'Pede triagem cuidadosa de pressão, frequência cardíaca e interações medicamentosas.',
    bestFor: 'Quando a via oral faz mais sentido e fome ou impulso pesam na rotina.',
    image: '/images/emagrecimento/medvi/treatment-comprimidos.avif',
    principle: 'contrave',
  },
  {
    id: 'alternativas_clinicas',
    title: 'Alternativas clínicas',
    shortTitle: 'Alternativas',
    badge: 'Quando segurança vem primeiro',
    subtitle: 'Trilha para casos em que exames, rotina, contraindicações ou adesão precisam vir antes da medicação.',
    format: 'Conduta clínica guiada',
    potency: 'Potência depende do caso',
    certainty: 'Benefício metabólico bem conhecido',
    efficacy: 'Perder 5% a 10% do peso já costuma melhorar glicemia, pressão e risco metabólico.',
    estimate: 'Para alguém com 100 kg, algo perto de 5 a 10 kg já pode mudar bastante a leitura do caso.',
    safety: 'Aqui o foco é reduzir risco e decidir com calma se medicação entra agora, depois ou talvez nem precise entrar.',
    bestFor: 'Quando segurança, contraindicações, exames ou adesão precisam vir antes da potência.',
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
