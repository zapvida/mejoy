import type { TriagemKind } from '@/lib/report/types';

import { getPlanById } from './emagrecimento-plans';

/**
 * Configuração centralizada de todos os produtos ZapFarm
 * Este arquivo é a fonte única de verdade para conteúdo, cores, planos e configurações
 *
 * Emagrecimento (programas 1/3/6 meses): valores monetários exibidos e `unitPrice`
 * vêm de `emagrecimento-plans.ts` — não duplicar números manualmente aqui.
 */

const emagPreco = {
  basico: getPlanById('programa-1m')!,
  completo: getPlanById('programa-3m')!,
  premium: getPlanById('programa-6m')!,
};

export interface PlanConfig {
  id: 'basico' | 'completo' | 'premium';
  slug: 'essencial' | 'produto-consulta' | 'protocolo-completo';
  name: string;
  badge?: string;
  price: string;
  unitPrice: number; // Preço em reais (número)
  period: string;
  equivalent?: string;
  stripePriceId: string; // Nome da env var (ex: STRIPE_PRICE_EMAGRECIMENTO_BASICO)
  features: string[];
  recommended?: boolean;
  description: string; // Descrição curta do plano
}

export interface ProductHeroConfig {
  headline: string;
  subheadline: string;
  ctaText: string;
  bullets?: Array<{
    icon: string;
    text: string;
  }>;
}

export interface ProductBenefit {
  icon: string;
  title: string;
  description: string;
}

export interface ProductHowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductEligibility {
  for: string[]; // Para quem é
  notFor: string[]; // Para quem não é
}

export interface ZapfarmProductConfig {
  slug: string;
  name: string;
  displayName: string;
  commercialName: string; // Nome comercial do produto (ex: MetaboSlim)
  protocolTitle: string; // Título do protocolo completo
  category: string;
  description: string;
  shortDescription: string;
  image: string; // Caminho da imagem da embalagem do produto
  
  // Visual identity
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
    gradientCTA: string;
  };
  
  // Triagem e relatório
  triageSlug: string;
  reportEngine: TriagemKind;
  
  // Planos (sempre 3)
  plans: {
    basico: PlanConfig;
    completo: PlanConfig;
    premium: PlanConfig;
  };
  
  // Conteúdo LPAC
  lpac: {
    hero: ProductHeroConfig;
    eligibility: ProductEligibility;
    whyItWorks: string[]; // Educação simples sobre fisiologia
    howItWorks: ProductHowItWorksStep[];
    benefits: ProductBenefit[];
    faq: ProductFAQ[];
  };
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };

  /** Opcional: variantes CORE/PRO (quando NEXT_PUBLIC_ZAPFARM_VARIANTS=1) */
  supplement?: {
    variants?: { core: { displayName: string }; pro: { displayName: string } };
  };
}

