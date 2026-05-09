import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionCard } from '@/components/action-card';
import { AppScreen } from '@/components/app-screen';
import { ErrorState } from '@/components/error-state';
import { InsightCard } from '@/components/insight-card';
import { LoadingState } from '@/components/loading-state';
import { MetricCard } from '@/components/metric-card';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';
import { TimelineRow } from '@/components/timeline-row';
import { weeklyGoals, planMilestones } from '@/content/mejoy-premium';
import { useSession } from '@/context/session-context';
import { getDashboard, getJourney } from '@/lib/api';

export default function PlanRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [journey, setJourney] = React.useState<Awaited<ReturnType<typeof getJourney>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [dashboardResponse, journeyResponse] = await Promise.all([getDashboard(session), getJourney(session)]);
      setDashboard(dashboardResponse);
      setJourney(journeyResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o plano');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <AppScreen
      eyebrow="Plano"
      title="Seu programa de 90 dias, sem confusão"
      summary="Aqui o paciente entende a fase atual, as metas da semana, o que mudou e qual é a próxima ação com mais impacto."
      support="O plano organiza GLP-1, alimentação, movimento, sono, prevenção e comportamento no mesmo mapa."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <LoadingState title="Montando seu plano" body="Estou alinhando jornada, metas e fases do programa." />
      ) : null}

      {error && !dashboard ? <ErrorState title="Não consegui abrir o plano agora" body={error} /> : null}

      {dashboard && journey ? (
        <>
          <PremiumCard tone="dark">
            <SectionTitle eyebrow="Semana atual" title="Você está no dia 28 de um plano de 90 dias" summary="A meta agora é proteger constância, leitura de sintomas e adesão." />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {weeklyGoals.map((goal) => (
                <MetricCard key={goal.label} label={goal.label} value={goal.value} caption={goal.caption} tone={goal.tone} />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Linha do tempo" title="O que muda ao longo do programa" />
            <View style={{ gap: spacing.sm }}>
              {planMilestones.map((milestone) => (
                <TimelineRow
                  key={milestone.title}
                  title={milestone.title}
                  subtitle={milestone.subtitle}
                  meta={milestone.meta}
                  tone={milestone.tone}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Próximos blocos" title="Abra a parte certa na hora certa" />
            <View style={{ gap: spacing.sm }}>
              <ActionCard
                eyebrow="GLP-1"
                title="Dose, aplicação e sinais da semana"
                description="Fase, próxima aplicação, local, hidratação, proteína e segurança no mesmo fluxo."
                href="/glp1-journey"
                tone="brand"
              />
              <ActionCard
                eyebrow="Check-in"
                title="Registrar sintomas e efeitos adversos"
                description="Náusea, constipação, fraqueza, fome, humor e sono entram em um check-in curto."
                href="/symptom-checkin"
                tone="accent"
              />
              <ActionCard
                eyebrow="Prevenção"
                title="Abrir checklist preventivo"
                description="O cuidado não espera a piora: rastreio, exames e revisão médica entram cedo."
                href="/prevention-checklist"
              />
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Educação aplicada" title="O que mais move sua evolução agora" />
            <View style={{ gap: spacing.sm }}>
              {journey.insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  tone={insight.tone === 'good' ? 'celebration' : insight.tone === 'warning' ? 'warning' : 'performance'}
                  title={insight.title}
                  body={insight.body}
                  supportingCopy="O plano simplifica a mensagem para não virar texto demais."
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="muted">
            <SectionTitle eyebrow="Pilares" title="O que o programa quer de você nesta semana" />
            <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
              Água, proteína, sono, treino de força, medicação e prevenção clínica aparecem como tarefas claras porque pequenas ações diárias geram grandes resultados.
            </Text>
          </PremiumCard>
        </>
      ) : null}
    </AppScreen>
  );
}
