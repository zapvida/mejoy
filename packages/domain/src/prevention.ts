import type {
  GoalProgressItem,
  HealthScoreSnapshot,
  PreventionChecklistResponse,
  ReferralGamificationStatus,
} from '@mejoy/api-contracts/mobile';

type GoalCompletionMap = Record<string, boolean>;

type BuildGoalsParams = {
  completionMap?: GoalCompletionMap;
  tierDurationMonths?: number;
};

type BuildHealthScoreParams = {
  goals: GoalProgressItem[];
  sleepScore?: number | null;
  adherenceScore?: number | null;
  preventionDueCount?: number;
};

type PreventionParams = {
  birthDate?: string | null;
  sexAtBirth?: string | null;
  protocolSlug?: string | null;
  riskLevel?: 'low' | 'attention' | 'high' | null;
  hasExamDocuments?: boolean;
};

const PILLAR_MAX: Record<GoalProgressItem['pillar'], number> = {
  nutrition: 20,
  movement: 20,
  sleep: 15,
  regulation: 15,
  prevention: 20,
  adherence: 10,
};

function normalizeSexAtBirth(value: string | null | undefined) {
  const normalized = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  if (normalized.startsWith('f')) {
    return 'female';
  }

  if (normalized.startsWith('m')) {
    return 'male';
  }

  return 'unknown';
}

