export type StoryBadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'dark';

export type StoryMetric = {
  label: string;
  value: string;
  caption?: string;
  tone?: 'default' | 'brand' | 'accent' | 'warning' | 'success';
};

export type StorySectionItem =
  | {
      type: 'action';
      eyebrow: string;
      title: string;
      description: string;
      href?: string;
      tone?: 'default' | 'brand' | 'accent' | 'dark';
      badge?: { label: string; tone?: StoryBadgeTone };
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
      badges: Array<{ label: string; tone?: StoryBadgeTone }>;
    };

export type StorySection = {
  eyebrow: string;
  title: string;
  support?: string;
  items: StorySectionItem[];
};

export type StoryDefinition = {
  eyebrow: string;
  title: string;
  summary: string;
  support?: string;
  badge?: { label: string; tone?: StoryBadgeTone };
  metrics?: StoryMetric[];
  sections: StorySection[];
  primaryCta?: { label: string; href?: string };
  secondaryCta?: { label: string; href?: string };
};

export const todayFeatureCards = [
  {
    eyebrow: 'Meal AI',
    title: 'Fotografe ou descreva a refeição',
    body: 'A IA estima macros, qualidade metabólica e a melhor próxima troca.',
    href: '/meal-analysis',
    tone: 'brand' as const,
  },
  {
    eyebrow: 'Scanner',
    title: 'Leia o rótulo antes de comprar',
    body: 'O app mostra açúcar, sódio, ultraprocessado e alternativa melhor.',
    href: '/product-scanner',
    tone: 'accent' as const,
  },
  {
    eyebrow: 'GLP-1',
    title: 'Registre aplicação e sintomas',
    body: 'Dose, rotação de local, náusea e hidratação ficam na mesma linha.',
    href: '/glp1-journey',
    tone: 'default' as const,
  },
  {
    eyebrow: 'Mente e sono',
    title: 'Proteja sua próxima escolha',
    body: 'Uma trilha curta ajuda compulsão, ansiedade e sono.',
    href: '/mind-sleep',
    tone: 'warm' as const,
  },
] as const;

export const planMilestones = [
  { title: 'Semana 1', subtitle: 'Adaptar rotina, água e proteína sem exagerar na carga.', meta: 'fase de entrada', tone: 'success' as const },
  { title: 'Semana 4', subtitle: 'Ajustar repetição, reduzir atrito alimentar e proteger massa magra.', meta: 'fase atual', tone: 'warning' as const },
  { title: 'Semana 8', subtitle: 'Consolidar constância, treino e leitura de sintomas.', meta: 'próxima curva', tone: 'default' as const },
  { title: 'Semana 12', subtitle: 'Fechar ciclo com dados limpos para manutenção ou novo objetivo.', meta: '90 dias', tone: 'default' as const },
] as const;

export const weeklyGoals = [
  { label: 'Proteína', value: '5/7', caption: 'Meta semanal', tone: 'brand' as const },
  { label: 'Água', value: '4/7', caption: 'Janela diária', tone: 'accent' as const },
  { label: 'Força', value: '2/3', caption: 'Treino previsto', tone: 'success' as const },
  { label: 'Sono', value: '78', caption: 'Score médio', tone: 'warning' as const },
] as const;

export const medicalQuickActions = [
  {
    eyebrow: 'ZapVida',
    title: 'Falar com médico agora',
    description: 'O médico recebe resumo automático com queixa, dose, sintomas e exames antes do contato.',
    href: '/telemedicine',
    tone: 'dark' as const,
    badge: { label: 'preparado', tone: 'dark' as const },
  },
  {
    eyebrow: 'Fila',
    title: 'Ver atendimento em andamento',
    description: 'Tempo estimado, modo de atendimento e orientações pré-consulta ficam claros.',
    href: '/doctor-queue',
    tone: 'default' as const,
  },
  {
    eyebrow: 'Especialista',
    title: 'Pedir linha premium',
    description: 'Nutrologia, endócrino, nutrição ou psicologia entram por governança clínica.',
    href: '/specialist-request',
    tone: 'brand' as const,
  },
] as const;

