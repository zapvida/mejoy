import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionCard } from '@/components/action-card';
import { AppScreen } from '@/components/app-screen';
import { ErrorState } from '@/components/error-state';
import { FeatureCard } from '@/components/feature-card';
import { HealthAlert } from '@/components/health-alert';
import { InsightCard } from '@/components/insight-card';
import { LoadingState } from '@/components/loading-state';
import { MetricCard } from '@/components/metric-card';
import { PharmacyOrderCard } from '@/components/pharmacy-order-card';
import { PremiumCard } from '@/components/premium-card';
import { ScoreCard } from '@/components/score-card';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';
import { todayFeatureCards } from '@/content/mejoy-premium';
import { useSession } from '@/context/session-context';
import { getDashboard } from '@/lib/api';

export default function TodayRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setDashboard(await getDashboard(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o cockpit do dia');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  const firstName = dashboard?.profile?.name?.trim().split(/\s+/)[0] || 'MeJoy';
  const nextAction = dashboard?.healthScore.nextBestActions[0];
  const currentOrder = dashboard?.orders[0] || null;

  return (
    <AppScreen
      eyebrow="Hoje"
      title={`Olá, ${firstName}. Vamos cuidar do seu dia em 2 minutos.`}
      summary="Seu plano está ativo. Aqui você entende seu momento, vê a próxima ação e organiza médico, GLP-1, refeição, sono e farmácia sem se perder."
      support="O score resume hábitos, adesão e prevenção. Ele não substitui avaliação médica."
      refreshing={loading}
      onRefresh={() => void load()}
      heroAside={
        dashboard ? (
          <StatusBadge
            label={
              dashboard.tier.durationMonths >= 6
                ? 'plano integral ativo'
                : dashboard.tier.durationMonths >= 3
                  ? 'plano avançado ativo'
                  : 'plano essencial ativo'
            }
            tone="dark"
          />
        ) : undefined
      }
    >
      {loading && !dashboard ? (
        <LoadingState title="Montando seu cockpit do dia" body="Estou organizando score, sinais, médico e farmácia para você." />
      ) : null}

      {error && !dashboard ? (
        <ErrorState title="Não consegui abrir seu dia agora" body={error} />
      ) : null}

      {dashboard ? (
        <>
          <ScoreCard score={dashboard.healthScore} nextAction={nextAction?.title} />

          <PremiumCard tone="dark">
            <SectionTitle
              eyebrow="Próxima ação"
              title={nextAction?.title || 'Começar check-in de hoje'}
              summary={nextAction?.reason || 'Registrar seus sinais agora melhora a orientação do resto do dia.'}
              aside={<StatusBadge label={dashboard.riskStatus.label} tone={dashboard.riskStatus.level === 'high' ? 'danger' : dashboard.riskStatus.level === 'attention' ? 'warning' : 'success'} />}
            />
            <View style={{ gap: spacing.sm }}>
              <ActionCard
                eyebrow="Ação principal"
                title="Começar check-in de hoje"
                description="Sintomas, energia, fome, sono e adesão entram em um fluxo curto e claro."
                href="/symptom-checkin"
                tone="dark"
                badge={{ label: '+12 score', tone: 'dark' }}
              />
              <ActionCard
                eyebrow="Suporte médico"
                title="Falar com médico agora"
                description="Se houver sinal importante, o resumo clínico já segue antes do atendimento."
                href="/telemedicine"
                tone="default"
                badge={{ label: 'ZapVida', tone: 'brand' }}
              />
            </View>
          </PremiumCard>

          {dashboard.riskStatus.level !== 'low' ? (
            <HealthAlert title={dashboard.riskStatus.label} body={dashboard.riskStatus.summary} href="/telemedicine" severity={dashboard.riskStatus.level === 'high' ? 'danger' : 'warning'} />
          ) : null}

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Resumo do dia" title="Tudo o que precisa estar visível agora" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricCard
                label="Peso atual"
                value={
                  dashboard.metrics.currentWeightKg != null
                    ? `${dashboard.metrics.currentWeightKg.toFixed(1)} kg`
                    : 'Registrar'
                }
                caption="com meta acompanhada"
                tone="brand"
              />
              <MetricCard
                label="Plano 90 dias"
                value="Dia 28"
                caption="progresso em curso"
                tone="accent"
              />
              <MetricCard
                label="GLP-1 de hoje"
                value={dashboard.glp1.currentDoseMg != null ? `${dashboard.glp1.currentDoseMg} mg` : 'Sem dose'}
                caption="fase acompanhada"
                tone="success"
              />
              <MetricCard
                label="Sono"
                value={dashboard.sleep.consistencyScore != null ? `${dashboard.sleep.consistencyScore}/100` : 'Manual'}
                caption={dashboard.sleep.coachingTip}
                tone="warning"
              />
            </View>
          </PremiumCard>

          <PremiumCard tone="muted">
            <SectionTitle
              eyebrow={dashboard.dailyCuriosity.eyebrow}
              title={dashboard.dailyCuriosity.title}
              summary={dashboard.dailyCuriosity.body}
            />
            <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, lineHeight: 24, fontWeight: '700' }}>
              {dashboard.dailyCuriosity.takeaway}
            </Text>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="As 10 features" title="Seu app de saúde integral fica vivo aqui" summary="Cada bloco abre um fluxo real, com próxima ação clara." />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {todayFeatureCards.map((card) => (
                <FeatureCard
                  key={card.title}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  body={card.body}
                  href={card.href as never}
                  tone={card.tone}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Seu progresso" title="Onde concentrar energia hoje" summary="Leitura editorial simples, não um monte de gráfico sem orientação." />
            <View style={{ gap: spacing.sm }}>
              {dashboard.insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  tone={insight.tone}
                  title={insight.title}
                  body={insight.body}
                  metricLabel={insight.metricLabel}
                  metricValue={insight.metricValue}
                  supportingCopy={insight.supportingCopy}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Médico e farmácia" title="Você não precisa fazer tudo sozinho" summary="Quando precisar de ajuda, o caminho já está desenhado." />
            <View style={{ gap: spacing.sm }}>
              {currentOrder ? (
                <PharmacyOrderCard
                  title={currentOrder.label}
                  status={currentOrder.status}
                  eta="Recompra sugerida antes de terminar a janela atual."
                  body="Seu pedido está organizado no mesmo fluxo do tratamento, sem precisar sair do app."
                />
              ) : (
                <ActionCard
                  eyebrow="Farmácia"
                  title="Organizar prescrição e recompra"
                  description="Seus medicamentos, manipulados e GLP-1 ficam em uma área única e clara."
                  href="/pharmacy"
                  tone="brand"
                />
              )}
              <ActionCard
                eyebrow="Médico"
                title={
                  dashboard.care.latestRequestStatus
                    ? `Último status: ${dashboard.care.latestRequestStatus}`
                    : 'Preparar atendimento com contexto pronto'
                }
                description="Seu médico vê resumo clínico, sintomas recentes, dose, peso e exames antes do contato."
                href="/medical"
                tone="accent"
              />
            </View>
          </PremiumCard>
        </>
      ) : null}
    </AppScreen>
  );
}