export const ZAPFARM_PRODUCTS: Record<string, ZapfarmProductConfig> = {
  emagrecimento: {
    slug: 'emagrecimento',
    name: 'Emagrecimento Metabólico Integrativo',
    displayName: 'MetaboSlim',
    commercialName: 'MetaboSlim',
    protocolTitle: 'Emagrecimento Metabólico Integrativo com tirzepatida',
    category: 'Metabolismo',
    description: 'Tratamento de emagrecimento com acompanhamento médico especializado e medicação sob prescrição',
    shortDescription: 'Emagreça com segurança e acompanhamento médico especializado',
    image: '/products/metaboslim.svg',
    
    colors: {
      primary: 'purple',
      secondary: 'orange',
      gradient: 'from-purple-700 via-purple-600 to-orange-600',
      gradientCTA: 'from-purple-400 via-purple-500 to-orange-400',
    },
    
    triageSlug: 'emagrecimento',
    reportEngine: 'metabolico',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Programa 1 Mês',
        price: emagPreco.basico.priceMain,
        unitPrice: emagPreco.basico.totalAmount,
        period: '',
        stripePriceId: 'STRIPE_PRICE_EMAGRECIMENTO_P1',
        description: 'Um mês de acompanhamento completo. Total de R$ 2.000 em até 12x sem juros no cartão.',
        features: [
          'Consulta com clínico médico especialista',
          'Consulta com nutricionista para plano alimentar',
          'Consulta com psicólogo para suporte emocional',
          'Consulta de retorno e exames de check-up',
          'Acompanhamento mensal por WhatsApp',
          'Tratamento completo com medicação quando indicada',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Programa 3 Meses',
        badge: 'Mais escolhido',
        price: emagPreco.completo.priceMain,
        unitPrice: emagPreco.completo.totalAmount,
        period: '',
        stripePriceId: 'STRIPE_PRICE_EMAGRECIMENTO_P2',
        description: 'Três meses de cuidado contínuo. Total de R$ 4.000 em até 12x sem juros no cartão.',
        features: [
          'Consulta com clínico médico especialista',
          'Consulta com nutricionista para plano alimentar',
          'Consulta com psicólogo para suporte emocional',
          'Consulta de retorno e exames de check-up',
          'Acompanhamento mensal por WhatsApp',
          '3 meses de acompanhamento contínuo',
          'Consultas de retorno para ajustes finos',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Programa 6 Meses',
        badge: 'Mais completo',
        price: emagPreco.premium.priceMain,
        unitPrice: emagPreco.premium.totalAmount,
        period: '',
        stripePriceId: 'STRIPE_PRICE_EMAGRECIMENTO_P3',
        description: 'Seis meses com médico e time do seu lado. Total de R$ 6.000 em até 12x sem juros no cartão.',
        features: [
          'Consulta com clínico médico especialista',
          'Consulta com nutricionista para plano alimentar',
          'Consulta com psicólogo para suporte emocional',
          'Consulta de retorno e exames de check-up',
          'Acompanhamento mensal por WhatsApp',
          '6 meses de acompanhamento contínuo',
          'Plano de manutenção para evitar reganho',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'MetaboSlim – Emagrecimento com acompanhamento médico especializado',
        subheadline: 'Protocolo de Emagrecimento Metabólico Integrativo com tirzepatida sob prescrição. Seu tratamento chega até você.',
        ctaText: 'Verificar minha elegibilidade',
        bullets: [
          { icon: '💊', text: 'Medicamentos sob prescrição médica' },
          { icon: '✅', text: 'Seguindo as normas da ANVISA' },
          { icon: '🚚', text: 'Receba seu tratamento em casa' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento médico e nutricional' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com IMC acima de 27 kg/m²',
          'Quem já tentou dietas e exercícios sem sucesso',
          'Pessoas com comorbidades relacionadas ao peso (diabetes, hipertensão)',
        ],
        notFor: [
          'Gestantes ou mulheres amamentando',
          'Pessoas com histórico de câncer de tireoide (medular)',
          'Alérgicos aos componentes da fórmula',
        ],
      },
      whyItWorks: [
        'A obesidade é uma doença crônica que afeta hormônios e metabolismo',
        'Medicamentos modernos ajudam a regular apetite e metabolismo',
        'Acompanhamento médico garante segurança e ajuste de dose',
        'Equipe multidisciplinar potencializa resultados a longo prazo',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Check-up gratuito',
          description: 'Responda nossa triagem em 3-5 minutos e descubra sua elegibilidade',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Receba análise completa com recomendações baseadas em evidências científicas',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Selecione entre produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba seu kit em casa e tenha acompanhamento contínuo via WhatsApp',
        },
      ],
      benefits: [
        {
          icon: '🎯',
          title: 'Tratamento personalizado',
          description: 'Análise individual do seu perfil metabólico e histórico de saúde',
        },
        {
          icon: '🔬',
          title: 'Baseado em evidências',
          description: 'Medicamentos e protocolos com comprovação científica internacional',
        },
        {
          icon: '🛡️',
          title: 'Seguranca clinica',
          description: 'Todo uso de medicação é feito apenas com prescrição médica',
        },
        {
          icon: '💬',
          title: 'Suporte contínuo',
          description: 'Equipe disponível para tirar dúvidas e ajustar tratamento',
        },
      ],
      faq: [
        {
          question: 'Preciso de receita médica?',
          answer: 'Sim. Todo uso de medicação é feito apenas após avaliação individual e prescrição médica, seguindo as normas da ANVISA. Nossa equipe médica avalia seu caso e prescreve quando há indicação.',
        },
        {
          question: 'Vai me dar taquicardia?',
          answer: 'Os medicamentos são prescritos apenas após avaliação médica completa. Se você tem histórico de problemas cardíacos, isso será considerado na avaliação. O acompanhamento médico garante segurança.',
        },
        {
          question: 'Quanto tempo leva para sentir efeito?',
          answer: 'Os efeitos começam a aparecer nas primeiras semanas, mas resultados mais significativos são observados após 3-6 meses de tratamento contínuo, combinado com mudanças de estilo de vida.',
        },
        {
          question: 'Posso usar com outros remédios?',
          answer: 'Sim, mas é fundamental informar todos os medicamentos em uso durante a triagem. Nossa equipe médica avalia interações e ajusta o tratamento conforme necessário.',
        },
        {
          question: 'É assinatura ou uma compra só?',
          answer: 'Você compra o plano escolhido (mensal, trimestral ou semestral). Não há assinatura automática. Ao final do período, você pode renovar se desejar.',
        },
        {
          question: 'Vocês enviam para todo o Brasil?',
          answer: 'Sim, enviamos para todo o território nacional. O frete é calculado no checkout e varia conforme sua localização.',
        },
      ],
    },
    
    seo: {
      title: 'Emagreça com Segurança: MetaboSlim com Tirzepatida | Me Joy',
      description: 'Programa de emagrecimento com avaliacao medica, estrategias modernas quando indicadas, acompanhamento continuo e suporte oficial. Entenda sua elegibilidade em poucos minutos.',
      keywords: ['emagrecer rápido', 'tirzepatida', 'perda de peso', 'emagrecimento médico', 'obesidade tratamento', 'endocrinologista online', 'emagrecer com segurança', 'metaboslim', 'protocolo emagrecimento'],
    },
  },

  calvicie: {
    slug: 'calvicie',
    name: 'Calvície & Saúde Capilar',
    displayName: 'CapilMax',
    commercialName: 'CapilMax',
    protocolTitle: 'Protocolo para Calvície & Saúde Capilar com minoxidil e suporte integrativo',
    category: 'Dermatologia',
    description: 'Tratamento para queda de cabelo e fortalecimento capilar com acompanhamento médico especializado',
    shortDescription: 'Reduza a queda e fortaleça seus fios com tratamento personalizado',
    image: '/products/capilmax.svg',
    
    colors: {
      primary: 'indigo',
      secondary: 'blue',
      gradient: 'from-indigo-700 via-indigo-600 to-blue-600',
      gradientCTA: 'from-indigo-400 via-indigo-500 to-blue-400',
    },
    
    triageSlug: 'calvicie',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_CALVICIE_P1',
        description: 'Só o CapilMax para 30 dias. Sem consulta incluída.',
        features: [
          'CapilMax para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_CALVICIE_P2',
        description: 'CapilMax + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_CALVICIE_P3',
        description: 'CapilMax + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'CapilMax – Reduza a queda e fortaleça seus fios',
        subheadline: 'Protocolo para Calvície & Saúde Capilar com minoxidil e suporte integrativo',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '💊', text: 'Suplemento manipulado personalizado' },
          { icon: '🔬', text: 'Análise completa do couro cabeludo' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com tricologista' },
          { icon: '📊', text: 'Exames para identificar causas' },
        ],
      },
      eligibility: {
        for: [
          'Homens e mulheres com queda de cabelo progressiva',
          'Pessoas com calvície androgenética',
          'Quem teve queda após gestação, estresse ou doenças',
        ],
        notFor: [
          'Pessoas com alopecia areata ativa',
          'Alérgicos aos componentes da fórmula',
          'Menores de 18 anos sem acompanhamento',
        ],
      },
      whyItWorks: [
        'A queda capilar tem causas múltiplas: hormonais, nutricionais, inflamatórias',
        'Suplementação direcionada nutre o folículo piloso',
        'Acompanhamento médico identifica e trata causas específicas',
        'Tratamento combinado potencializa resultados',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Triagem capilar',
          description: 'Avalie seu padrão de queda, histórico e fatores relacionados',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda as causas prováveis e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Kit em casa',
          description: 'Receba suplemento manipulado e acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🎯',
          title: 'Análise completa',
          description: 'Avaliação do padrão de queda, couro cabeludo e fatores nutricionais',
        },
        {
          icon: '💊',
          title: 'Fórmula personalizada',
          description: 'Suplemento manipulado com nutrientes específicos para seu caso',
        },
        {
          icon: '🔬',
          title: 'Exames incluídos',
          description: 'Guias para identificar deficiências nutricionais e hormonais',
        },
        {
          icon: '📈',
          title: 'Resultados progressivos',
          description: 'Melhora visível em 3-6 meses com tratamento contínuo',
        },
      ],
      faq: [
        {
          question: 'Funciona para calvície masculina?',
          answer: 'Sim. O tratamento é adaptado para cada tipo de alopecia. Para calvície androgenética masculina, o médico pode indicar tratamentos específicos além do suplemento.',
        },
        {
          question: 'Quanto tempo para ver resultados?',
          answer: 'Os primeiros sinais de melhora aparecem em 3-4 meses. Resultados mais significativos são observados após 6-12 meses de tratamento contínuo.',
        },
        {
          question: 'Preciso usar minoxidil também?',
          answer: 'Depende do seu caso. O médico avaliará se há necessidade de tratamento tópico adicional. O suplemento oral complementa o tratamento.',
        },
        {
          question: 'Mulheres podem usar?',
          answer: 'Sim. O tratamento é adaptado para mulheres, especialmente para queda pós-parto, estresse ou deficiências nutricionais.',
        },
        {
          question: 'O suplemento tem efeitos colaterais?',
          answer: 'Os suplementos são formulados com nutrientes essenciais e geralmente bem tolerados. Qualquer efeito adverso deve ser comunicado à equipe médica.',
        },
      ],
    },
    
    seo: {
      title: 'Pare a Queda de Cabelo Agora: CapilMax com Minoxidil | Me Joy',
      description: 'Recupere seus fios com CapilMax. Tratamento médico para calvície com minoxidil, suplementação personalizada e acompanhamento tricologista. Resultados em 3-6 meses. Check-up gratuito.',
      keywords: ['queda de cabelo', 'calvície tratamento', 'minoxidil', 'alopecia', 'cabelo crescer', 'tricologista online', 'calvície masculina', 'calvície feminina', 'capilmax'],
    },
  },

  sono: {
    slug: 'sono',
    name: 'Sono Profundo & Ansiedade Noturna',
    displayName: 'SonoZen',
    commercialName: 'SonoZen',
    protocolTitle: 'Sono Profundo & Ansiedade Noturna',
    category: 'Neurologia',
    description: 'Tratamento para insônia e distúrbios do sono com acompanhamento médico especializado',
    shortDescription: 'Durma melhor e acorde descansado com tratamento personalizado',
    image: '/products/sonozen.svg',
    
    colors: {
      primary: 'blue',
      secondary: 'indigo',
      gradient: 'from-blue-700 via-blue-600 to-indigo-600',
      gradientCTA: 'from-blue-400 via-blue-500 to-indigo-400',
    },
    
    triageSlug: 'sono',
    reportEngine: 'sono',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_SONO_P1',
        description: 'Só o SonoZen para 30 dias. Sem consulta incluída.',
        features: [
          'SonoZen para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_SONO_P2',
        description: 'SonoZen + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_SONO_P3',
        description: 'SonoZen + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Durma melhor e acorde descansado com tratamento personalizado',
        subheadline: 'Programa completo para insônia: suplemento + acompanhamento médico + ajuste de hábitos',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🌙', text: 'Suplemento com melatonina e fitoterápicos' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com especialista em sono' },
          { icon: '📋', text: 'Plano personalizado de higiene do sono' },
          { icon: '💬', text: 'Suporte contínuo para ajustes' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com dificuldade para iniciar ou manter o sono',
          'Quem acorda várias vezes durante a noite',
          'Pessoas com sono não reparador',
        ],
        notFor: [
          'Pessoas com apneia do sono não tratada',
          'Uso de medicamentos controlados sem prescrição',
          'Distúrbios psiquiátricos graves não tratados',
        ],
      },
      whyItWorks: [
        'O sono é regulado por hormônios e neurotransmissores específicos',
        'Melatonina e fitoterápicos ajudam a regular o ciclo circadiano',
        'Higiene do sono potencializa os efeitos do suplemento',
        'Acompanhamento médico garante tratamento adequado',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação do sono',
          description: 'Responda perguntas sobre seus padrões de sono e hábitos',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Receba análise das causas e plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Melhore seu sono',
          description: 'Receba suplemento e acompanhamento para dormir melhor',
        },
      ],
      benefits: [
        {
          icon: '🌙',
          title: 'Sono reparador',
          description: 'Durma mais rápido e acorde descansado',
        },
        {
          icon: '💊',
          title: 'Suplemento natural',
          description: 'Melatonina e fitoterápicos para regular o sono',
        },
        {
          icon: '📋',
          title: 'Higiene do sono',
          description: 'Plano personalizado de hábitos para melhorar o sono',
        },
        {
          icon: '🔬',
          title: 'Avaliação médica',
          description: 'Identificação de causas e tratamento adequado',
        },
      ],
      faq: [
        {
          question: 'Vou ficar dependente do suplemento?',
          answer: 'Não. O objetivo é regular o sono e depois reduzir gradualmente. O acompanhamento médico orienta a redução quando apropriado.',
        },
        {
          question: 'Quanto tempo para melhorar o sono?',
          answer: 'Os primeiros efeitos aparecem em 1-2 semanas. Melhora consistente é observada após 4-6 semanas de tratamento.',
        },
        {
          question: 'Posso usar com outros remédios para dormir?',
          answer: 'É importante informar todos os medicamentos em uso. O médico avaliará interações e ajustará o tratamento.',
        },
        {
          question: 'Funciona para insônia crônica?',
          answer: 'Sim, mas casos crônicos podem precisar de acompanhamento médico mais intenso. O plano completo ou premium é recomendado.',
        },
      ],
    },
    
    seo: {
      title: 'Durma Bem Todas as Noites: SonoZen para Insônia | Me Joy',
      description: 'Acabe com a insônia em 2 semanas. SonoZen com melatonina e fitoterápicos, acompanhamento médico especializado e plano de higiene do sono. Durma 8h por noite. Check-up gratuito.',
      keywords: ['insônia', 'dormir melhor', 'melatonina', 'distúrbio do sono', 'sono reparador', 'neurologista online', 'sonozen', 'tratamento insônia', 'dormir rápido'],
    },
  },

  ansiedade: {
    slug: 'ansiedade',
    name: 'Ansiedade & Estresse Diurno',
    displayName: 'ZenDay',
    commercialName: 'ZenDay',
    protocolTitle: 'Ansiedade & Estresse Diurno',
    category: 'Saúde Mental',
    description: 'Tratamento para ansiedade e estresse com acompanhamento médico e psicológico',
    shortDescription: 'Controle sua ansiedade com tratamento personalizado e acompanhamento especializado',
    image: '/products/zenday.svg',
    
    colors: {
      primary: 'green',
      secondary: 'teal',
      gradient: 'from-green-700 via-green-600 to-teal-600',
      gradientCTA: 'from-green-400 via-green-500 to-teal-400',
    },
    
    triageSlug: 'ansiedade',
    reportEngine: 'mental',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ANSIEDADE_P1',
        description: 'Só o ZenDay para 30 dias. Sem consulta incluída.',
        features: [
          'ZenDay para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ANSIEDADE_P2',
        description: 'ZenDay + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ANSIEDADE_P3',
        description: 'ZenDay + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Controle sua ansiedade com tratamento personalizado',
        subheadline: 'Programa completo: suplemento natural + acompanhamento médico e psicológico',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🌿', text: 'Fitoterápicos ansiolíticos naturais' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com psiquiatra' },
          { icon: '💚', text: 'Técnicas de controle de ansiedade' },
          { icon: '📱', text: 'Suporte contínuo via WhatsApp' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com ansiedade leve a moderada',
          'Quem sente estresse constante no dia a dia',
          'Pessoas com sintomas físicos de ansiedade',
        ],
        notFor: [
          'Crises de pânico graves não tratadas',
          'Ideação suicida ou autolesão',
          'Transtornos psiquiátricos graves não tratados',
        ],
      },
      whyItWorks: [
        'A ansiedade está relacionada a desequilíbrios em neurotransmissores',
        'Fitoterápicos como passiflora e valeriana ajudam a regular',
        'Acompanhamento psicológico ensina técnicas de controle',
        'Tratamento combinado é mais eficaz que apenas medicação',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação de ansiedade',
          description: 'Responda perguntas sobre seus sintomas e gatilhos',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda suas causas e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba suplemento e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🌿',
          title: 'Tratamento natural',
          description: 'Fitoterápicos com comprovação científica para ansiedade',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Acompanhamento médico',
          description: 'Psiquiatra avalia seu caso e ajusta tratamento',
        },
        {
          icon: '💚',
          title: 'Técnicas práticas',
          description: 'Aprenda estratégias para controlar ansiedade no dia a dia',
        },
        {
          icon: '📱',
          title: 'Suporte contínuo',
          description: 'Equipe disponível para orientações e ajustes',
        },
      ],
      faq: [
        {
          question: 'Vou ficar dependente do suplemento?',
          answer: 'Não. Fitoterápicos não causam dependência química. O objetivo é regular e depois reduzir gradualmente.',
        },
        {
          question: 'Preciso de psicólogo?',
          answer: 'Para ansiedade leve, o suplemento pode ser suficiente. Para casos moderados a graves, recomendamos o plano completo ou premium com acompanhamento psicológico.',
        },
        {
          question: 'Quanto tempo para sentir efeito?',
          answer: 'Os primeiros efeitos aparecem em 2-4 semanas. Melhora consistente é observada após 6-8 semanas.',
        },
        {
          question: 'Posso usar com antidepressivos?',
          answer: 'É fundamental informar todos os medicamentos. O médico avaliará interações e segurança.',
        },
      ],
    },
    
    seo: {
      title: 'Controle sua Ansiedade Naturalmente: ZenDay Fitoterápico | Me Joy',
      description: 'Reduza ansiedade e estresse em 4 semanas. ZenDay com fitoterápicos comprovados, acompanhamento psiquiátrico e técnicas práticas. Sem dependência. Check-up gratuito.',
      keywords: ['ansiedade', 'controlar ansiedade', 'estresse', 'fitoterápicos ansiedade', 'psiquiatra online', 'ansiolítico natural', 'zenday', 'tratamento ansiedade', 'ansiedade tratamento natural'],
    },
  },

  intestino: {
    slug: 'intestino',
    name: 'Intestino & Microbiota',
    displayName: 'FloraBalance',
    commercialName: 'FloraBalance',
    protocolTitle: 'Intestino & Microbiota (constipação, inchaço, microbiota)',
    category: 'Gastroenterologia',
    description: 'Tratamento para constipação, inchaço e saúde intestinal com probióticos e fibras',
    shortDescription: 'Regule seu intestino e melhore sua saúde digestiva',
    image: '/products/florabalance.svg',
    
    colors: {
      primary: 'emerald',
      secondary: 'green',
      gradient: 'from-emerald-700 via-emerald-600 to-green-600',
      gradientCTA: 'from-emerald-400 via-emerald-500 to-green-400',
    },
    
    triageSlug: 'intestino',
    reportEngine: 'gastro',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_INTESTINO_P1',
        description: 'Só o FloraBalance para 30 dias. Sem consulta incluída.',
        features: [
          'FloraBalance para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_INTESTINO_P2',
        description: 'FloraBalance + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_INTESTINO_P3',
        description: 'FloraBalance + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Regule seu intestino e melhore sua saúde digestiva',
        subheadline: 'Programa completo: probióticos + fibras + acompanhamento médico e nutricional',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🦠', text: 'Probióticos de alta qualidade' },
          { icon: '🌾', text: 'Fibras manipuladas personalizadas' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com gastroenterologista' },
          { icon: '📊', text: 'Exames para identificar causas' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com constipação crônica',
          'Quem sente inchaço e gases frequentes',
          'Pessoas com intestino irregular',
        ],
        notFor: [
          'Sangramento retal ativo',
          'Obstrução intestinal',
          'Doença inflamatória intestinal ativa',
        ],
      },
      whyItWorks: [
        'A saúde intestinal depende de uma microbiota equilibrada',
        'Probióticos repovoam bactérias benéficas',
        'Fibras alimentam as bactérias boas e regulam trânsito',
        'Acompanhamento médico identifica e trata causas específicas',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação intestinal',
          description: 'Responda perguntas sobre seus hábitos intestinais e sintomas',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda as causas e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Kit em casa',
          description: 'Receba probióticos, fibras e acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🦠',
          title: 'Microbiota equilibrada',
          description: 'Probióticos de alta qualidade para repovoar bactérias benéficas',
        },
        {
          icon: '🌾',
          title: 'Fibras personalizadas',
          description: 'Fórmula manipulada com fibras específicas para seu caso',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Avaliação médica',
          description: 'Gastroenterologista identifica causas e ajusta tratamento',
        },
        {
          icon: '📈',
          title: 'Resultados duradouros',
          description: 'Tratamento que restaura saúde intestinal a longo prazo',
        },
      ],
      faq: [
        {
          question: 'Quanto tempo para regular o intestino?',
          answer: 'Os primeiros sinais de melhora aparecem em 2-4 semanas. Regularização completa pode levar 2-3 meses.',
        },
        {
          question: 'Posso usar com outros probióticos?',
          answer: 'É importante informar todos os suplementos em uso. O médico orientará sobre combinações adequadas.',
        },
        {
          question: 'Vai causar gases?',
          answer: 'Pode haver aumento temporário de gases nas primeiras semanas, que diminui conforme a microbiota se equilibra.',
        },
        {
          question: 'Preciso mudar minha alimentação?',
          answer: 'Sim, o tratamento funciona melhor combinado com alimentação adequada. O nutricionista orientará mudanças específicas.',
        },
      ],
    },
    
    seo: {
      title: 'Regule seu Intestino: FloraBalance Probióticos + Fibras | Me Joy',
      description: 'Acabe com constipação e inchaço em 2-4 semanas. FloraBalance com probióticos de alta qualidade, fibras personalizadas e acompanhamento gastroenterologista. Intestino regulado. Check-up gratuito.',
      keywords: ['intestino preso', 'constipação', 'probióticos', 'microbiota', 'inchaço abdominal', 'gastroenterologista online', 'florabalance', 'intestino regulado', 'probióticos manipulado'],
    },
  },

  figado: {
    slug: 'figado',
    name: 'Fígado & Detox Metabólico',
    displayName: 'HepaDetox',
    commercialName: 'HepaDetox',
    protocolTitle: 'Fígado & Detox Metabólico',
    category: 'Gastroenterologia',
    description: 'Tratamento para fígado gorduroso e sobrecarga hepática com fitoterápicos e acompanhamento médico',
    shortDescription: 'Cuide do seu fígado e melhore sua saúde metabólica',
    image: '/products/hepadetox.svg',
    
    colors: {
      primary: 'amber',
      secondary: 'yellow',
      gradient: 'from-amber-700 via-amber-600 to-yellow-600',
      gradientCTA: 'from-amber-400 via-amber-500 to-yellow-400',
    },
    
    triageSlug: 'figado',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_FIGADO_P1',
        description: 'Só o HepaDetox para 30 dias. Sem consulta incluída.',
        features: [
          'HepaDetox para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_FIGADO_P2',
        description: 'HepaDetox + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_FIGADO_P3',
        description: 'HepaDetox + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Cuide do seu fígado e melhore sua saúde metabólica',
        subheadline: 'Programa completo: fitoterápicos hepáticos + acompanhamento médico especializado',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🌿', text: 'Silimarina e alcachofra para o fígado' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com hepatologista' },
          { icon: '🔬', text: 'Exames para monitorar função hepática' },
          { icon: '💚', text: 'Plano de alimentação para o fígado' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com fígado gorduroso (esteatose)',
          'Quem sente cansaço pós-refeição',
          'Pessoas com sobrecarga hepática',
        ],
        notFor: [
          'Hepatite aguda não tratada',
          'Cirrose hepática avançada',
          'Insuficiência hepática grave',
        ],
      },
      whyItWorks: [
        'O fígado é responsável por metabolizar toxinas e gorduras',
        'Fitoterápicos como silimarina protegem e regeneram células hepáticas',
        'Acompanhamento médico monitora função hepática',
        'Alimentação adequada reduz sobrecarga do fígado',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação hepática',
          description: 'Responda perguntas sobre sintomas e histórico',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda seu perfil hepático e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba suplemento e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🌿',
          title: 'Fitoterápicos comprovados',
          description: 'Silimarina e alcachofra com evidências científicas para saúde hepática',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Monitoramento médico',
          description: 'Hepatologista acompanha função hepática e ajusta tratamento',
        },
        {
          icon: '🔬',
          title: 'Exames incluídos',
          description: 'Guias para monitorar TGO, TGP e função hepática',
        },
        {
          icon: '💚',
          title: 'Alimentação adequada',
          description: 'Plano nutricional para reduzir sobrecarga do fígado',
        },
      ],
      faq: [
        {
          question: 'Quanto tempo para melhorar a função hepática?',
          answer: 'Os primeiros sinais de melhora aparecem em 4-6 semanas. Melhora significativa é observada após 3-6 meses.',
        },
        {
          question: 'Preciso fazer exames antes?',
          answer: 'Sim, especialmente se você tem histórico de problemas hepáticos. O médico orientará quais exames são necessários.',
        },
        {
          question: 'Posso usar com outros remédios?',
          answer: 'É importante informar todos os medicamentos. Alguns podem sobrecarregar o fígado e precisam ser ajustados.',
        },
        {
          question: 'Funciona para fígado gorduroso?',
          answer: 'Sim. O tratamento é especialmente indicado para esteatose hepática, combinando fitoterápicos e mudanças de estilo de vida.',
        },
      ],
    },
    
    seo: {
      title: 'Cuide do seu Fígado: HepaDetox para Fígado Gorduroso | Me Joy',
      description: 'Recupere a saúde do seu fígado em 3-6 meses. HepaDetox com silimarina e alcachofra, acompanhamento hepatologista e plano nutricional. Reduza esteatose hepática. Check-up gratuito.',
      keywords: ['fígado gorduroso', 'esteatose hepática', 'silimarina', 'detox fígado', 'hepatologista online', 'hepadetox', 'fígado saudável', 'sobrecarga hepática', 'tratamento fígado'],
    },
  },

  'libido-masculina': {
    slug: 'libido-masculina',
    name: 'Libido & Testosterona Masculina',
    displayName: 'VigorMax',
    commercialName: 'VigorMax',
    protocolTitle: 'Libido & Testosterona Masculina',
    category: 'Saúde Masculina',
    description: 'Tratamento para libido e testosterona com suplementos e acompanhamento médico especializado',
    shortDescription: 'Recupere sua energia e libido com tratamento personalizado',
    image: '/products/vigormax.svg',
    
    colors: {
      primary: 'red',
      secondary: 'rose',
      gradient: 'from-red-700 via-red-600 to-rose-600',
      gradientCTA: 'from-red-400 via-red-500 to-rose-400',
    },
    
    triageSlug: 'libido-masculina',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_LIBIDO_P1',
        description: 'Só o VigorMax para 30 dias. Sem consulta incluída.',
        features: [
          'VigorMax para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_LIBIDO_P2',
        description: 'VigorMax + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_LIBIDO_P3',
        description: 'VigorMax + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Recupere sua energia e libido com tratamento personalizado',
        subheadline: 'Programa completo: suplementos + acompanhamento médico para saúde masculina',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '💪', text: 'Suplementos para libido e testosterona' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com urologista/endocrinologista' },
          { icon: '🔬', text: 'Exames hormonais incluídos' },
          { icon: '💬', text: 'Suporte contínuo e discreto' },
        ],
      },
      eligibility: {
        for: [
          'Homens com diminuição de libido',
          'Quem sente falta de energia e disposição',
          'Pessoas com sintomas de baixa testosterona',
        ],
        notFor: [
          'Câncer de próstata não tratado',
          'Doenças cardíacas graves não controladas',
          'Uso de medicamentos para disfunção erétil sem prescrição',
        ],
      },
      whyItWorks: [
        'Libido e energia dependem de hormônios equilibrados',
        'Suplementos como maca e tribulus ajudam a regular testosterona',
        'Acompanhamento médico identifica causas hormonais',
        'Tratamento combinado com estilo de vida potencializa resultados',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação de saúde masculina',
          description: 'Responda perguntas sobre libido, energia e sintomas',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda suas causas e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba suplemento e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '💪',
          title: 'Energia e disposição',
          description: 'Suplementos que ajudam a recuperar energia e libido',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Avaliação hormonal',
          description: 'Urologista/endocrinologista avalia testosterona e ajusta tratamento',
        },
        {
          icon: '🔬',
          title: 'Exames incluídos',
          description: 'Guias para avaliar testosterona, prolactina e outros hormônios',
        },
        {
          icon: '💬',
          title: 'Suporte discreto',
          description: 'Acompanhamento respeitoso e profissional',
        },
      ],
      faq: [
        {
          question: 'Quanto tempo para sentir efeito?',
          answer: 'Os primeiros sinais de melhora aparecem em 3-4 semanas. Resultados mais significativos são observados após 2-3 meses.',
        },
        {
          question: 'Preciso fazer exames de testosterona?',
          answer: 'Sim, especialmente se você tem sintomas de baixa testosterona. O médico orientará quais exames são necessários.',
        },
        {
          question: 'Posso usar com outros suplementos?',
          answer: 'É importante informar todos os suplementos em uso. O médico avaliará interações e segurança.',
        },
        {
          question: 'Funciona para disfunção erétil?',
          answer: 'O suplemento pode ajudar, mas disfunção erétil pode ter causas múltiplas. O plano completo com médico é recomendado.',
        },
      ],
    },
    
    seo: {
      title: 'Recupere sua Libido e Energia: VigorMax Testosterona | Me Joy',
      description: 'Aumente libido e energia em 3-4 semanas. VigorMax com suplementos para testosterona, acompanhamento urologista/endocrinologista e exames hormonais. Recupere sua vitalidade. Check-up gratuito.',
      keywords: ['libido masculina', 'testosterona baixa', 'energia masculina', 'disposição', 'urologista online', 'vigormax', 'libido tratamento', 'testosterona natural', 'saúde masculina'],
    },
  },

  menopausa: {
    slug: 'menopausa',
    name: 'Menopausa & TPM 360',
    displayName: 'FemBalance 360',
    commercialName: 'FemBalance 360',
    protocolTitle: 'Menopausa & TPM 360',
    category: 'Saúde Feminina',
    description: 'Tratamento para menopausa e TPM com fitormônios e acompanhamento médico especializado',
    shortDescription: 'Alivie sintomas da menopausa e TPM com tratamento personalizado',
    image: '/products/fembalance-360.svg',
    
    colors: {
      primary: 'pink',
      secondary: 'rose',
      gradient: 'from-pink-700 via-pink-600 to-rose-600',
      gradientCTA: 'from-pink-400 via-pink-500 to-rose-400',
    },
    
    triageSlug: 'menopausa',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_MENOPAUSA_P1',
        description: 'Só o FemBalance 360 para 30 dias. Sem consulta incluída.',
        features: [
          'FemBalance 360 para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_MENOPAUSA_P2',
        description: 'FemBalance 360 + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_MENOPAUSA_P3',
        description: 'FemBalance 360 + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Alivie sintomas da menopausa e TPM com tratamento personalizado',
        subheadline: 'Programa completo: fitormônios + acompanhamento médico e nutricional',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🌸', text: 'Fitormônios naturais (isoflavonas)' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com ginecologista' },
          { icon: '🔬', text: 'Exames hormonais incluídos' },
          { icon: '💚', text: 'Suporte para todos os sintomas' },
        ],
      },
      eligibility: {
        for: [
          'Mulheres em menopausa ou perimenopausa',
          'Quem sofre com TPM intensa',
          'Pessoas com fogachos, insônia ou alterações de humor',
        ],
        notFor: [
          'Histórico de câncer de mama hormônio-dependente',
          'Trombose venosa ativa',
          'Doenças hepáticas graves',
        ],
      },
      whyItWorks: [
        'Menopausa causa queda de estrogênio e progesterona',
        'Fitormônios ajudam a aliviar sintomas naturalmente',
        'Acompanhamento médico garante segurança',
        'Tratamento multidisciplinar aborda todos os aspectos',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação de sintomas',
          description: 'Responda perguntas sobre menopausa, TPM e sintomas',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda suas causas e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba fitormônios e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🌸',
          title: 'Fitormônios naturais',
          description: 'Isoflavonas e cimicífuga com evidências para sintomas da menopausa',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Acompanhamento ginecológico',
          description: 'Ginecologista avalia e monitora tratamento',
        },
        {
          icon: '🔬',
          title: 'Exames incluídos',
          description: 'Guias para avaliar hormônios e saúde óssea',
        },
        {
          icon: '💚',
          title: 'Suporte completo',
          description: 'Equipe multidisciplinar para todos os sintomas',
        },
      ],
      faq: [
        {
          question: 'Fitormônios são seguros?',
          answer: 'Sim, quando usados com acompanhamento médico. O ginecologista avalia seu histórico e indica o tratamento adequado.',
        },
        {
          question: 'Quanto tempo para aliviar fogachos?',
          answer: 'Os primeiros sinais de melhora aparecem em 4-6 semanas. Redução significativa é observada após 2-3 meses.',
        },
        {
          question: 'Preciso fazer mamografia antes?',
          answer: 'Sim, especialmente se você tem mais de 40 anos ou histórico familiar. O médico orientará os exames necessários.',
        },
        {
          question: 'Funciona para TPM também?',
          answer: 'Sim. Fitormônios podem ajudar a regular sintomas de TPM quando relacionados a desequilíbrios hormonais.',
        },
      ],
    },
    
    seo: {
      title: 'Alivie Menopausa e TPM: FemBalance 360 Fitormônios | Me Joy',
      description: 'Reduza fogachos, insônia e alterações de humor em 4-6 semanas. FemBalance 360 com fitormônios naturais, acompanhamento ginecologista e exames hormonais. Menopausa sem sofrimento. Check-up gratuito.',
      keywords: ['menopausa', 'TPM', 'fogachos', 'fitormônios', 'ginecologista online', 'fembalance', 'sintomas menopausa', 'menopausa tratamento', 'isoflavonas'],
    },
  },

  articulacoes: {
    slug: 'articulacoes',
    name: 'Articulações & Coluna',
    displayName: 'ArticFlex',
    commercialName: 'ArticFlex',
    protocolTitle: 'Articulações & Coluna (dor crônica, mobilidade, inflamação)',
    category: 'Ortopedia',
    description: 'Tratamento para dor articular e problemas de coluna com colágeno e anti-inflamatórios naturais',
    shortDescription: 'Reduza dores articulares e melhore sua mobilidade',
    image: '/products/articflex.svg',
    
    colors: {
      primary: 'slate',
      secondary: 'gray',
      gradient: 'from-slate-700 via-slate-600 to-gray-600',
      gradientCTA: 'from-slate-400 via-slate-500 to-gray-400',
    },
    
    triageSlug: 'articulacoes',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ARTICULACOES_P1',
        description: 'Só o ArticFlex para 30 dias. Sem consulta incluída.',
        features: [
          'ArticFlex para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ARTICULACOES_P2',
        description: 'ArticFlex + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_ARTICULACOES_P3',
        description: 'ArticFlex + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Reduza dores articulares e melhore sua mobilidade',
        subheadline: 'Programa completo: colágeno + anti-inflamatórios naturais + acompanhamento médico',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🦴', text: 'Colágeno tipo II para articulações' },
          { icon: '🌿', text: 'Anti-inflamatórios naturais' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com ortopedista' },
          { icon: '💪', text: 'Plano de exercícios personalizado' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com dor articular crônica',
          'Quem tem artrose ou artrite',
          'Pessoas com problemas de coluna',
        ],
        notFor: [
          'Fraturas recentes não tratadas',
          'Infecções articulares ativas',
          'Doenças reumáticas graves não controladas',
        ],
      },
      whyItWorks: [
        'Articulações precisam de colágeno para manter integridade',
        'Anti-inflamatórios naturais reduzem dor sem efeitos colaterais',
        'Acompanhamento médico identifica causas e ajusta tratamento',
        'Exercícios adequados fortalecem e protegem articulações',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação de dor',
          description: 'Responda perguntas sobre localização e intensidade da dor',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda suas causas e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba suplemento e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🦴',
          title: 'Colágeno tipo II',
          description: 'Suplemento específico para saúde articular',
        },
        {
          icon: '🌿',
          title: 'Anti-inflamatórios naturais',
          description: 'Redução de dor sem efeitos colaterais de medicamentos',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Avaliação médica',
          description: 'Ortopedista/reumatologista avalia e ajusta tratamento',
        },
        {
          icon: '💪',
          title: 'Exercícios personalizados',
          description: 'Plano de atividade física adequado para seu caso',
        },
      ],
      faq: [
        {
          question: 'Quanto tempo para reduzir a dor?',
          answer: 'Os primeiros sinais de melhora aparecem em 4-6 semanas. Redução significativa é observada após 2-3 meses.',
        },
        {
          question: 'Preciso fazer exames de imagem?',
          answer: 'Depende do seu caso. O médico avaliará se radiografias ou ressonância são necessárias.',
        },
        {
          question: 'Posso usar com anti-inflamatórios convencionais?',
          answer: 'É importante informar todos os medicamentos. O médico orientará sobre uso combinado.',
        },
        {
          question: 'Funciona para artrose?',
          answer: 'Sim. O tratamento é especialmente indicado para artrose, combinando colágeno e anti-inflamatórios naturais.',
        },
      ],
    },
    
    seo: {
      title: 'Reduza Dores Articulares: ArticFlex Colágeno Tipo II | Me Joy',
      description: 'Diminua dores nas articulações e coluna em 4-6 semanas. ArticFlex com colágeno tipo II, anti-inflamatórios naturais e acompanhamento ortopedista. Melhore sua mobilidade. Check-up gratuito.',
      keywords: ['dor articular', 'artrose', 'colágeno', 'dor nas articulações', 'ortopedista online', 'articflex', 'dor coluna', 'mobilidade', 'articulações saudáveis'],
    },
  },

  imunidade: {
    slug: 'imunidade',
    name: 'Imunidade 360 & Fadiga Recorrente',
    displayName: 'Imuno360',
    commercialName: 'Imuno360',
    protocolTitle: 'Imunidade 360 & Fadiga Recorrente',
    category: 'Imunologia',
    description: 'Tratamento para fortalecer imunidade e reduzir infecções recorrentes com vitaminas e probióticos',
    shortDescription: 'Fortalça sua imunidade e reduza infecções recorrentes',
    image: '/products/imuno360.svg',
    
    colors: {
      primary: 'cyan',
      secondary: 'blue',
      gradient: 'from-cyan-700 via-cyan-600 to-blue-600',
      gradientCTA: 'from-cyan-400 via-cyan-500 to-blue-400',
    },
    
    triageSlug: 'imunidade',
    reportEngine: 'geral',
    
    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: 'Plano 1 – Essencial',
        price: 'R$ 139',
        unitPrice: 139,
        period: '',
        stripePriceId: 'STRIPE_PRICE_IMUNIDADE_P1',
        description: 'Só o Imuno360 para 30 dias. Sem consulta incluída.',
        features: [
          'Imuno360 para 30 dias (1 unidade)',
          'Você pode aumentar a quantidade se quiser levar para mais meses ou para outras pessoas',
          'Sem consulta incluída',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: 'Plano 2 – Produto + Consulta',
        badge: 'Mais Popular',
        price: 'R$ 209',
        unitPrice: 209,
        period: '',
        stripePriceId: 'STRIPE_PRICE_IMUNIDADE_P2',
        description: 'Imuno360 + 1 consulta clínica online em até 30 minutos quando você decidir usar.',
        features: [
          'Tudo do Plano Essencial',
          '1 consulta clínica online em até 30 minutos, quando você decidir usar, de qualquer lugar',
          'Uso sob supervisão médica',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: 'Plano 3 – Protocolo Completo 360',
        badge: 'Melhor Custo-Benefício',
        price: 'R$ 278',
        unitPrice: 278,
        period: '',
        stripePriceId: 'STRIPE_PRICE_IMUNIDADE_P3',
        description: 'Imuno360 + consulta clínica + orientação nutricional inicial + apoio psicológico inicial + guia de exames de check-up padrão ouro para a idade.',
        features: [
          'Tudo do Plano Produto + Consulta',
          'Orientação nutricional inicial',
          'Apoio psicológico inicial',
          'Guia de exames de check-up padrão ouro para a sua idade',
        ],
      },
    },
    
    lpac: {
      hero: {
        headline: 'Fortaleça sua imunidade e reduza infecções recorrentes',
        subheadline: 'Programa completo: vitaminas + probióticos + acompanhamento médico especializado',
        ctaText: 'Fazer avaliação gratuita',
        bullets: [
          { icon: '🛡️', text: 'Vitamina C + D + Zinco para imunidade' },
          { icon: '🦠', text: 'Probióticos para microbiota intestinal' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento com imunologista' },
          { icon: '📊', text: 'Exames para identificar deficiências' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com infecções recorrentes (gripes, resfriados)',
          'Quem sente fadiga constante',
          'Pessoas com deficiências nutricionais',
        ],
        notFor: [
          'Imunodeficiências graves não tratadas',
          'Doenças autoimunes não controladas',
          'Uso de imunossupressores sem acompanhamento',
        ],
      },
      whyItWorks: [
        'A imunidade depende de nutrientes essenciais e microbiota equilibrada',
        'Vitamina D, C e Zinco são fundamentais para sistema imune',
        'Probióticos fortalecem barreira intestinal',
        'Acompanhamento médico identifica e trata deficiências',
      ],
      howItWorks: [
        {
          step: 1,
          title: 'Avaliação de imunidade',
          description: 'Responda perguntas sobre infecções e sintomas',
        },
        {
          step: 2,
          title: 'Relatório personalizado',
          description: 'Entenda suas deficiências e receba plano de tratamento',
        },
        {
          step: 3,
          title: 'Escolha seu plano',
          description: 'Produto apenas, produto + médico, ou time completo',
        },
        {
          step: 4,
          title: 'Tratamento em casa',
          description: 'Receba vitaminas, probióticos e tenha acompanhamento contínuo',
        },
      ],
      benefits: [
        {
          icon: '🛡️',
          title: 'Vitaminas essenciais',
          description: 'Vitamina C, D e Zinco em doses adequadas para imunidade',
        },
        {
          icon: '🦠',
          title: 'Microbiota equilibrada',
          description: 'Probióticos que fortalecem barreira intestinal',
        },
        {
          icon: '🧑‍⚕️',
          title: 'Avaliação médica',
          description: 'Imunologista identifica deficiências e ajusta tratamento',
        },
        {
          icon: '📊',
          title: 'Exames incluídos',
          description: 'Guias para avaliar deficiências nutricionais',
        },
      ],
      faq: [
        {
          question: 'Quanto tempo para fortalecer a imunidade?',
          answer: 'Os primeiros sinais de melhora aparecem em 4-6 semanas. Fortalecimento consistente é observado após 2-3 meses.',
        },
        {
          question: 'Preciso fazer exames antes?',
          answer: 'Sim, especialmente se você tem infecções recorrentes. O médico orientará quais exames são necessários.',
        },
        {
          question: 'Posso usar com outros suplementos?',
          answer: 'É importante informar todos os suplementos em uso. O médico avaliará interações e doses adequadas.',
        },
        {
          question: 'Funciona para prevenir gripes?',
          answer: 'Sim. O tratamento fortalece sistema imune e pode reduzir frequência e intensidade de infecções.',
        },
      ],
    },
    
    seo: {
      title: 'Fortalça sua Imunidade: Imuno360 Vitaminas + Probióticos | Me Joy',
      description: 'Reduza gripes e infecções recorrentes em 4-6 semanas. Imuno360 com vitamina C, D, Zinco e probióticos, acompanhamento imunologista e exames. Sistema imune fortalecido. Check-up gratuito.',
      keywords: ['imunidade baixa', 'gripes recorrentes', 'vitamina D', 'probióticos imunidade', 'imunologista online', 'imuno360', 'fortalecer imunidade', 'infecções recorrentes', 'sistema imune'],
    },
  },

  tirzepatida: {
    slug: 'tirzepatida',
    name: 'Tirzepatida (Rx)',
    displayName: 'Programa Metabólico Rx',
    commercialName: 'Programa Metabólico Rx',
    protocolTitle: 'Tirzepatida sob prescrição médica',
    category: 'Metabolismo',
    description: 'Tratamento com tirzepatida sob prescrição e dispensa regular',
    shortDescription: 'Programa metabólico com tirzepatida (Rx)',
    image: '/products/metaboslim.svg',

    colors: {
      primary: 'purple',
      secondary: 'violet',
      gradient: 'from-purple-700 via-purple-600 to-violet-600',
      gradientCTA: 'from-purple-400 via-purple-500 to-violet-400',
    },

    triageSlug: 'emagrecimento', // usa triagem metabólica (mesma do emagrecimento)
    reportEngine: 'metabolico',

    plans: {
      basico: {
        id: 'basico',
        slug: 'essencial',
        name: '2,5 mg/mL',
        price: 'R$ 1.000',
        unitPrice: 1000,
        period: '/mês',
        stripePriceId: 'ASAAS_PRICE_TIRZEPATIDA_2_5',
        description: 'Tirzepatida 2,5 mg/mL. Somente com prescrição.',
        features: [
          'Tirzepatida 2,5 mg/mL',
          'Prescrição e dispensa regular',
          'Acompanhamento médico',
        ],
      },
      completo: {
        id: 'completo',
        slug: 'produto-consulta',
        name: '5 mg/mL',
        badge: 'Mais escolhido',
        price: 'R$ 2.000',
        unitPrice: 2000,
        period: '/mês',
        stripePriceId: 'ASAAS_PRICE_TIRZEPATIDA_5',
        description: 'Tirzepatida 5 mg/mL. Somente com prescrição.',
        features: [
          'Tirzepatida 5 mg/mL',
          'Prescrição e dispensa regular',
          'Acompanhamento médico',
        ],
        recommended: true,
      },
      premium: {
        id: 'premium',
        slug: 'protocolo-completo',
        name: '20 mg/mL',
        badge: 'Dose máxima',
        price: 'R$ 2.500',
        unitPrice: 2500,
        period: '/mês',
        stripePriceId: 'ASAAS_PRICE_TIRZEPATIDA_20',
        description: 'Tirzepatida 20 mg/mL. Somente com prescrição.',
        features: [
          'Tirzepatida 20 mg/mL',
          'Prescrição e dispensa regular',
          'Acompanhamento médico',
        ],
      },
    },

    lpac: {
      hero: {
        headline: 'Programa Metabólico Rx — Tirzepatida',
        subheadline: 'Tratamento sob prescrição médica. Somente com avaliação e dispensa regular.',
        ctaText: 'Verificar elegibilidade',
        bullets: [
          { icon: '💊', text: 'Medicamento sob prescrição' },
          { icon: '✅', text: 'Normas ANVISA' },
          { icon: '🧑‍⚕️', text: 'Acompanhamento médico' },
        ],
      },
      eligibility: {
        for: [
          'Pessoas com IMC acima de 27 kg/m²',
          'Com indicação médica para tirzepatida',
        ],
        notFor: [
          'Gestantes ou amamentando',
          'Histórico de câncer de tireoide medular',
          'Sem prescrição médica',
        ],
      },
      whyItWorks: [
        'Tirzepatida é um agonista dual GIP/GLP-1 com eficácia comprovada',
        'Prescrição e acompanhamento médico garantem segurança',
        'Dispensa regular conforme normas',
      ],
      howItWorks: [
        { step: 1, title: 'Triagem', description: 'Avalie sua elegibilidade' },
        { step: 2, title: 'Relatório', description: 'Análise e recomendações' },
        { step: 3, title: 'Escolha a dose', description: '2,5 / 5 / 20 mg/mL' },
        { step: 4, title: 'Tratamento', description: 'Receba e acompanhe' },
      ],
      benefits: [
        { icon: '🎯', title: 'Personalizado', description: 'Dose ajustada ao seu caso' },
        { icon: '🔬', title: 'Evidências', description: 'Baseado em estudos clínicos' },
        { icon: '🛡️', title: 'Segurança', description: 'Prescrição e acompanhamento' },
      ],
      faq: [
        {
          question: 'Preciso de receita?',
          answer: 'Sim. Todo uso é feito apenas com prescrição e dispensa regular.',
        },
        {
          question: 'Qual a diferença entre as doses?',
          answer: '2,5 mg/mL (inicial), 5 mg/mL (manutenção) e 20 mg/mL (dose máxima). O médico indica conforme seu caso.',
        },
      ],
    },

    seo: {
      title: 'Tirzepatida sob Prescrição | Programa Metabólico Rx',
      description: 'Tratamento com tirzepatida sob prescrição médica. Doses 2,5, 5 e 20 mg/mL. Acompanhamento especializado.',
      keywords: ['tirzepatida', 'emagrecimento', 'GLP-1', 'prescrição', 'programa metabólico'],
    },
  },
};

/** Produto teste R$ 10 — só quando NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT=1 */
const TESTE_PRODUCT: ZapfarmProductConfig = {
  slug: 'teste',
  name: 'Teste Checkout',
  displayName: 'Teste Checkout',
  commercialName: 'Teste Checkout',
  protocolTitle: 'Validação de fluxo',
  category: 'Teste',
  description: 'Produto para validar checkout (R$ 10)',
  shortDescription: 'Teste R$ 10',
  image: '/products/metaboslim.svg',
  colors: {
    primary: 'gray',
    secondary: 'slate',
    gradient: 'from-gray-600 to-slate-600',
    gradientCTA: 'from-gray-500 to-slate-500',
  },
  triageSlug: 'geral',
  reportEngine: 'geral',
  plans: {
    basico: {
      id: 'basico',
      slug: 'essencial',
      name: 'Teste',
      price: 'R$ 10',
      unitPrice: 10,
      period: '',
      stripePriceId: 'ASAAS_PRICE_TESTE',
      description: 'Validação de checkout',
      features: ['Pagamento de teste', 'R$ 10'],
    },
    completo: {
      id: 'completo',
      slug: 'essencial',
      name: 'Teste',
      price: 'R$ 10',
      unitPrice: 10,
      period: '',
      stripePriceId: 'ASAAS_PRICE_TESTE',
      description: 'Validação de checkout',
      features: ['Pagamento de teste', 'R$ 10'],
    },
    premium: {
      id: 'premium',
      slug: 'essencial',
      name: 'Teste',
      price: 'R$ 10',
      unitPrice: 10,
      period: '',
      stripePriceId: 'ASAAS_PRICE_TESTE',
      description: 'Validação de checkout',
      features: ['Pagamento de teste', 'R$ 10'],
    },
  },
  lpac: {
    hero: { headline: 'Teste Checkout', subheadline: 'R$ 10', ctaText: 'Testar' },
    eligibility: { for: ['Validação'], notFor: [] },
    whyItWorks: [],
    howItWorks: [],
    benefits: [],
    faq: [],
  },
  seo: { title: 'Teste', description: 'Teste', keywords: [] },
};

/**
 * Helper para obter todos os produtos
 */
export function getAllProducts(): ZapfarmProductConfig[] {
  const list = Object.values(ZAPFARM_PRODUCTS);
  const testEnabled =
    process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === '1' ||
    process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === 'true';
  if (testEnabled) list.push(TESTE_PRODUCT);
  return list;
}

/**
 * Helper para obter produto por slug
 */
export function getProductConfig(slug: string): ZapfarmProductConfig | null {
  if (slug === 'teste') {
    const enabled =
      process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === '1' ||
      process.env.NEXT_PUBLIC_TEST_CHECKOUT_PRODUCT === 'true';
    return enabled ? TESTE_PRODUCT : null;
  }
  return ZAPFARM_PRODUCTS[slug] || null;
}

/**
 * Helper para obter planos de um produto
 */
export function getProductPlans(slug: string) {
  const product = getProductConfig(slug);
  if (!product) return null;
  
  return {
    basico: product.plans.basico,
    completo: product.plans.completo,
    premium: product.plans.premium,
  };
}

/**
 * Helper para obter produtos por categoria
 */
export function getProductsByCategory(category: string): ZapfarmProductConfig[] {
  return getAllProducts().filter(p => p.category === category);
}
