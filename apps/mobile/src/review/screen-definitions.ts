export type ReviewBadgeTone = 'good' | 'attention' | 'high' | 'low';

export type ReviewMetric = {
  label: string;
  value: string;
  caption: string;
  tone?: 'brand' | 'accent' | 'warning' | 'default';
};

export type ReviewSectionItem =
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
      badges: Array<{ label: string; tone: ReviewBadgeTone }>;
    };

export type ReviewSection = {
  eyebrow: string;
  title: string;
  support?: string;
  tone?: 'default' | 'muted';
  items: ReviewSectionItem[];
};

export type ReviewScreenDefinition = {
  screenId: string;
  route: string;
  tier: 'preview' | '1m' | '3m' | '6m';
  state: 'happy' | 'empty' | 'permission-denied' | 'error' | 'locked';
  device: 'iphone';
  build: 'review-local';
  reviewStatus: 'ready_for_review';
  eyebrow: string;
  title: string;
  summary: string;
  badge?: { label: string; tone: ReviewBadgeTone };
  metrics?: ReviewMetric[];
  sections: ReviewSection[];
};

export const reviewScreenDefinitions: ReviewScreenDefinition[] = [
  {
    screenId: '00-onboarding',
    route: '/onboarding',
    tier: 'preview',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Aquisição',
    title: 'Entre no cuidado premium MeJoy',
    summary: 'Avaliação, comparação de planos e explicação visual do que o app adiciona ao produto web.',
    badge: { label: 'preview', tone: 'attention' },
    metrics: [
      { label: 'Planos', value: '3', caption: '1, 3 e 6 meses', tone: 'brand' },
      { label: 'Features', value: '10', caption: 'No plano completo', tone: 'accent' },
    ],
    sections: [
      {
        eyebrow: 'Planos',
        title: 'Como o valor cresce com a continuidade',
        items: [
          {
            type: 'action',
            eyebrow: '1 mês',
            title: 'Entrada rápida na rotina',
            description: 'Dashboard, jornada GLP-1 e Meal AI com baixa fricção.',
            tone: 'brand',
          },
          {
            type: 'action',
            eyebrow: '3 meses',
            title: 'Proteção de consistência',
            description: 'Sono, rituais e concierge clínico entram na rotina.',
            tone: 'accent',
          },
          {
            type: 'action',
            eyebrow: '6 meses',
            title: 'Cuidado integral preventivo',
            description: 'As 10 features, prevenção, exames e canal premium governado.',
          },
        ],
      },
    ],
  },
  {
    screenId: '01-sign-in',
    route: '/sign-in',
    tier: 'preview',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Acesso',
    title: 'Entrar na conta MeJoy',
    summary: 'Acesso simples, sem ruído, já alinhado ao contexto do paciente.',
    badge: { label: 'fluxo limpo', tone: 'good' },
    sections: [
      {
        eyebrow: 'Credenciais',
        title: 'Entrada com fricção mínima',
        items: [
          { type: 'text', body: 'Email, senha e retorno imediato para a home personalizada.' },
          {
            type: 'badges',
            badges: [
              { label: 'deep link pronto', tone: 'good' },
              { label: 'retorno ao dashboard', tone: 'low' },
            ],
          },
        ],
      },
    ],
  },
  {
    screenId: '02-activation',
    route: '/activation-complete',
    tier: 'preview',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Ativação',
    title: 'Compra concluída, app pronto',
    summary: 'Tela de retorno elegante, com status claro e atalho direto para a área do paciente.',
    badge: { label: 'retorno limpo', tone: 'good' },
    sections: [
      {
        eyebrow: 'Pagamento',
        title: 'O próximo passo fica óbvio',
        items: [
          {
            type: 'action',
            eyebrow: 'Ativado',
            title: 'Abrir meu painel MeJoy',
            description: 'A partir daqui o paciente entra no cockpit preventivo e longitudinal.',
            tone: 'brand',
          },
        ],
      },
    ],
  },
  {
    screenId: '03-home-score',
    route: '/(tabs)',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Home',
    title: 'Saúde em 78/100 hoje',
    summary: 'Home com score, pilares, próxima ação, metas e leitura editorial do dia.',
    badge: { label: 'consistente', tone: 'good' },
    metrics: [
      { label: 'Score', value: '78', caption: 'Consistência boa', tone: 'brand' },
      { label: 'Sono', value: '84', caption: 'Protegendo recuperação', tone: 'warning' },
      { label: 'Adesão', value: '89%', caption: 'Dose e rotina', tone: 'accent' },
    ],
    sections: [
      {
        eyebrow: 'Pilares',
        title: 'O que está puxando o score hoje',
        items: [
          { type: 'timeline', title: 'Alimentação · 14/20', subtitle: 'Meal AI e refeição principal já confirmados.', tone: 'success' },
          { type: 'timeline', title: 'Movimento · 8/20', subtitle: 'Força ainda está pendente nesta janela.', tone: 'warning' },
          { type: 'timeline', title: 'Prevenção · 12/20', subtitle: 'Checklist do mês foi revisado.', tone: 'success' },
        ],
      },
    ],
  },
  {
    screenId: '04-home-risco',
    route: '/(tabs)',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Home',
    title: 'Risco atual sob controle, mas com ajuste fino',
    summary: 'Leitura clara de risco e CTA prioritário para remover ambiguidade.',
    badge: { label: 'atenção', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Agora',
        title: 'O melhor próximo passo',
        items: [
          {
            type: 'action',
            eyebrow: 'Ação principal',
            title: 'Registrar peso e dose',
            description: 'Atualizar sinais agora melhora risco, score e precisão do dia seguinte.',
            tone: 'brand',
          },
          {
            type: 'action',
            eyebrow: 'Sinal prioritário',
            title: 'Seu sono merece atenção hoje',
            description: 'Dormir pouco está puxando fome, energia e foco para baixo.',
            tone: 'accent',
          },
        ],
      },
    ],
  },
  {
    screenId: '05-home-prevencao',
    route: '/(tabs)',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Home',
    title: 'Prevenção também mora na primeira dobra',
    summary: 'A home mostra pendências preventivas sem ficar alarmista ou burocrática.',
    badge: { label: 'prevenção ativa', tone: 'good' },
    sections: [
      {
        eyebrow: 'Prevenção',
        title: 'Não espere piorar para agir',
        items: [
          {
            type: 'action',
            eyebrow: 'Prioridade alta',
            title: 'Revisar exames cardiometabólicos do ciclo',
            description: 'Peso, cintura, glicemia, HbA1c e pressão precisam continuar legíveis.',
            tone: 'accent',
          },
          {
            type: 'action',
            eyebrow: 'Checklist',
            title: 'Abrir checklist preventivo',
            description: 'Rastreio, decisão compartilhada e fontes clínicas ficam claros.',
          },
        ],
      },
    ],
  },
  {
    screenId: '06-journey-glp1',
    route: '/(tabs)/journey',
    tier: '1m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Jornada',
    title: 'GLP-1 em uma linha contínua',
    summary: 'Peso, dose, refill e execução da semana no mesmo lugar.',
    badge: { label: 'jornada ativa', tone: 'good' },
    sections: [
      {
        eyebrow: 'Insights',
        title: 'Tudo o que move a semana',
        items: [
          { type: 'timeline', title: 'Peso 78,4 kg', subtitle: 'Registro longitudinal salvo com leitura de direção.', tone: 'success' },
          { type: 'timeline', title: 'Dose 7,5 mg', subtitle: 'Fase de manutenção com adesão estável.', tone: 'success' },
          { type: 'action', eyebrow: 'Refill', title: 'Abrir pedido preventivo', description: 'Antecipar reposição evita quebra operacional.' },
        ],
      },
    ],
  },
  {
    screenId: '07-journey-sintomas',
    route: '/(tabs)/journey',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Jornada',
    title: 'Sintomas e recovery entram cedo',
    summary: 'O paciente registra sinais, intensidade e contexto antes do problema virar ruído.',
    badge: { label: 'monitorado', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Recovery',
        title: 'Sintoma + sono + contexto',
        items: [
          {
            type: 'action',
            eyebrow: 'Sintoma',
            title: 'Registrar náusea com intensidade moderada',
            description: 'Duração, gatilhos e correlação com dose entram no mesmo fluxo.',
            tone: 'accent',
          },
          {
            type: 'action',
            eyebrow: 'Sono',
            title: 'Sincronizar snapshot de recuperação',
            description: 'O coaching responde de forma simples e contextual.',
          },
        ],
      },
    ],
  },
  {
    screenId: '08-meal-ai',
    route: '/meal-analysis',
    tier: '1m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Meal AI',
    title: 'Foto, texto ou cardápio',
    summary: 'A decisão de refeição vira uma análise prática, sem planilha e sem excesso de texto.',
    badge: { label: 'ao vivo', tone: 'good' },
    sections: [
      {
        eyebrow: 'Leitura prática',
        title: 'O prato vira ação',
        items: [
          { type: 'action', eyebrow: 'Calorias', title: 'Estimativa rápida', description: 'Calorias, macros, risco e melhor escolha para a fase atual.', tone: 'brand' },
          { type: 'text', body: 'O app explica por que aquela mudança importa no corpo e no resto do dia.' },
        ],
      },
    ],
  },
  {
    screenId: '09-sleep',
    route: '/(tabs)/journey',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Sono',
    title: 'Recuperação vira linguagem do dia',
    summary: 'Sono não fica escondido em submenu; ele conversa com fome, energia e execução.',
    badge: { label: '84/100', tone: 'good' },
    sections: [
      {
        eyebrow: 'Recuperação',
        title: 'Coaching simples e convincente',
        items: [
          { type: 'timeline', title: '7,2h registradas', subtitle: 'Boa base para reduzir impulsividade e proteger foco.', tone: 'success' },
          { type: 'action', eyebrow: 'Hoje', title: 'Proteger a janela de desligamento', description: 'Uma decisão de hoje muda sua fome amanhã.', tone: 'accent' },
        ],
      },
    ],
  },
  {
    screenId: '10-rituals',
    route: '/(tabs)/rituals',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Rituais',
    title: 'Regulação curta, bonita e útil',
    summary: 'Nada de aba wellness genérica: só práticas curtas, com papel claro na jornada.',
    badge: { label: 'sugerido agora', tone: 'good' },
    sections: [
      {
        eyebrow: 'Biblioteca',
        title: 'Escolha a prática certa',
        items: [
          { type: 'action', eyebrow: 'Craving', title: 'Ritual de 4 minutos', description: 'Reduz impulso e devolve sensação de controle.', tone: 'accent' },
          { type: 'action', eyebrow: 'Pré-sono', title: 'Desacelerar antes de dormir', description: 'Ajuda o corpo a entender que a janela de descanso começou.' },
        ],
      },
    ],
  },
  {
    screenId: '11-goals',
    route: '/goals',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Metas',
    title: 'Metas que realmente mexem no score',
    summary: 'Gamificação prática, com impacto por pilar e sem poluição visual.',
    badge: { label: '5/12 concluídas', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Hoje',
        title: 'Confirmar e seguir',
        items: [
          { type: 'action', eyebrow: 'nutrition · +8', title: 'Registrar a refeição mais crítica do dia', description: 'Confirmação simples com impacto real no score.', tone: 'brand' },
          { type: 'action', eyebrow: 'movement · +10', title: 'Registrar sessão de força', description: 'Força entra como pilar concreto de proteção metabólica.' },
        ],
      },
    ],
  },
  {
    screenId: '12-prevention-checklist',
    route: '/prevention-checklist',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Prevenção',
    title: 'Checklist preventivo governado',
    summary: 'Rastreio e revisão clínica por idade, sexo e risco, sem parecer burocracia hospitalar.',
    badge: { label: '2 pendências', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Prioridade',
        title: 'O que revisar neste ciclo',
        items: [
          { type: 'action', eyebrow: 'labs · high', title: 'Revisar exames cardiometabólicos', description: 'Peso, cintura, glicemia, HbA1c e pressão sustentam a base do tratamento.', tone: 'accent' },
          { type: 'action', eyebrow: 'shared-decision', title: 'Abrir revisão de prevenção colorretal', description: 'A trilha aparece como conversa governada e não como diagnóstico automático.' },
        ],
      },
    ],
  },
  {
    screenId: '13-consult-concierge',
    route: '/consult-request',
    tier: '3m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Consulta',
    title: 'Concierge clínico sem fricção',
    summary: 'Pedido assistido, SLA claro e próximo passo legível para o paciente.',
    badge: { label: '12h SLA', tone: 'good' },
    sections: [
      {
        eyebrow: 'Pedido',
        title: 'Abrir suporte no momento certo',
        items: [
          { type: 'action', eyebrow: 'Contexto', title: 'Sintomas, objetivo e preferência do período', description: 'Tudo entra no mesmo pedido para reduzir ida e volta.' },
        ],
      },
    ],
  },
  {
    screenId: '14-exams',
    route: '/exam-upload',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Exames',
    title: 'Upload bonito e objetivo',
    summary: 'Documentos, OCR e timeline clínica organizados em um fluxo muito simples.',
    badge: { label: 'hub ativo', tone: 'good' },
    sections: [
      {
        eyebrow: 'Fila',
        title: 'Tudo o que entrou no hub',
        items: [
          { type: 'timeline', title: 'Hemograma.pdf', subtitle: 'Arquivo armazenado com sucesso para revisão clínica.', tone: 'success' },
          { type: 'timeline', title: 'Perfil lipídico.jpg', subtitle: 'OCR em fila para resumo assistivo.', tone: 'warning' },
        ],
      },
    ],
  },
  {
    screenId: '15-reports-bundle',
    route: '/(tabs)/reports',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Relatórios',
    title: 'Centro clínico reaproveitável',
    summary: 'Relatórios MeJoy, exames e bundle seguro no mesmo hub.',
    badge: { label: 'bundle pronto', tone: 'good' },
    sections: [
      {
        eyebrow: 'Bundle',
        title: 'Compartilhar contexto sem retrabalho',
        items: [
          { type: 'action', eyebrow: 'Seguro', title: 'Gerar pacote clínico expirável', description: 'Relatórios, peso, sono e exames em um link utilizável pelo médico.' },
        ],
      },
    ],
  },
  {
    screenId: '16-profile',
    route: '/(tabs)/profile',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Perfil',
    title: 'Conta, preferências e tier',
    summary: 'Push, quiet hours, referral e benefícios premium visíveis em um lugar só.',
    badge: { label: 'push ativo', tone: 'good' },
    sections: [
      {
        eyebrow: 'Plano',
        title: 'Status do cuidado premium',
        items: [
          { type: 'action', eyebrow: '6 meses', title: 'Canal premium já coberto', description: 'Referral, prevenção e pedido de especialista já fazem parte da experiência.', tone: 'accent' },
        ],
      },
    ],
  },
  {
    screenId: '17-notifications',
    route: '/notifications-center',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Notificações',
    title: 'Fila clínica com explicação',
    summary: 'O paciente entende por que o app chamou sua atenção e para onde aquela notificação leva.',
    badge: { label: '4 sinais', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Fila atual',
        title: 'Notificações que fazem sentido',
        items: [
          { type: 'action', eyebrow: 'sleep · high', title: 'Seu sono merece atenção hoje', description: 'Dormir pouco está puxando fome e foco para baixo.', tone: 'accent' },
          { type: 'action', eyebrow: 'clinical · medium', title: 'Planeje o próximo refill', description: 'Antecipar reposição evita quebra do plano.' },
        ],
      },
    ],
  },
  {
    screenId: '18-referral-gamification',
    route: '/referral-gamification',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Referral',
    title: 'Indicação com progresso elegante',
    summary: 'Código, QR e próxima recompensa operacional em uma tela leve e útil.',
    badge: { label: '55%', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Convite',
        title: 'Seu código de entrada',
        items: [
          { type: 'action', eyebrow: 'MEJOY-84A1F2', title: 'Compartilhar link ou QR', description: 'A indicação ajuda a ampliar a jornada de saúde sem virar wallet dentro do app.', tone: 'brand' },
        ],
      },
    ],
  },
  {
    screenId: '19-tier-locked-states',
    route: '/premium-benefits',
    tier: '1m',
    state: 'locked',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Estado bloqueado',
    title: 'Bonito, claro e sem parecer quebrado',
    summary: 'O paciente entende o que ainda não está liberado e por que vale subir de plano.',
    badge: { label: 'feature bloqueada', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Comparativo',
        title: 'O que entra no próximo nível',
        items: [
          { type: 'action', eyebrow: '3 meses', title: 'Sono, rituais e concierge', description: 'Protegem consistência e diminuem recaída.', tone: 'accent' },
          { type: 'action', eyebrow: '6 meses', title: 'Prevenção, exames e canal premium', description: 'Camada completa de cuidado integral.' },
        ],
      },
    ],
  },
  {
    screenId: '20-premium-6m-benefits',
    route: '/premium-benefits',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Plano 6 meses',
    title: 'As 10 features em seu formato máximo',
    summary: 'Comparativo editorial que mostra por que o plano longo concentra mais valor real.',
    badge: { label: 'máximo valor', tone: 'good' },
    sections: [
      {
        eyebrow: 'Plano completo',
        title: 'Tudo liberado',
        items: [
          { type: 'badges', badges: [
            { label: 'prevenção', tone: 'good' },
            { label: 'referral', tone: 'good' },
            { label: 'canal premium', tone: 'good' },
            { label: 'hub de exames', tone: 'good' },
          ]},
        ],
      },
    ],
  },
  {
    screenId: '21-specialist-request',
    route: '/specialist-request',
    tier: '6m',
    state: 'happy',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Canal premium',
    title: 'Pedido governado com humano no centro',
    summary: 'O paciente pede uma revisão mais profunda sem transformar o app em promessa clínica imprudente.',
    badge: { label: 'governado', tone: 'good' },
    sections: [
      {
        eyebrow: 'Especialidade',
        title: 'Quem deve revisar primeiro',
        items: [
          { type: 'badges', badges: [
            { label: 'Endócrino', tone: 'low' },
            { label: 'Nutrologia', tone: 'good' },
            { label: 'Psicologia', tone: 'low' },
          ]},
          { type: 'action', eyebrow: 'Pedido', title: 'Enviar contexto e objetivos', description: 'A IA organiza o pedido, mas a decisão final continua humana.', tone: 'brand' },
        ],
      },
    ],
  },
  {
    screenId: '22-empty-states',
    route: '/review/22-empty-states',
    tier: 'preview',
    state: 'empty',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Estados vazios',
    title: 'Sem conteúdo também precisa parecer premium',
    summary: 'O paciente não deve sentir que o app “quebrou” quando ainda não há dados.',
    badge: { label: 'empty state', tone: 'low' },
    sections: [
      {
        eyebrow: 'Sem exames',
        title: 'O que aparece antes do primeiro upload',
        items: [
          { type: 'text', body: 'Nenhum documento anexado ainda. O hub já está pronto para PDF, imagem e leitura clínica assistida.' },
        ],
      },
    ],
  },
  {
    screenId: '23-error-states',
    route: '/review/23-error-states',
    tier: 'preview',
    state: 'error',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Erro',
    title: 'Falha clara, sem drama visual',
    summary: 'A pessoa entende o problema, vê que a sessão foi preservada e sabe o que fazer em seguida.',
    badge: { label: 'error state', tone: 'high' },
    sections: [
      {
        eyebrow: 'Recuperação',
        title: 'A interface preserva confiança',
        items: [
          { type: 'text', body: 'Não foi possível sincronizar sua home agora. Tente novamente em instantes. Sua sessão continua preservada.' },
          { type: 'action', eyebrow: 'Ação', title: 'Tentar novamente', description: 'Reexecutar a leitura do painel com o mesmo contexto.' },
        ],
      },
    ],
  },
  {
    screenId: '24-permission-fallbacks',
    route: '/review/24-permission-fallbacks',
    tier: '3m',
    state: 'permission-denied',
    device: 'iphone',
    build: 'review-local',
    reviewStatus: 'ready_for_review',
    eyebrow: 'Permissões',
    title: 'Fallbacks nativos sem parecer bloqueio bruto',
    summary: 'Quando push, câmera ou wearable não estão liberados, o app mostra caminho alternativo com elegância.',
    badge: { label: 'permissão negada', tone: 'attention' },
    sections: [
      {
        eyebrow: 'Sono',
        title: 'Sem wearable? Tudo bem',
        items: [
          { type: 'action', eyebrow: 'Fallback manual', title: 'Registrar sono sem HealthKit', description: 'O app mantém coaching e score mesmo sem permissão nativa.', tone: 'brand' },
          { type: 'action', eyebrow: 'Push', title: 'Abrir ajustes do aparelho', description: 'Se preferir, a ativação fica a um toque do usuário.' },
        ],
      },
    ],
  },
];
