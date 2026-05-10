/**
 * Registry MeJoy-owned for the production landing, triage, report, checkout,
 * dashboard and support surfaces.
 *
 * Runtime surfaces consume slot-specific exports from `public/imagensmejoyproducao`,
 * generated from the owned source libraries and isolated from benchmark files.
 */
const SLOT = (slotId: string) => `/imagensmejoyproducao/slots/${slotId}/master.webp`;
const EXTRA = (name: string) => `/imagensmejoyproducao/extras/${name}/master.webp`;

export const EMAGRECIMENTO_LP = {
  hero: [
    { src: SLOT('MJY-EMO-013'), alt: 'Paciente MeJoy em início de jornada' },
    { src: SLOT('MJY-EMO-014'), alt: 'Paciente MeJoy sorrindo em retrato editorial' },
    { src: SLOT('MJY-EMO-015'), alt: 'Paciente MeJoy em rotina de autocuidado' },
  ],
  howTriagem: SLOT('MJY-EMO-016'),
  howConsulta: SLOT('MJY-EMO-017'),
  howAcompanhamento: SLOT('MJY-EMO-018'),
  tailoredMetabolism: SLOT('MJY-EMO-019'),
  appContext: SLOT('MJY-EMO-020'),
  storyPortraitA: SLOT('MJY-EMO-021'),
  storyPortraitB: EXTRA('lp-story-portrait-b'),
  storyWideA: SLOT('MJY-EMO-022'),
  storyWideB: EXTRA('lp-story-wide-b'),
} as const;

export const EMAGRECIMENTO_TRIAGE_ASSETS = {
  heroFrames: [
    {
      src: SLOT('MJY-EMO-023'),
      alt: 'Paciente MeJoy em progresso de saúde',
      className: 'row-span-2 aspect-[0.82]',
    },
    {
      src: EXTRA('triage-frame-secondary-a'),
      alt: 'Paciente MeJoy em retrato confiante',
      className: 'aspect-[1.02]',
    },
    {
      src: EXTRA('triage-frame-secondary-b'),
      alt: 'Paciente MeJoy em rotina de bem-estar',
      className: 'aspect-[0.94]',
    },
    {
      src: SLOT('MJY-EMO-024'),
      alt: 'Paciente com dispositivo do tratamento',
      className: 'aspect-[0.94]',
    },
    {
      src: EXTRA('triage-frame-secondary-c'),
      alt: 'Paciente satisfeita com evolução consistente',
      className: 'aspect-[1.18]',
    },
  ],
  socialAvatars: [
    SLOT('MJY-EMO-011'),
    SLOT('MJY-EMO-012'),
    EXTRA('home-testimonial-avatar-c'),
    EXTRA('social-avatar-d'),
  ],
} as const;

export const EMAGRECIMENTO_TRACK_ASSETS = {
  tirzepatida: EXTRA('track-tirzepatida'),
  semaglutida: EXTRA('track-semaglutida'),
  contrave: EXTRA('track-contrave'),
  alternativas_clinicas: EXTRA('track-alternativas'),
} as const;

export const EMAGRECIMENTO_REPORT_ASSETS = {
  decisionHeroPrimary: SLOT('MJY-EMO-026'),
  decisionHeroSecondary: EXTRA('report-card-consulta'),
  decisionHeroSupport: EXTRA('report-card-guided'),
  socialProofWide: SLOT('MJY-EMO-028'),
  inlineCheckoutCards: [
    {
      src: EXTRA('report-card-guided'),
      alt: 'Paciente MeJoy com continuidade no mesmo fluxo',
      title: 'Relatorio + checkout conectados',
    },
    {
      src: EXTRA('report-card-consulta'),
      alt: 'Consulta medica organizada',
      title: 'Consulta valida a conduta',
    },
    {
      src: SLOT('MJY-EMO-030'),
      alt: 'Suporte oficial em smartphone',
      title: 'Suporte oficial pos-pagamento',
    },
  ],
  planFrames: [
    {
      src: EXTRA('report-card-guided'),
      alt: 'Fechamento guiado com apoio humano',
      title: 'Fechamento guiado',
    },
    {
      src: EMAGRECIMENTO_TRACK_ASSETS.contrave,
      alt: 'Trilha oral do programa',
      title: 'Opcao em comprimido',
    },
    {
      src: EMAGRECIMENTO_TRACK_ASSETS.semaglutida,
      alt: 'Escolha orientada do programa',
      title: 'Escolha guiada',
    },
  ],
} as const;