function calculateAge(birthDate: string | null | undefined) {
  if (!birthDate) return null;
  const parsed = new Date(birthDate);
  if (Number.isNaN(parsed.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const hasHadBirthday =
    today.getMonth() > parsed.getMonth() ||
    (today.getMonth() === parsed.getMonth() && today.getDate() >= parsed.getDate());

  if (!hasHadBirthday) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function resolveAgeBand(age: number | null) {
  if (age == null) return 'idade_nao_informada';
  if (age < 30) return '18-29';
  if (age < 40) return '30-39';
  if (age < 50) return '40-49';
  if (age < 60) return '50-59';
  if (age < 70) return '60-69';
  return '70+';
}

export function buildGoalProgressItems(params: BuildGoalsParams): GoalProgressItem[] {
  const completionMap = params.completionMap ?? {};
  const tierDurationMonths = params.tierDurationMonths ?? 0;
  const now = new Date();

  const dueTomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const dueThisWeek = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const goals: GoalProgressItem[] = [
    {
      id: 'nutrition-log',
      title: 'Registrar a refeição mais crítica do dia',
      pillar: 'nutrition',
      completed: completionMap['nutrition-log'] ?? false,
      scoreImpact: 8,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'meal-ai-check',
      title: 'Usar o Meal AI em um prato ou cardápio real',
      pillar: 'nutrition',
      completed: completionMap['meal-ai-check'] ?? false,
      scoreImpact: 12,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'strength-session',
      title: 'Registrar sessão de força ou musculação',
      pillar: 'movement',
      completed: completionMap['strength-session'] ?? false,
      scoreImpact: 10,
      requiresProof: true,
      dueAt: dueThisWeek,
    },
    {
      id: 'walk-session',
      title: 'Fechar uma janela real de movimento no dia',
      pillar: 'movement',
      completed: completionMap['walk-session'] ?? false,
      scoreImpact: 10,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'sleep-sync',
      title: 'Sincronizar ou registrar o sono da noite',
      pillar: 'sleep',
      completed: completionMap['sleep-sync'] ?? false,
      scoreImpact: 7,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'sleep-window',
      title: 'Proteger a janela de desligamento hoje',
      pillar: 'sleep',
      completed: completionMap['sleep-window'] ?? false,
      scoreImpact: 8,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'ritual-session',
      title: 'Concluir um ritual guiado de regulação',
      pillar: 'regulation',
      completed: completionMap['ritual-session'] ?? false,
      scoreImpact: 8,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'support-network',
      title: 'Acionar um grupo de apoio ou conversa de proteção',
      pillar: 'regulation',
      completed: completionMap['support-network'] ?? false,
      scoreImpact: 7,
      requiresProof: false,
      dueAt: dueThisWeek,
    },
    {
      id: 'prevention-review',
      title: 'Revisar o checklist preventivo do mês',
      pillar: 'prevention',
      completed: completionMap['prevention-review'] ?? false,
      scoreImpact: 8,
      requiresProof: false,
      dueAt: dueThisWeek,
    },
    {
      id: 'prevention-checkup',
      title: 'Agendar ou anexar um checkup estratégico',
      pillar: 'prevention',
      completed: completionMap['prevention-checkup'] ?? false,
      scoreImpact: 12,
      requiresProof: true,
      dueAt: dueThisWeek,
    },
    {
      id: 'weight-log',
      title: 'Registrar peso e marco corporal',
      pillar: 'adherence',
      completed: completionMap['weight-log'] ?? false,
      scoreImpact: 4,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
    {
      id: 'dose-log',
      title: 'Registrar dose e sintomas do ciclo atual',
      pillar: 'adherence',
      completed: completionMap['dose-log'] ?? false,
      scoreImpact: 6,
      requiresProof: false,
      dueAt: dueTomorrow,
    },
  ];

  if (tierDurationMonths < 6) {
    return goals.map((goal) =>
      goal.pillar === 'prevention'
        ? {
            ...goal,
            completed: completionMap[goal.id] ?? false,
          }
        : goal
    );
  }

  return goals;
}

export function buildHealthScore(params: BuildHealthScoreParams): HealthScoreSnapshot {
  const pillarScores = params.goals.reduce<Record<GoalProgressItem['pillar'], number>>(
    (accumulator, goal) => {
      const nextValue = accumulator[goal.pillar] + (goal.completed ? goal.scoreImpact : 0);
      accumulator[goal.pillar] = Math.min(nextValue, PILLAR_MAX[goal.pillar]);
      return accumulator;
    },
    {
      nutrition: 0,
      movement: 0,
      sleep: 0,
      regulation: 0,
      prevention: 0,
      adherence: 0,
    }
  );

  if ((params.sleepScore ?? 0) >= 80) {
    pillarScores.sleep = Math.min(PILLAR_MAX.sleep, Math.max(pillarScores.sleep, 11));
  }

  if ((params.adherenceScore ?? 0) >= 80) {
    pillarScores.adherence = Math.min(PILLAR_MAX.adherence, Math.max(pillarScores.adherence, 8));
  }

  const overallScore = Object.values(pillarScores).reduce((sum, value) => sum + value, 0);
  const preventionPressure = params.preventionDueCount ?? 0;
  const delta24h = Math.max(-8, Math.min(8, Math.round((params.adherenceScore ?? 60) / 15 - preventionPressure)));

  return {
    overallScore,
    pillars: [
      {
        id: 'nutrition',
        label: 'Alimentação',
        currentScore: pillarScores.nutrition,
        maxScore: PILLAR_MAX.nutrition,
        status: pillarScores.nutrition >= 14 ? 'good' : pillarScores.nutrition >= 8 ? 'attention' : 'critical',
        explanation: 'A alimentação diária precisa ser legível e repetível, não perfeita.',
      },
      {
        id: 'movement',
        label: 'Movimento e força',
        currentScore: pillarScores.movement,
        maxScore: PILLAR_MAX.movement,
        status: pillarScores.movement >= 14 ? 'good' : pillarScores.movement >= 8 ? 'attention' : 'critical',
        explanation: 'Força e movimento são pilares concretos de proteção metabólica e longevidade.',
      },
      {
        id: 'sleep',
        label: 'Sono e recuperação',
        currentScore: pillarScores.sleep,
        maxScore: PILLAR_MAX.sleep,
        status: pillarScores.sleep >= 11 ? 'good' : pillarScores.sleep >= 7 ? 'attention' : 'critical',
        explanation: 'Sono ruim aumenta fome, impulsividade e reduz margem de execução.',
      },
      {
        id: 'regulation',
        label: 'Regulação e apoio',
        currentScore: pillarScores.regulation,
        maxScore: PILLAR_MAX.regulation,
        status: pillarScores.regulation >= 11 ? 'good' : pillarScores.regulation >= 6 ? 'attention' : 'critical',
        explanation: 'Ritual, apoio e regulação reduzem recaída comportamental silenciosa.',
      },
      {
        id: 'prevention',
        label: 'Prevenção e checkups',
        currentScore: pillarScores.prevention,
        maxScore: PILLAR_MAX.prevention,
        status: pillarScores.prevention >= 14 ? 'good' : pillarScores.prevention >= 8 ? 'attention' : 'critical',
        explanation: 'A melhor chance de evitar doença é revisar risco quando ainda está tudo aparentemente bem.',
      },
      {
        id: 'adherence',
        label: 'Adesão clínica',
        currentScore: pillarScores.adherence,
        maxScore: PILLAR_MAX.adherence,
        status: pillarScores.adherence >= 8 ? 'good' : pillarScores.adherence >= 5 ? 'attention' : 'critical',
        explanation: 'Sem adesão previsível, o app não consegue distinguir ruído de tendência real.',
      },
    ],
    trend: overallScore >= 80 ? 'improving' : overallScore >= 55 ? 'stable' : 'attention',
    delta24h,
    nextBestActions: params.goals
      .filter((goal) => !goal.completed)
      .sort((left, right) => right.scoreImpact - left.scoreImpact)
      .slice(0, 3)
      .map((goal) => ({
        id: goal.id,
        title: goal.title,
        reason: 'Completar este passo muda o score visível e melhora a leitura do seu dia.',
        href:
          goal.pillar === 'prevention'
            ? '/prevention-checklist'
            : goal.pillar === 'regulation'
              ? '/rituals'
              : goal.pillar === 'adherence'
                ? '/journey'
                : '/goals',
        scoreImpact: goal.scoreImpact,
      })),
    scoreDrivers: [
      overallScore >= 80
        ? 'Sua base está consistente o bastante para operar prevenção de forma ativa.'
        : 'Seu score ainda está sendo puxado por tarefas importantes que ficaram sem confirmação.',
      (params.sleepScore ?? 0) >= 75
        ? 'Sono está ajudando o restante do sistema a responder melhor.'
        : 'Recuperação ainda pode estar limitando energia, fome e foco.',
      preventionPressure > 0
        ? `${preventionPressure} tarefa(s) preventiva(s) merecem revisão ou agendamento.`
        : 'Nenhuma pendência preventiva crítica apareceu no motor atual.',
    ],
  };
}

export function buildPreventionChecklist(params: PreventionParams): PreventionChecklistResponse {
  const age = calculateAge(params.birthDate);
  const ageBand = resolveAgeBand(age);
  const sexAtBirth = normalizeSexAtBirth(params.sexAtBirth);
  const dueTasks: PreventionChecklistResponse['dueTasks'] = [];
  const upcomingTasks: PreventionChecklistResponse['upcomingTasks'] = [];
  const sharedDecisionTasks: PreventionChecklistResponse['sharedDecisionTasks'] = [];
  const riskFlags = new Set<string>();

  dueTasks.push({
    id: 'metabolic-review',
    title: 'Revisar exames cardiometabólicos do ciclo',
    summary: 'Peso, circunferência, glicemia, HbA1c, perfil lipídico e pressão ajudam a proteger a base metabólica.',
    category: 'labs',
    priority: params.protocolSlug === 'emagrecimento' ? 'high' : 'medium',
    dueLabel: 'Neste ciclo',
    href: '/exam-upload',
    source: 'Governança clínica MeJoy · base cardiometabólica',
  });

  if (sexAtBirth === 'female' && (age ?? 0) >= 25) {
    dueTasks.push({
      id: 'cervical-review',
      title: 'Revisar rastreio de colo do útero',
      summary: 'O app recomenda checar se o rastreio está em dia e alinhar a janela correta com a equipe clínica.',
      category: 'checkup',
      priority: 'medium',
      dueLabel: 'Confirmar com a equipe',
      href: '/prevention-checklist',
      source: 'INCA · rastreamento e detecção precoce',
    });
  }

  if (sexAtBirth === 'female' && (age ?? 0) >= 50) {
    dueTasks.push({
      id: 'breast-review',
      title: 'Confirmar estratégia de rastreio de mama',
      summary: 'Use o app para saber se sua janela de revisão está atualizada e se há necessidade de nova conversa clínica.',
      category: 'checkup',
      priority: 'medium',
      dueLabel: 'Janela etária ativa',
      href: '/consult-request',
      source: 'INCA + governança Brasil',
    });
  }

  if ((age ?? 0) >= 45) {
    upcomingTasks.push({
      id: 'colorectal-review',
      title: 'Abrir revisão de prevenção colorretal',
      summary: 'A recomendação aparece como trilha governada e deve ser confirmada com o contexto clínico individual.',
      category: 'shared-decision',
      priority: 'medium',
      dueLabel: 'Governança clínica',
      href: '/consult-request',
      source: 'USPSTF + protocolo Brasil em governança',
    });
  }

  if (sexAtBirth === 'male' && (age ?? 0) >= 50) {
    sharedDecisionTasks.push({
      id: 'prostate-shared-decision',
      title: 'Abrir conversa compartilhada sobre próstata',
      summary: 'O app não trata isso como rastreio automático; ele organiza a decisão para revisão humana.',
      category: 'shared-decision',
      priority: 'medium',
      dueLabel: 'Decisão compartilhada',
      href: '/consult-request',
      source: 'Ministério da Saúde + INCA',
    });
  }

  if (params.riskLevel === 'high') {
    riskFlags.add('sinais_clinicos_prioritarios');
    dueTasks.unshift({
      id: 'high-risk-review',
      title: 'Priorizar revisão humana do momento clínico',
      summary: 'Há sinais recentes que justificam uma conversa mais cedo com a equipe antes de novas mudanças.',
      category: 'lifestyle',
      priority: 'high',
      dueLabel: 'Hoje',
      href: '/consult-request',
      source: 'Motor de risco MeJoy',
    });
  }

  if (!params.hasExamDocuments) {
    riskFlags.add('sem_exames_recentes');
  }

  return {
    generatedAt: new Date().toISOString(),
    ageBand,
    sexAtBirth,
    riskFlags: [...riskFlags],
    dueTasks,
    upcomingTasks,
    sharedDecisionTasks,
    sources: [
      'INCA · rastreamento e detecção precoce',
      'Ministério da Saúde · decisão compartilhada em próstata',
      'USPSTF · referências internacionais para rastreio colorretal e mama',
    ],
  };
}

export function buildReferralGamificationStatus(params: {
  profileId?: string | null;
  planDurationMonths?: number;
}): ReferralGamificationStatus {
  const inviteCode = `MEJOY-${String(params.profileId ?? 'PREVIEW').slice(0, 6).toUpperCase()}`;
  const rewardProgress = params.planDurationMonths && params.planDurationMonths >= 6 ? 55 : 25;

  return {
    inviteCode,
    qrCode: `https://www.mejoy.com.br/indique?code=${encodeURIComponent(inviteCode)}`,
    invitesAccepted: 0,
    streak: 0,
    rewardProgress,
    nextReward:
      params.planDurationMonths && params.planDurationMonths >= 6
        ? 'Manter score acima de 80 e convites ativos para entrar na fila de recompensa premium.'
        : 'Suba de plano para liberar a trilha completa de benefícios e acompanhamento premium.',
  };
}

export function buildDailyCuriosity(protocolSlug: string | null | undefined) {
  if (protocolSlug === 'emagrecimento') {
    return {
      id: 'curiosity-metabolic-flexibility',
      eyebrow: 'Curiosidade do dia',
      title: 'Dormir mal aumenta fome e reduz força de decisão no dia seguinte.',
      body: 'Quando o sono quebra, o corpo tende a pedir mais energia rápida e menos esforço deliberado. Por isso proteger o sono melhora o emagrecimento sem depender só de força de vontade.',
      takeaway: 'Hoje, sono bom vale quase tanto quanto dieta boa para manter a tração do plano.',
    };
  }

  return {
    id: 'curiosity-prevention',
    eyebrow: 'Curiosidade do dia',
    title: 'Prevenir cedo costuma ser muito mais eficiente do que tratar tarde.',
    body: 'Quando checkups, rastreios e sinais entram cedo na rotina, o corpo dá pistas antes do problema virar urgência. É assim que o cuidado integral ganha anos de vida útil.',
    takeaway: 'O objetivo do app é te levar ao médico quando você ainda está bem.',
  };
}
