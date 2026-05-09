import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { getDashboard, toggleGoalProgress } from '@/lib/api';

export default function GoalsRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submittingId, setSubmittingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setDashboard(await getDashboard(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar metas');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  async function toggleGoal(goalId: string, completed: boolean) {
    setSubmittingId(goalId);
    setError(null);
    try {
      await toggleGoalProgress(session, {
        id: goalId,
        completed: !completed,
      });
      await trackMobileEvent(session, {
        event: 'goal_toggled',
        screen: 'goals',
        status: 'ok',
        metadata: {
          goalId,
          completed: !completed,
        },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar meta');
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <ScreenShell
      eyebrow="Metas"
      title="Score e progresso em uma linguagem simples"
      summary="As metas do MeJoy foram desenhadas para transformar orientação clínica em ações pequenas, claras e fáceis de marcar no dia a dia."
      support="Cada meta concluída move um pilar do score. O objetivo não é lotar a interface: é destacar o que realmente mexe na sua saúde."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard eyebrow="Carregando" title="Montando metas do dia">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {dashboard ? (
        <HeroCard
          eyebrow="Health score"
          title={`${dashboard.healthScore.overallScore}/100 hoje`}
          summary={`Seu score está em ${dashboard.healthScore.overallScore}/100 e muda conforme você confirma hábitos, prevenção e adesão clínica.`}
          badge={<ClinicalStatusBadge label={`${dashboard.goals.filter((goal) => goal.completed).length}/${dashboard.goals.length} concluídas`} tone="good" />}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {dashboard.healthScore.pillars.map((pillar) => (
              <ClinicalStatusBadge
                key={pillar.id}
                label={`${pillar.label} ${pillar.currentScore}/${pillar.maxScore}`}
                tone={pillar.status === 'good' ? 'good' : pillar.status === 'attention' ? 'attention' : 'high'}
              />
            ))}
          </View>
        </HeroCard>
      ) : null}

      {dashboard?.goals.map((goal) => (
        <SectionCard
          key={goal.id}
          eyebrow={`${goal.pillar} · +${goal.scoreImpact}`}
          title={goal.title}
          support={
            goal.completed
              ? 'Meta concluída. O score deste pilar já foi atualizado.'
              : 'Meta pendente. Confirmar este passo ajuda a leitura do seu dia e dá direção concreta para amanhã.'
          }
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <ClinicalStatusBadge label={goal.requiresProof ? 'Pede comprovação' : 'Confirmação simples'} tone={goal.requiresProof ? 'attention' : 'low'} />
            <ClinicalStatusBadge label={goal.completed ? 'Concluída' : 'Pendente'} tone={goal.completed ? 'good' : 'attention'} />
          </View>
          <PrimaryButton
            label={goal.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
            onPress={() => void toggleGoal(goal.id, goal.completed)}
            tone={goal.completed ? 'ghost' : 'brand'}
            disabled={submittingId === goal.id}
          />
        </SectionCard>
      ))}

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível atualizar meta">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
