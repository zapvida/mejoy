import {
  medicalQuickActions,
  pharmacyQuickActions,
  premiumStories,
  profileQuickActions,
  todayFeatureCards,
  weeklyGoals,
  type StoryBadgeTone,
  type StoryDefinition,
} from '../content/mejoy-premium';

export type CatalogoBadgeTone = 'good' | 'attention' | 'high' | 'low';

export type CatalogoMetric = {
  label: string;
  value: string;
  caption: string;
  tone?: 'brand' | 'accent' | 'warning' | 'default';
};

export type CatalogoSectionItem =
  | {
      type: 'action';
      eyebrow: string;
      title: string;
      description: string;
      caption?: string;
      tone?: 'default' | 'brand' | 'accent';
    }
  | {
      type: 'timeline';
      title: string;
      subtitle: string;
      meta?: string;
      tone?: 'default' | 'success' | 'warning';
    }
  | {
      type: 'text';
      body: string;
    }
  | {
      type: 'badges';
      badges: Array<{ label: string; tone: CatalogoBadgeTone }>;
    };

export type CatalogoSection = {
  eyebrow: string;
  title: string;
  support?: string;
  tone?: 'default' | 'muted';
  items: CatalogoSectionItem[];
};

export type CatalogoScreenDefinition = {
  screenId: string;
  route: string;
  tier: 'entrada' | '1m' | '3m' | '6m';
  state: 'happy' | 'empty' | 'permission-denied' | 'error' | 'locked';
  device: 'iphone';
  build: 'catalogo-local';
  catalogoStatus: 'ready';
  eyebrow: string;
  title: string;
  summary: string;
  badge?: { label: string; tone: CatalogoBadgeTone };
  metrics?: CatalogoMetric[];
  sections: CatalogoSection[];
};

function mapBadgeTone(tone?: StoryBadgeTone): CatalogoBadgeTone {
  if (tone === 'success' || tone === 'brand') return 'good';
  if (tone === 'warning') return 'attention';
  if (tone === 'danger') return 'high';
  return 'low';
}

function mapActionTone(tone?: 'default' | 'brand' | 'accent' | 'dark') {
  if (tone === 'accent') return 'accent' as const;
  if (tone === 'brand' || tone === 'dark') return 'brand' as const;
  return 'default' as const;
}

function mapStory(screenId: string, route: string, tier: CatalogoScreenDefinition['tier'], state: CatalogoScreenDefinition['state'], story: StoryDefinition): CatalogoScreenDefinition {
  return {
    screenId,
    route,
    tier,
    state,
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: story.eyebrow,
    title: story.title,
    summary: story.summary,
    badge: story.badge ? { label: story.badge.label, tone: mapBadgeTone(story.badge.tone) } : undefined,
    metrics: story.metrics?.map((metric) => ({
      label: metric.label,
      value: metric.value,
      caption: metric.caption || '',
      tone: metric.tone === 'success' ? 'brand' : metric.tone === 'accent' ? 'accent' : metric.tone === 'warning' ? 'warning' : metric.tone === 'brand' ? 'brand' : 'default',
    })),
    sections: story.sections.map((section) => ({
      eyebrow: section.eyebrow,
      title: section.title,
      support: section.support,
      items: section.items.map((item) => {
        if (item.type === 'action') {
          return {
            type: 'action',
            eyebrow: item.eyebrow,
            title: item.title,
            description: item.description,
            caption: item.href ? 'Abrir fluxo' : 'Continuar',
            tone: mapActionTone(item.tone),
          };
        }

        if (item.type === 'timeline') {
          return {
            type: 'timeline',
            title: item.title,
            subtitle: item.subtitle,
            meta: item.meta,
            tone: item.tone,
          };
        }

        if (item.type === 'badges') {
          return {
            type: 'badges',
            badges: item.badges.map((badge) => ({
              label: badge.label,
              tone: mapBadgeTone(badge.tone),
            })),
          };
        }

        return {
          type: 'text',
          body: item.body,
        };
      }),
    })),
  };
}

