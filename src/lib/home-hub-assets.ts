/**
 * Assets da home hub — paridade visual com home.medvi.org.
 * Caminhos relativos a `public/`.
 */

const SLOT = (slotId: string) => `/imagensmejoyproducao/slots/${slotId}/master.webp`;
const EXTRA = (name: string) => `/imagensmejoyproducao/extras/${name}/master.webp`;

export type HomeHubTreatmentRow = {
  slug: string;
  title: string;
  href: string;
  image: string;
  pad: string;
};

/** Quatro categorias — imagem à esquerda no mobile; produtos e pessoas como na referência. */
export const HOME_HUB_TREATMENT_ROWS: HomeHubTreatmentRow[] = [
  {
    slug: 'emagrecimento',
    title: 'Emagrecimento & metabolismo',
    href: '/triagem/emagrecimento',
    image: SLOT('MJY-EMO-001'),
    pad: 'bg-white',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: SLOT('MJY-EMO-002'),
    pad: 'bg-sky-50',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & mobilidade',
    href: '/triagem/articulacoes',
    image: SLOT('MJY-EMO-003'),
    pad: 'bg-amber-50',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & couro cabeludo',
    href: '/triagem/cabelo',
    image: SLOT('MJY-EMO-004'),
    pad: 'bg-violet-50',
  },
];

export const HOME_HUB_GLP = {
  mainImage: SLOT('MJY-EMO-005'),
  thumbA: SLOT('MJY-EMO-006'),
  thumbB: SLOT('MJY-EMO-007'),
} as const;

export const HOME_HUB_EDITORIAL_TRIPTYCH = [
  {
    src: EXTRA('home-editorial-01'),
    alt: 'Paciente sorrindo, retrato',
  },
  {
    src: EXTRA('home-editorial-02'),
    alt: 'Paciente confiante em atividade',
  },
  {
    src: EXTRA('home-editorial-03'),
    alt: 'Paciente feliz, retrato',
  },
] as const;

export const HOME_HUB_SECONDARY_TREATMENTS = [
  {
    slug: 'saude',
    title: 'Saúde & bem-estar',
    href: '/triagem/saude',
    image: EXTRA('home-secondary-saude'),
  },
  {
    slug: 'detox',
    title: 'Detox & fígado',
    href: '/triagem/detox',
    image: EXTRA('home-secondary-detox'),
  },
] as const;

export const HOME_HUB_HOW_STEPS = [
  {
    step: '01',
    title: 'Triagem rápida',
    description: 'Poucos minutos para organizar histórico e objetivo.',
    image: SLOT('MJY-EMO-008'),
  },
  {
    step: '02',
    title: 'Próximo passo claro',
    description: 'Você vê elegibilidade e caminhos antes de decidir.',
    image: SLOT('MJY-EMO-009'),
  },
  {
    step: '03',
    title: 'Suporte oficial',
    description: 'Acompanhamento pelo canal oficial quando houver indicação.',
    image: SLOT('MJY-EMO-010'),
  },
] as const;

export const HOME_HUB_WHY_TILES = [
  {
    title: 'Critério clínico',
    description: 'Conduta com profissional habilitado quando indicado.',
    image: EXTRA('home-why-criterio'),
  },
  {
    title: 'Privacidade (LGPD)',
    description: 'Dados tratados com sigilo e boas práticas.',
    image: EXTRA('home-why-lgpd'),
  },
  {
    title: 'Linguagem clara',
    description: 'Menos ruído, mais entendimento do seu caso.',
    image: EXTRA('home-why-linguagem'),
  },
  {
    title: 'Canal oficial',
    description: 'Orientações e lembretes centralizados.',
    image: EXTRA('home-why-canal'),
  },
] as const;

export const HOME_HUB_TESTIMONIALS = [
  {
    name: 'Paciente MeJoy',
    location: 'São Paulo, SP',
    avatar: SLOT('MJY-EMO-011'),
    quote: 'Entendi meu caso com clareza e consegui avançar sem aquela sensação de estar tentando no escuro.',
  },
  {
    name: 'Paciente MeJoy',
    location: 'Belo Horizonte, MG',
    avatar: SLOT('MJY-EMO-012'),
    quote: 'O que mais me ajudou foi saber exatamente qual era o próximo passo e por que ele fazia sentido.',
  },
  {
    name: 'Paciente MeJoy',
    location: 'Curitiba, PR',
    avatar: EXTRA('home-testimonial-avatar-c'),
    quote: 'Sem promessa exagerada. Só um processo mais organizado, mais seguro e muito mais fácil de seguir.',
  },
] as const;