export const pharmacyQuickActions = [
  {
    eyebrow: 'Prescrição',
    title: 'Tudo o que foi prescrito está organizado aqui',
    description: 'Medicamentos, manipulados, suplementos e GLP-1 ficam separados com clareza.',
    href: '/prescriptions',
    tone: 'brand' as const,
  },
  {
    eyebrow: 'Pedido',
    title: 'Acompanhar produção e entrega',
    description: 'Seu pedido passa por análise, produção, envio e recompra sem você se perder.',
    href: '/order-status',
    tone: 'default' as const,
  },
  {
    eyebrow: 'Recompra',
    title: 'Solicitar a próxima janela',
    description: 'Recomprar cedo evita ruptura de rotina e queda de adesão.',
    href: '/reorder',
    tone: 'accent' as const,
  },
] as const;

export const profileQuickActions = [
  {
    eyebrow: 'Integrações',
    title: 'Conectar HealthKit, Health Connect e wearable',
    description: 'Quando não houver integração ativa, o fallback manual continua elegante.',
    href: '/integrations',
    tone: 'default' as const,
  },
  {
    eyebrow: 'Plano',
    title: 'Entender seu nível atual',
    description: 'Veja o que está liberado no 1, 3 e 6 meses sem texto quebrado ou confusão.',
    href: '/plan-membership',
    tone: 'brand' as const,
  },
  {
    eyebrow: 'Convites',
    title: 'Ver progresso de indicação',
    description: 'O programa mostra progresso, elegibilidade e próximos marcos sem wallet financeira.',
    href: '/referral-gamification',
    tone: 'accent' as const,
  },
] as const;