export const catalogoScreenDefinitions: CatalogoScreenDefinition[] = [
  {
    screenId: '00-splash-premium',
    route: '/onboarding',
    tier: 'entrada',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Splash',
    title: 'MeJoy, seu cuidado integral em uma interface só',
    summary: 'A entrada precisa parecer premium, médica e simples: sem ruído, sem template barato e com valor entendido em segundos.',
    badge: { label: 'store-safe v1', tone: 'good' },
    metrics: [
      { label: 'Ecossistema', value: '4 hubs', caption: 'MeJoy, ZapVida, Aimnesis e ZapFarm', tone: 'brand' },
      { label: 'Experiência', value: '1 fluxo', caption: 'paciente no centro', tone: 'accent' },
    ],
    sections: [
      {
        eyebrow: 'Valor',
        title: 'O paciente entra e já entende o que ganha',
        items: [
          { type: 'text', body: 'Plano, IA, médico, GLP-1, farmácia, sono e comportamento entram em uma experiência única de saúde integral.' },
        ],
      },
    ],
  },
  {
    screenId: '01-onboarding-premium',
    route: '/onboarding',
    tier: 'entrada',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Onboarding',
    title: 'Agora você entende seu plano, o que fazer hoje e quem cuida com você',
    summary: 'O onboarding deixa claro o valor do app sem virar apresentação longa demais.',
    badge: { label: 'claro em 5s', tone: 'good' },
    sections: [
      {
        eyebrow: 'Promessa real',
        title: 'Três pilares que o app já mostra',
        items: [
          { type: 'action', eyebrow: 'Hoje', title: 'Check-in, score e próxima ação', description: 'O paciente sabe o que fazer no primeiro minuto.', tone: 'brand' },
          { type: 'action', eyebrow: 'Médico', title: 'Telemedicina com resumo automático', description: 'O atendimento começa com contexto e menos repetição.', tone: 'accent' },
          { type: 'action', eyebrow: 'Farmácia', title: 'Prescrição, pedido e recompra organizados', description: 'Tudo em um fluxo legível e seguro.' },
        ],
      },
    ],
  },
  mapStory('02-checkup-inicial', '/checkup', 'entrada', 'happy', premiumStories.checkup),
  mapStory('03-checkup-resultado', '/checkup-result', 'entrada', 'happy', premiumStories['checkup-result']),
  {
    screenId: '04-hoje-dashboard',
    route: '/',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Hoje',
    title: 'Seu dia está organizado com score, próxima ação e suporte médico',
    summary: 'A home virou cockpit: check-in, GLP-1, refeição, sintomas, sono, médico e farmácia convivem sem poluição.',
    badge: { label: 'home aprovada', tone: 'good' },
    metrics: [
      { label: 'Score', value: '78/100', caption: 'hábitos + adesão + prevenção', tone: 'brand' },
      { label: 'GLP-1', value: '7,5 mg', caption: 'dose atual', tone: 'accent' },
      { label: 'Sono', value: '84/100', caption: 'snapshot recente', tone: 'warning' },
      { label: 'Plano', value: 'Dia 28', caption: 'de 90 dias', tone: 'default' },
    ],
    sections: [
      {
        eyebrow: 'Primeira dobra',
        title: 'O usuário entende a tela em até 5 segundos',
        items: [
          { type: 'action', eyebrow: 'CTA principal', title: 'Começar check-in de hoje', description: 'Sintomas, energia, fome e sono entram num fluxo curto e claro.', tone: 'brand' },
          { type: 'action', eyebrow: 'CTA secundário', title: 'Falar com médico agora', description: 'Resumo clínico já segue antes do contato com a equipe.', tone: 'accent' },
        ],
      },
      {
        eyebrow: 'As 10 features',
        title: 'Tudo aparece como bloco útil, não como vitrine solta',
        items: todayFeatureCards.map((card) => ({
          type: 'action',
          eyebrow: card.eyebrow,
          title: card.title,
          description: card.body,
          tone: card.tone === 'accent' ? 'accent' : card.tone === 'brand' ? 'brand' : 'default',
        })),
      },
    ],
  },
  {
    screenId: '05-plano-90-dias',
    route: '/plan',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Plano',
    title: 'Seu programa de 90 dias ficou claro, visual e acionável',
    summary: 'A aba Plano mostra fase atual, metas semanais, evolução e educação curta sem transformar tudo em texto.',
    badge: { label: '90 dias', tone: 'good' },
    metrics: weeklyGoals.map((goal) => ({
      label: goal.label,
      value: goal.value,
      caption: goal.caption,
      tone: goal.tone === 'success' ? 'brand' : goal.tone === 'accent' ? 'accent' : goal.tone === 'warning' ? 'warning' : 'brand',
    })),
    sections: [
      {
        eyebrow: 'Linha do tempo',
        title: 'O plano mostra a curva do tratamento',
        items: [
          { type: 'timeline', title: 'Semana 1', subtitle: 'Entrar na rotina com baixa fricção.', meta: 'entrada', tone: 'success' },
          { type: 'timeline', title: 'Semana 4', subtitle: 'Consolidar água, proteína e sintomas.', meta: 'agora', tone: 'warning' },
          { type: 'timeline', title: 'Semana 12', subtitle: 'Fechar o ciclo com dados limpos e próximos passos.', meta: 'meta', tone: 'default' },
        ],
      },
    ],
  },
  {
    screenId: '06-medico-tab',
    route: '/medical',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Médico',
    title: 'Telemedicina, resumo clínico e histórico em um hub claro',
    summary: 'O paciente sabe como chamar ajuda, o que o médico já vai ver e o que fica salvo depois.',
    badge: { label: 'ZapVida preparado', tone: 'low' },
    sections: [
      {
        eyebrow: 'Canais',
        title: 'Escolha o modo de atendimento',
        items: medicalQuickActions.map((action) => ({
          type: 'action',
          eyebrow: action.eyebrow,
          title: action.title,
          description: action.description,
          tone: action.tone === 'default' ? 'default' : 'brand',
        })),
      },
    ],
  },
  {
    screenId: '07-farmacia-tab',
    route: '/pharmacy',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Farmácia',
    title: 'Prescrição, pedido e recompra aparecem com menos ruído',
    summary: 'A aba Farmácia transmite organização e confiança, não catálogo quebrado.',
    badge: { label: 'ZapFarm modelado', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Fluxos',
        title: 'Tudo o que o paciente precisa ver',
        items: pharmacyQuickActions.map((action) => ({
          type: 'action',
          eyebrow: action.eyebrow,
          title: action.title,
          description: action.description,
          tone: action.tone === 'accent' ? 'accent' : action.tone === 'brand' ? 'brand' : 'default',
        })),
      },
    ],
  },
  {
    screenId: '08-profile',
    route: '/profile',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Perfil',
    title: 'Plano, integrações, segurança e suporte sem menu confuso',
    summary: 'A conta virou base organizada do paciente, com o que está ativo e para onde ir em seguida.',
    badge: { label: 'organizado', tone: 'good' },
    sections: [
      {
        eyebrow: 'Ações rápidas',
        title: 'O perfil abre destinos úteis, não páginas mortas',
        items: profileQuickActions.map((action) => ({
          type: 'action',
          eyebrow: action.eyebrow,
          title: action.title,
          description: action.description,
          tone: action.tone === 'accent' ? 'accent' : action.tone === 'brand' ? 'brand' : 'default',
        })),
      },
    ],
  },
  {
    screenId: '09-meal-photo',
    route: '/meal-analysis',
    tier: '1m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Meal AI',
    title: 'Foto do prato, texto ou cardápio no mesmo fluxo',
    summary: 'A entrada da refeição ficou premium, simples e útil para o dia a dia real.',
    badge: { label: 'multimodal', tone: 'good' },
    sections: [
      {
        eyebrow: 'Entrada',
        title: 'O paciente escolhe o jeito mais rápido',
        items: [
          { type: 'action', eyebrow: 'Foto', title: 'Usar câmera ou galeria', description: 'Imagem, OCR e texto caminham para a mesma análise final.', tone: 'brand' },
          { type: 'action', eyebrow: 'Texto', title: 'Descrever a refeição em linguagem natural', description: 'Sem bloquear o fluxo quando a foto não fizer sentido.', tone: 'accent' },
        ],
      },
    ],
  },
  {
    screenId: '10-meal-result',
    route: '/meal-result',
    tier: '1m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Meal AI',
    title: 'Boa escolha para hoje, com uma troca simples ainda melhor',
    summary: 'A resposta mostra macros, impacto metabólico e uma sugestão prática sem linguagem fria.',
    badge: { label: 'qualidade boa', tone: 'good' },
    metrics: [
      { label: 'Calorias', value: '540 kcal', caption: 'estimadas', tone: 'brand' },
      { label: 'Proteína', value: '34 g', caption: 'saciedade melhor', tone: 'accent' },
      { label: 'Fibras', value: '9 g', caption: 'bom suporte', tone: 'warning' },
    ],
    sections: [
      {
        eyebrow: 'Leitura',
        title: 'O app ensina sem parecer bronca',
        items: [
          { type: 'text', body: 'Boa base de proteína e volume. Se a náusea estiver sensível hoje, vale reduzir gordura pesada e reforçar água.' },
        ],
      },
    ],
  },
  mapStory('11-scanner', '/product-scanner', '1m', 'happy', premiumStories['product-scanner']),
  mapStory('12-scan-result', '/scan-result', '1m', 'happy', premiumStories['scan-result']),
  mapStory('13-glp1-journey', '/glp1-journey', '1m', 'happy', premiumStories['glp1-journey']),
  mapStory('14-dose-application', '/dose-application', '1m', 'happy', premiumStories['dose-application']),
  mapStory('15-symptom-checkin', '/symptom-checkin', '3m', 'happy', premiumStories['symptom-checkin']),
  mapStory('16-symptom-alert', '/symptom-alert', '3m', 'happy', premiumStories['symptom-alert']),
  mapStory('17-telemedicine', '/telemedicine', '3m', 'happy', premiumStories.telemedicine),
  mapStory('18-doctor-queue', '/doctor-queue', '3m', 'happy', premiumStories['doctor-queue']),
  mapStory('19-doctor-chat', '/doctor-chat', '3m', 'happy', premiumStories['doctor-chat']),
  mapStory('20-nutrition-coach', '/nutrition-coach', '3m', 'happy', premiumStories['nutrition-coach']),
  mapStory('21-metabolic-monitor', '/metabolic-monitor', '6m', 'happy', premiumStories['metabolic-monitor']),
  mapStory('22-mind-sleep', '/mind-sleep', '3m', 'happy', premiumStories['mind-sleep']),
  mapStory('23-ritual-player', '/ritual-player', '3m', 'happy', premiumStories['ritual-player']),
  mapStory('24-prescriptions', '/prescriptions', '3m', 'happy', premiumStories.prescriptions),
  mapStory('25-order-status', '/order-status', '3m', 'happy', premiumStories['order-status']),
  mapStory('26-reorder', '/reorder', '3m', 'happy', premiumStories.reorder),
  mapStory('27-integrations', '/integrations', '6m', 'permission-denied', premiumStories.integrations),
  mapStory('28-plan-membership', '/plan-membership', '6m', 'happy', premiumStories['plan-membership']),
  {
    screenId: '29-empty-state',
    route: '/pharmacy',
    tier: '1m',
    state: 'empty',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Estado vazio',
    title: 'Nenhum pedido ativo por enquanto',
    summary: 'Estados vazios não podem parecer erro nem abandono. Eles precisam orientar a próxima ação com calma.',
    badge: { label: 'empty', tone: 'low' },
    sections: [
      {
        eyebrow: 'Sem ruído',
        title: 'O usuário ainda sabe o que fazer',
        items: [
          { type: 'action', eyebrow: 'Próximo passo', title: 'Abrir primeira compra do ciclo', description: 'Quando houver prescrição pronta, o fluxo farmacêutico entra aqui sem quebrar o resto do app.', tone: 'brand' },
        ],
      },
    ],
  },
  {
    screenId: '30-loading-state',
    route: '/medical',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Loading',
    title: 'Montando sua área médica',
    summary: 'O loading também precisa parecer premium: contexto curto, expectativa clara e sem tela branca vazia.',
    badge: { label: 'carregando', tone: 'low' },
    sections: [
      {
        eyebrow: 'Percepção',
        title: 'O sistema explica o que está fazendo',
        items: [
          { type: 'text', body: 'Estou organizando fila, resumo clínico e histórico recente para você.' },
        ],
      },
    ],
  },
  {
    screenId: '31-error-state',
    route: '/plan',
    tier: '3m',
    state: 'error',
    device: 'iphone',
    build: 'catalogo-local',
    catalogoStatus: 'ready',
    eyebrow: 'Erro amigável',
    title: 'Não consegui abrir seu plano agora',
    summary: 'A falha precisa ser legível, calma e recuperável, sem assustar nem abandonar o usuário.',
    badge: { label: 'recuperável', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Mensagem',
        title: 'O app explica sem parecer quebrado',
        items: [
          { type: 'text', body: 'Tente atualizar em instantes. Seus dados e sua jornada continuam preservados.' },
        ],
      },
    ],
  },
  mapStory('32-success-state', '/success-state', '3m', 'happy', premiumStories['success-state']),
];
