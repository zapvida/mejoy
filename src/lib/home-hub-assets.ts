/**
 * Assets da home hub — paridade visual com home.medvi.org.
 * Caminhos relativos a `public/`.
 */

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
    image: '/imagensmedvimejoyhome/me32.avif',
    pad: 'bg-white',
  },
  {
    slug: 'sono',
    title: 'Sono & recuperação',
    href: '/triagem/sono',
    image: '/imagensmedvimejoyhome/mejoy1-21.avif',
    pad: 'bg-sky-50',
  },
  {
    slug: 'articulacoes',
    title: 'Articulações & mobilidade',
    href: '/triagem/articulacoes',
    image: '/imagensmedvimejoyhome/mejoy1-19.avif',
    pad: 'bg-amber-50',
  },
  {
    slug: 'cabelo',
    title: 'Cabelo & couro cabeludo',
    href: '/triagem/cabelo',
    image: '/imagensmedvimejoyhome/mejoy1-16.avif',
    pad: 'bg-violet-50',
  },
];

export const HOME_HUB_GLP = {
  mainImage: '/imagensmedvimejoyhome/me33.avif',
  thumbA: '/imagensmedvimejoyhome/mejoy1-4.avif',
  thumbB: '/imagensmedvimejoyhome/mejoy1-8.avif',
} as const;

export const HOME_HUB_EDITORIAL_TRIPTYCH = [
  {
    src: '/imagensmedvimejoyhome/mejoy1-1.avif',
    alt: 'Paciente sorrindo, retrato',
  },
  {
    src: '/imagensmedvimejoyhome/mejoy1-2.avif',
    alt: 'Paciente confiante em atividade',
  },
  {
    src: '/imagensmedvimejoyhome/mejoy1-3.avif',
    alt: 'Paciente feliz, retrato',
  },
] as const;

export const HOME_HUB_SECONDARY_TREATMENTS = [
  {
    slug: 'saude',
    title: 'Saúde & bem-estar',
    href: '/triagem/saude',
    image: '/mejoyimagens/mejoy3.jpg',
  },
  {
    slug: 'detox',
    title: 'Detox & fígado',
    href: '/triagem/detox',
    image: '/mejoyimagens/mejoy5.jpg',
  },
] as const;

export const HOME_HUB_HOW_STEPS = [
  {
    step: '01',
    title: 'Triagem rápida',
    description: 'Poucos minutos para organizar histórico e objetivo.',
    image: '/imagensmedvimejoyhome/mejoy1-10.avif',
  },
  {
    step: '02',
    title: 'Próximo passo claro',
    description: 'Você vê elegibilidade e caminhos antes de decidir.',
    image: '/imagensmedvimejoyhome/mejoy1-11.avif',
  },
  {
    step: '03',
    title: 'Suporte oficial',
    description: 'Acompanhamento pelo canal oficial quando houver indicação.',
    image: '/imagensmedvimejoyhome/mejoy1-12.avif',
  },
] as const;

export const HOME_HUB_WHY_TILES = [
  {
    title: 'Critério clínico',
    description: 'Conduta com profissional habilitado quando indicado.',
    image: '/imagensmedvimejoyhome/mejoy1-17.avif',
  },
  {
    title: 'Privacidade (LGPD)',
    description: 'Dados tratados com sigilo e boas práticas.',
    image: '/imagensmedvimejoyhome/mejoy1-15.avif',
  },
  {
    title: 'Linguagem clara',
    description: 'Menos ruído, mais entendimento do seu caso.',
    image: '/imagensmedvimejoyhome/mejoy1-14.avif',
  },
  {
    title: 'Canal oficial',
    description: 'Orientações e lembretes centralizados.',
    image: '/imagensmedvimejoyhome/mejoy1-22.avif',
  },
] as const;

export const HOME_HUB_TESTIMONIALS = [
  {
    name: 'Carolina M.',
    location: 'São Paulo, SP',
    avatar: '/imagensmedvimejoyhome/mejoy1-5.avif',
    quote: 'Entendi um caminho possível em minutos — direto, sem promessa vazia.',
  },
  {
    name: 'Rafaela T.',
    location: 'Belo Horizonte, MG',
    avatar: '/imagensmedvimejoyhome/mejoy1-6.avif',
    quote: 'Relatório organizado e suporte que me tirou da dúvida.',
  },
  {
    name: 'Patrícia S.',
    location: 'Curitiba, PR',
    avatar: '/imagensmedvimejoyhome/mejoy1-7.avif',
    quote: 'Transparência no que fazer a seguir. Senti segurança para avançar.',
  },
] as const;