export const premiumStories: Record<string, StoryDefinition> = {
  checkup: {
    eyebrow: 'Check-up inicial',
    title: 'Vamos entender seu ponto de partida em poucos minutos',
    summary: 'Idade, rotina, peso, sintomas, objetivo e prevenção entram de forma simples para personalizar a jornada.',
    badge: { label: '2 min', tone: 'brand' },
    metrics: [
      { label: 'Perguntas', value: '8', caption: 'sem enrolação', tone: 'brand' },
      { label: 'Saída', value: '1 plano', caption: 'com próxima ação', tone: 'accent' },
    ],
    primaryCta: { label: 'Começar meu check-up', href: '/checkup-result' },
    sections: [
      {
        eyebrow: 'O que entra',
        title: 'Dados suficientes para um plano claro',
        items: [
          { type: 'timeline', title: 'Peso, meta e fase atual', subtitle: 'Sem pedir mais do que o paciente consegue informar.', tone: 'success' },
          { type: 'timeline', title: 'Sono, compulsão e energia', subtitle: 'O app usa isso para priorizar próximas ações.', tone: 'default' },
          { type: 'timeline', title: 'Prevenção e consultas pendentes', subtitle: 'A jornada começa antes do problema explodir.', tone: 'warning' },
        ],
      },
    ],
  },
  'checkup-result': {
    eyebrow: 'Plano personalizado',
    title: 'Seu plano foi ativado com uma próxima ação simples',
    summary: 'Em vez de soltar um texto longo, o app mostra o que fazer hoje e como isso move o seu tratamento.',
    badge: { label: 'pronto', tone: 'success' },
    metrics: [
      { label: 'Meta 90 dias', value: '-8 kg', caption: 'com foco em constância', tone: 'brand' },
      { label: 'Primeira prioridade', value: 'check-in', caption: 'abrir hoje', tone: 'accent' },
    ],
    primaryCta: { label: 'Abrir meu Hoje', href: '/(tabs)' },
    sections: [
      {
        eyebrow: 'Leitura do momento',
        title: 'O que mais mexe no seu resultado agora',
        items: [
          { type: 'action', eyebrow: 'Hoje', title: 'Registrar como você está se sentindo', description: 'Seus sintomas e sua energia mudam a orientação do dia.', href: '/symptom-checkin', tone: 'brand' },
          { type: 'action', eyebrow: 'Semana', title: 'Proteger água, proteína e sono', description: 'Esses três pilares diminuem atrito e sustentam adesão.', href: '/(tabs)/plan', tone: 'accent' },
        ],
      },
    ],
  },
  'product-scanner': {
    eyebrow: 'Scanner metabólico',
    title: 'Leia o rótulo e entenda em 5 segundos',
    summary: 'O paciente escaneia o produto e recebe uma explicação clara, sem terrorismo e sem linguagem técnica desnecessária.',
    badge: { label: 'câmera pronta', tone: 'brand' },
    primaryCta: { label: 'Escanear agora', href: '/scan-result' },
    sections: [
      {
        eyebrow: 'O que o scanner mostra',
        title: 'Compra melhor com menos fricção',
        items: [
          { type: 'timeline', title: 'Nota metabólica', subtitle: 'Uma leitura curta do quanto esse produto ajuda ou atrapalha seu objetivo.', tone: 'success' },
          { type: 'timeline', title: 'Açúcar oculto, sódio e ultraprocessado', subtitle: 'O app explica o problema em linguagem humana.', tone: 'warning' },
          { type: 'timeline', title: 'Alternativa melhor', subtitle: 'O usuário não fica só no “não pode”.', tone: 'default' },
        ],
      },
    ],
  },
  'scan-result': {
    eyebrow: 'Resultado do scanner',
    title: 'Esse produto não é proibido, mas existe opção melhor',
    summary: 'O foco é orientar troca mais inteligente, não gerar culpa.',
    badge: { label: 'nota B-', tone: 'warning' },
    metrics: [
      { label: 'Açúcar', value: '12 g', caption: 'por porção', tone: 'accent' },
      { label: 'Fibras', value: '2 g', caption: 'baixo para o objetivo', tone: 'warning' },
      { label: 'Proteína', value: '5 g', caption: 'pouca saciedade', tone: 'default' },
    ],
    sections: [
      {
        eyebrow: 'Leitura rápida',
        title: 'O que vale ajustar',
        items: [
          { type: 'text', body: 'Boa praticidade, mas pouco volume de proteína e fibra para quem quer mais saciedade e menos fome de rebote.' },
          { type: 'action', eyebrow: 'Sugestão', title: 'Procurar opção com mais proteína e menos açúcar', description: 'Uma troca simples melhora saciedade e reduz compulsão no fim do dia.', href: '/nutrition-coach', tone: 'brand' },
        ],
      },
    ],
  },
  'glp1-journey': {
    eyebrow: 'Jornada GLP-1',
    title: 'Dose, fase, aplicação e segurança no mesmo lugar',
    summary: 'A jornada não tenta adivinhar dose. Ela organiza o cuidado e deixa o ajuste para validação médica.',
    badge: { label: 'fase de evolução', tone: 'brand' },
    metrics: [
      { label: 'Dose', value: '7,5 mg', caption: 'prescrita', tone: 'brand' },
      { label: 'Próxima aplicação', value: '2 dias', caption: 'lembrete ativo', tone: 'accent' },
      { label: 'Peso perdido', value: '4,8 kg', caption: 'desde o início', tone: 'success' },
    ],
    primaryCta: { label: 'Registrar aplicação', href: '/dose-application' },
    secondaryCta: { label: 'Relatar sintoma', href: '/symptom-checkin' },
    sections: [
      {
        eyebrow: 'Segurança',
        title: 'O que sempre aparece com clareza',
        items: [
          { type: 'timeline', title: 'Rotação do local de aplicação', subtitle: 'O app lembra para evitar repetição no mesmo ponto.', tone: 'default' },
          { type: 'timeline', title: 'Ajuste de dose pede validação médica', subtitle: 'A IA apoia, mas não sobe ou desce dose sozinha.', tone: 'warning' },
          { type: 'timeline', title: 'Náusea, constipação e hidratação entram cedo', subtitle: 'O paciente entende o que monitorar antes de piorar.', tone: 'success' },
        ],
      },
    ],
  },
  'dose-application': {
    eyebrow: 'Aplicação',
    title: 'Registrar a aplicação leva menos de um minuto',
    summary: 'A tela mostra medicação, dose, local, sinais nas próximas horas e orientação clara de segurança.',
    badge: { label: 'rápido', tone: 'success' },
    primaryCta: { label: 'Confirmar aplicação', href: '/success-state' },
    sections: [
      {
        eyebrow: 'Depois da dose',
        title: 'O que observar nas próximas horas',
        items: [
          { type: 'badges', badges: [{ label: 'náusea', tone: 'warning' }, { label: 'hidratação', tone: 'brand' }, { label: 'proteína', tone: 'neutral' }] },
          { type: 'text', body: 'Se houver dor intensa, vômitos persistentes ou fraqueza importante, fale com um médico.' },
        ],
      },
    ],
  },
  'symptom-checkin': {
    eyebrow: 'Sintomas',
    title: 'Registre como você está se sentindo hoje',
    summary: 'O check-in diário não complica: ele só pede o que realmente muda conduta, risco e próxima ação.',
    badge: { label: 'check-in diário', tone: 'brand' },
    primaryCta: { label: 'Salvar sintomas', href: '/symptom-alert' },
    sections: [
      {
        eyebrow: 'Monitoramento',
        title: 'Sinais mais importantes na rotina GLP-1',
        items: [
          { type: 'badges', badges: [{ label: 'náusea', tone: 'warning' }, { label: 'constipação', tone: 'warning' }, { label: 'fome', tone: 'brand' }, { label: 'sono', tone: 'neutral' }, { label: 'humor', tone: 'neutral' }] },
          { type: 'text', body: 'O app registra intensidade e contexto para que o médico receba menos ruído e mais clareza.' },
        ],
      },
    ],
  },
  'symptom-alert': {
    eyebrow: 'Atenção',
    title: 'Esse sintoma merece avaliação mais de perto',
    summary: 'O app não minimiza sinal de alerta. Ele direciona o paciente para cuidado humano com contexto pronto.',
    badge: { label: 'fale com médico', tone: 'danger' },
    primaryCta: { label: 'Abrir telemedicina', href: '/telemedicine' },
    sections: [
      {
        eyebrow: 'Quando subir o nível',
        title: 'Procure médico se houver intensidade ou persistência',
        items: [
          { type: 'text', body: 'Dor intensa, fraqueza importante, vômitos persistentes ou piora progressiva precisam de avaliação médica. Essa orientação não substitui consulta.' },
        ],
      },
    ],
  },
  telemedicine: {
    eyebrow: 'Médico agora',
    title: 'Seu médico já vai receber o resumo antes do contato',
    summary: 'Telemedicina em um clique, com preparação elegante e menos repetição para o paciente.',
    badge: { label: 'ZapVida preparado', tone: 'dark' },
    primaryCta: { label: 'Entrar na fila', href: '/doctor-queue' },
    secondaryCta: { label: 'Agendar depois', href: '/consult-request' },
    sections: [
      {
        eyebrow: 'Resumo automático',
        title: 'O que já segue junto',
        items: [
          { type: 'timeline', title: 'Queixa principal e sintomas recentes', subtitle: 'Náusea, fome, dor abdominal, humor e energia.', tone: 'success' },
          { type: 'timeline', title: 'Dose, peso e última refeição', subtitle: 'O médico entra com contexto, não no escuro.', tone: 'success' },
          { type: 'timeline', title: 'Exames, pedidos e histórico relevante', subtitle: 'O app organiza a conversa antes dela começar.', tone: 'default' },
        ],
      },
    ],
  },
  'doctor-queue': {
    eyebrow: 'Fila médica',
    title: 'Seu atendimento está sendo preparado',
    summary: 'Tempo estimado, canal escolhido e orientações do que deixar em mãos antes do médico entrar.',
    badge: { label: '12 min', tone: 'warning' },
    primaryCta: { label: 'Abrir chat', href: '/doctor-chat' },
    sections: [
      {
        eyebrow: 'Enquanto espera',
        title: 'Deixe tudo pronto para ganhar tempo',
        items: [
          { type: 'badges', badges: [{ label: 'dose atual', tone: 'brand' }, { label: 'última refeição', tone: 'neutral' }, { label: 'exames recentes', tone: 'neutral' }] },
          { type: 'text', body: 'Você não precisa repetir todo o histórico. O app já enviou o essencial para a equipe.' },
        ],
      },
    ],
  },
  'doctor-chat': {
    eyebrow: 'Chat médico',
    title: 'Conversa direta, limpa e com contexto',
    summary: 'O histórico do atendimento, a orientação final e os próximos passos ficam organizados sem parecer chat genérico.',
    badge: { label: 'atendimento em andamento', tone: 'brand' },
    sections: [
      {
        eyebrow: 'Pós-consulta',
        title: 'O que fica salvo depois',
        items: [
          { type: 'timeline', title: 'Orientação médica', subtitle: 'Resumo curto em linguagem que o paciente entende.', tone: 'success' },
          { type: 'timeline', title: 'Prescrição e pedido farmacêutico', subtitle: 'Farmácia e médico ficam conectados no mesmo fluxo.', tone: 'default' },
          { type: 'timeline', title: 'Próxima ação do paciente', subtitle: 'Sem ambiguidade sobre o que fazer depois do atendimento.', tone: 'warning' },
        ],
      },
    ],
  },
  'nutrition-coach': {
    eyebrow: 'Assistente alimentar',
    title: 'Pergunte o que vai comer e receba uma resposta curta',
    summary: 'O app orienta por comportamento e contexto do dia, não como prescrição rígida.',
    badge: { label: 'tempo real', tone: 'brand' },
    sections: [
      {
        eyebrow: 'Exemplos',
        title: 'Respostas que ajudam de verdade',
        items: [
          { type: 'timeline', title: 'Pode comer, mas reduza a porção', subtitle: 'Boa para hoje, desde que a fome esteja estável.', tone: 'success' },
          { type: 'timeline', title: 'Melhor trocar por mais proteína', subtitle: 'Seu check-in sugere que isso vai dar mais saciedade.', tone: 'warning' },
          { type: 'timeline', title: 'Hoje não é a melhor escolha', subtitle: 'Você relatou náusea; gordura e volume alto podem piorar.', tone: 'warning' },
        ],
      },
    ],
  },
  'metabolic-monitor': {
    eyebrow: 'Monitor metabólico',
    title: 'Peso, cintura, sono e adesão em gráficos úteis',
    summary: 'A tela cruza métricas sem parecer painel técnico demais e prepara integração futura com devices.',
    badge: { label: 'healthkit-ready', tone: 'brand' },
    metrics: [
      { label: 'Peso', value: '78,4 kg', caption: 'último registro', tone: 'brand' },
      { label: 'Cintura', value: '93 cm', caption: 'tendência estável', tone: 'accent' },
      { label: 'Passos', value: '6,8k', caption: 'média diária', tone: 'success' },
      { label: 'Água', value: '2,1 L', caption: 'média recente', tone: 'warning' },
    ],
    sections: [
      {
        eyebrow: 'Insights automáticos',
        title: 'O que o app explica sozinho',
        items: [
          { type: 'timeline', title: 'Seu peso caiu 1,2 kg em 7 dias', subtitle: 'Com melhor adesão à água e ao registro alimentar.', tone: 'success' },
          { type: 'timeline', title: 'Seu sono piorou nos dias com mais fome', subtitle: 'Isso muda a prioridade da rotina do dia seguinte.', tone: 'warning' },
        ],
      },
    ],
  },
  'mind-sleep': {
    eyebrow: 'Mente e sono',
    title: 'Trilhas curtas para ansiedade, compulsão e recuperação',
    summary: 'A área não é wellness solto: ela existe para proteger decisões e diminuir recaídas comportamentais.',
    badge: { label: '3 min agora', tone: 'success' },
    primaryCta: { label: 'Começar trilha curta', href: '/ritual-player' },
    sections: [
      {
        eyebrow: 'Biblioteca',
        title: 'O que você encontra aqui',
        items: [
          { type: 'timeline', title: 'Respiração antes da refeição', subtitle: 'Reduz ansiedade e melhora consciência da fome.', tone: 'success' },
          { type: 'timeline', title: 'Sono profundo', subtitle: 'Ajuda o corpo a chegar mais regulado na próxima manhã.', tone: 'default' },
          { type: 'timeline', title: 'Compulsão e fome emocional', subtitle: 'O app ajuda a interromper impulso sem parecer moralista.', tone: 'warning' },
        ],
      },
    ],
  },
  'ritual-player': {
    eyebrow: 'Player',
    title: 'Uma pausa de 3 minutos pode mudar sua próxima escolha',
    summary: 'O player é simples, bonito e direto: duração, foco da trilha e progresso atual.',
    badge: { label: '03:00', tone: 'dark' },
    primaryCta: { label: 'Concluir sessão', href: '/success-state' },
    sections: [
      {
        eyebrow: 'Foco',
        title: 'Respiração antes da refeição',
        items: [
          { type: 'text', body: 'Vamos reduzir ansiedade, desacelerar a refeição e proteger a saciedade. Pequenas ações diárias geram grandes resultados.' },
        ],
      },
    ],
  },
  prescriptions: {
    eyebrow: 'Minha farmácia',
    title: 'Tudo que foi prescrito fica organizado aqui',
    summary: 'Prescrição, manipulados, suplementos, Loizil e GLP-1 aparecem separados, claros e acionáveis.',
    badge: { label: 'ZapFarm modelado', tone: 'warning' },
    primaryCta: { label: 'Ver pedido atual', href: '/order-status' },
    sections: [
      {
        eyebrow: 'Itens ativos',
        title: 'Leitura simples do que está em jogo',
        items: [
          { type: 'timeline', title: 'GLP-1 semanal', subtitle: 'Janela atual protegida, com reposição planejada.', tone: 'success' },
          { type: 'timeline', title: 'Manipulado metabólico', subtitle: 'Em análise farmacêutica antes da produção.', tone: 'warning' },
          { type: 'timeline', title: 'Suplemento de apoio', subtitle: 'Recompra prevista para a próxima semana.', tone: 'default' },
        ],
      },
    ],
  },
  'order-status': {
    eyebrow: 'Pedido',
    title: 'Seu pedido está em produção com prazo claro',
    summary: 'A pessoa entende se está em análise, produção, envio ou entrega sem precisar perguntar no suporte.',
    badge: { label: 'em produção', tone: 'warning' },
    primaryCta: { label: 'Solicitar recompra', href: '/reorder' },
    sections: [
      {
        eyebrow: 'Rastreamento',
        title: 'Status que realmente importam',
        items: [
          { type: 'badges', badges: [{ label: 'prescrição recebida', tone: 'success' }, { label: 'produção', tone: 'warning' }, { label: 'entrega', tone: 'neutral' }] },
          { type: 'text', body: 'Seu pedido está sendo preparado e a próxima recompra ficará sugerida antes de faltar produto.' },
        ],
      },
    ],
  },
  reorder: {
    eyebrow: 'Recompra',
    title: 'A próxima recompra fica previsível e sem atrito',
    summary: 'O app não espera o paciente acabar para lembrar. Ele antecipa a janela com contexto clínico e operacional.',
    badge: { label: '7 dias', tone: 'brand' },
    primaryCta: { label: 'Solicitar nova janela', href: '/success-state' },
    sections: [
      {
        eyebrow: 'Prevenção operacional',
        title: 'Não interrompa a rotina por atraso simples',
        items: [
          { type: 'text', body: 'Abrir a recompra com antecedência reduz risco de quebra na adesão e diminui urgência evitável.' },
        ],
      },
    ],
  },
  integrations: {
    eyebrow: 'Integrações',
    title: 'Conecte seus dados ou use fallback manual sem perder clareza',
    summary: 'HealthKit, Health Connect, balança e wearable entram quando disponíveis, com fallback elegante quando não estiverem conectados.',
    badge: { label: 'parcialmente real', tone: 'warning' },
    sections: [
      {
        eyebrow: 'Status atual',
        title: 'O que já existe e o que está preparado',
        items: [
          { type: 'badges', badges: [{ label: 'notificações reais', tone: 'success' }, { label: 'healthkit preparado', tone: 'brand' }, { label: 'wearable mockado', tone: 'warning' }] },
          { type: 'text', body: 'Quando a integração não estiver ativa, o app continua usável com input manual bem guiado.' },
        ],
      },
    ],
  },
  'plan-membership': {
    eyebrow: 'Plano e assinatura',
    title: 'Entenda o que seu plano libera sem texto quebrado',
    summary: 'A assinatura explica o valor por tempo, o que está ativo agora e o que entra ao fazer upgrade.',
    badge: { label: '6 meses premium', tone: 'success' },
    metrics: [
      { label: 'Features ativas', value: '10', caption: 'no plano atual', tone: 'brand' },
      { label: 'Canal premium', value: 'ativo', caption: 'sob governança', tone: 'success' },
    ],
    sections: [
      {
        eyebrow: 'Estrutura',
        title: 'Como o cuidado cresce com a duração',
        items: [
          { type: 'timeline', title: '1 mês', subtitle: 'Hoje, GLP-1 e Meal AI para entrar rápido na rotina.', tone: 'default' },
          { type: 'timeline', title: '3 meses', subtitle: 'Sono, rituais e concierge para proteger consistência.', tone: 'success' },
          { type: 'timeline', title: '6 meses', subtitle: 'As 10 features e a linha premium coordenada pela equipe.', tone: 'success' },
        ],
      },
    ],
  },
  'success-state': {
    eyebrow: 'Tudo certo',
    title: 'Seu passo foi registrado com sucesso',
    summary: 'O app confirma o que aconteceu e deixa claro qual é a próxima ação, sem tela morta ou ambígua.',
    badge: { label: 'registrado', tone: 'success' },
    primaryCta: { label: 'Voltar para Hoje', href: '/(tabs)' },
    sections: [
      {
        eyebrow: 'Próximo passo',
        title: 'Continue a rotina sem se perder',
        items: [
          { type: 'text', body: 'Seu registro já entrou no histórico e pode mudar score, orientação do dia e leitura médica quando necessário.' },
        ],
      },
    ],
  },
} as const;