export const EMAGRECIMENTO_CHECKOUT_ASSETS = {
  journeyFrames: [
    {
      src: EXTRA('report-card-guided'),
      alt: 'Paciente com contexto do tratamento',
      title: 'Fechamento ja conectado ao seu caso',
      body: 'A triagem e o relatorio deixam plano, dados e contexto prontos para continuar sem reiniciar a jornada.',
    },
    {
      src: EXTRA('report-card-consulta'),
      alt: 'Consulta medica online com contexto',
      title: 'Consulta confirma a conduta',
      body: 'A avaliacao medica confirma ou ajusta trilha, dose, check-up e continuidade clinica com seguranca.',
    },
    {
      src: SLOT('MJY-EMO-030'),
      alt: 'Canal oficial da MeJoy no celular',
      title: 'Suporte oficial MeJoy',
      body: 'Apos a confirmacao, o app e o canal oficial assumem rotina, documentos, proximos passos e suporte.',
    },
  ],
} as const;

export const EMAGRECIMENTO_SPECIALIST_ASSETS = {
  heroGrid: [
    EXTRA('specialist-lead'),
    EXTRA('report-card-consulta'),
    EXTRA('specialist-journey'),
    EXTRA('results-portrait-d'),
  ],
  specialistCards: [
    {
      title: 'Medicos parceiros com CRM ativo',
      subtitle: 'Avaliacao clinica quando indicada',
      focus: 'Leem triagem, historico e sinais de seguranca antes de qualquer conduta.',
      photo: EXTRA('specialist-lead'),
    },
    {
      title: 'Coordenacao do cuidado',
      subtitle: 'Ritmo, elegibilidade e proximos passos',
      focus: 'Conecta relatorio, consulta, pagamento e jornada posterior sem deixar o paciente solto.',
      photo: EXTRA('specialist-journey'),
    },
    {
      title: 'Suporte de rotina e aderencia',
      subtitle: 'Habitos, sinais e continuidade',
      focus: 'Ajuda o paciente a transformar orientacao em constancia ao longo do programa.',
      photo: EXTRA('specialist-support'),
    },
  ],
  councilCards: [
    {
      title: 'Direcao clinica e seguranca',
      subtitle: 'Revisao humana obrigatoria',
      quote: 'IA e triagem existem para organizar contexto. A decisao clinica continua humana, individual e revisada.',
      photo: EXTRA('specialist-lead'),
    },
    {
      title: 'Aderencia, nutricao e continuidade',
      subtitle: 'Plano pratico para vida real',
      quote: 'O objetivo e reduzir atrito: menos improviso, mais clareza sobre o que fazer hoje e como sustentar a rotina.',
      photo: EXTRA('specialist-support'),
    },
  ],
} as const;

export const EMAGRECIMENTO_PAGE_ASSETS = {
  resultadosHeroGrid: [
    SLOT('MJY-EMO-021'),
    SLOT('MJY-EMO-013'),
    EXTRA('lp-story-portrait-b'),
    EXTRA('results-portrait-d'),
  ],
  tratamentosHeroGrid: [
    EMAGRECIMENTO_TRACK_ASSETS.tirzepatida,
    EMAGRECIMENTO_TRACK_ASSETS.contrave,
    EMAGRECIMENTO_TRACK_ASSETS.semaglutida,
  ],
} as const;

export const EMAGRECIMENTO_PROTOCOL_ASSETS = {
  emagrecimentoHero: SLOT('MJY-EMO-001'),
  journeyAcompanhamento: SLOT('MJY-EMO-019'),
  metabolicHabits: EXTRA('track-alternativas'),
  metabolicResults: EXTRA('protocol-metabolic-results'),
} as const;

export const EMAGRECIMENTO_DASHBOARD_ASSETS = {
  welcomeVideo: EXTRA('results-portrait-d'),
  metabolicResults: EMAGRECIMENTO_PROTOCOL_ASSETS.metabolicResults,
  journeyAcompanhamento: EMAGRECIMENTO_PROTOCOL_ASSETS.journeyAcompanhamento,
  metabolicHabits: EMAGRECIMENTO_PROTOCOL_ASSETS.metabolicHabits,
} as const;
