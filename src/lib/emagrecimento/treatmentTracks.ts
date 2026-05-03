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
    efficacy: 'Nos estudos de obesidade com 72 semanas, a perda media ficou perto de 15% a 21% do peso corporal.',
    estimate: 'Se voce comeca com 100 kg, isso pode representar algo perto de 15 a 21 kg em media de estudo.',
    safety:
      'Exige avaliacao medica, subida gradual de dose e checagem seria de tolerancia e contraindicacoes. Nausea, vomitos e intestino mais preso ou solto sao efeitos comuns no inicio.',
    bestFor: 'Costuma fazer mais sentido quando ha obesidade mais marcada, comorbidades relevantes ou meta de perda mais ambiciosa.',
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
    efficacy: 'Nos estudos de 68 semanas, a perda media ficou perto de 10% a 15% do peso, dependendo do perfil avaliado.',
    estimate: 'Se voce comeca com 100 kg, isso costuma equivaler a algo perto de 10 a 15 kg em media de estudo.',
    safety:
      'Tambem pede avaliacao medica, titulacao gradual e checagem de contraindicacoes. Os efeitos gastrointestinais seguem sendo os mais frequentes.',
    bestFor: 'Costuma fazer sentido quando o medico busca um equilibrio forte entre eficacia, previsibilidade e experiencia clinica acumulada.',
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
    efficacy: 'Nos estudos de 56 semanas, a perda media ficou perto de 4% a 8% do peso, dependendo do protocolo e da aderencia.',
    estimate: 'Se voce comeca com 100 kg, isso pode representar algo perto de 4 a 8 kg em media de estudo.',
    safety:
      'Precisa de triagem mais cuidadosa de pressao, frequencia cardiaca, saude mental, convulsao e interacoes com outros remedios.',
    bestFor: 'Pode ser util quando o caso favorece via oral e quando fome, impulso ou vontade frequente de comer pesam bastante na rotina.',
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
    efficacy: 'Perder 5% a 10% do peso ja costuma melhorar glicemia, pressao, gordura no figado, cintura e risco metabolico.',
    estimate: 'Se voce comeca com 100 kg, algo perto de 5 a 10 kg ja pode mudar muito a leitura clinica do seu caso.',
    safety:
      'Aqui o foco e reduzir risco, ganhar consistencia e decidir com calma se medicacao entra agora, depois ou talvez nem precise entrar.',
    bestFor: 'Muito util quando o medico entende que seguranca, contraindicacoes, exame, rotina ou adesao precisam vir antes da potencia.',
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
