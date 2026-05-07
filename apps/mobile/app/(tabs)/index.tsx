import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { InsightCard } from '@/components/insight-card';
import { MetricPill } from '@/components/metric-pill';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TimelineRow } from '@/components/timeline-row';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { getDashboard } from '@/lib/api';
import { formatAdherence, formatCampaignLabel, formatDateLabel, formatWeight } from '@/lib/formatters';

export default function DashboardRoute() {
  const router = useRouter();
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboard(session);
      setDashboard(response);
      await trackMobileEvent(session, {
        event: 'dashboard_loaded',
        screen: 'home',
        status: 'ok',
        metadata: {
          notifications: response.notifications.length,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  const riskTone = dashboard?.riskStatus.level === 'high' ? 'high' : dashboard?.riskStatus.level === 'attention' ? 'attention' : 'low';
  const primaryActionTone =
    dashboard?.journey.primaryAction?.variant === 'secondary'
      ? 'ghost'
      : dashboard?.journey.primaryAction?.variant === 'support'
        ? 'accent'
        : 'brand';

  return (
    <ScreenShell
      eyebrow="Home"
      title="Painel longitudinal"
      summary="Seu status clínico, retenção diária e operação assistida aparecem no mesmo fluxo, com prioridade clara sobre o que mexe mais no tratamento hoje."
      support="Puxe para atualizar o dashboard e refletir novas pesagens, refill, documentos e práticas de regulação."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard eyebrow="Sincronizando" title="Montando seu dia clínico" tone="muted">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Atenção" title="Não foi possível carregar o painel">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 23 }}>
            {error}
          </Text>
          <PrimaryButton label="Tentar novamente" onPress={() => void load()} />
        </SectionCard>
      ) : null}

      {dashboard ? (
        <>
          <HeroCard
            eyebrow={dashboard.journey.state}
            title={dashboard.profile?.name ? `${dashboard.profile.name}, ${dashboard.journey.title}` : dashboard.journey.title}
            summary={dashboard.riskStatus.summary}
            badge={<ClinicalStatusBadge label={dashboard.riskStatus.label} tone={riskTone} />}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricPill label="Peso" value={formatWeight(dashboard.metrics.currentWeightKg)} caption={`Último log ${formatDateLabel(dashboard.metrics.lastWeightLoggedAt)}`} tone="brand" />
              <MetricPill label="IMC" value={dashboard.metrics.bmi != null ? dashboard.metrics.bmi.toFixed(1) : 'N/A'} caption="Faixa corporal atual" />
              <MetricPill label="Adesão" value={formatAdherence(dashboard.glp1.adherenceScore)} caption={dashboard.glp1.dosePhase || 'Fase não definida'} tone="accent" />
              <MetricPill label="Sono" value={dashboard.sleep.consistencyScore != null ? `${dashboard.sleep.consistencyScore}/100` : 'N/A'} caption={dashboard.sleep.coachingTip} tone="warning" />
            </View>
            {dashboard.journey.primaryAction ? (
              <PrimaryButton
                label={dashboard.journey.primaryAction.label}
                detail={dashboard.journey.summary}
                tone={primaryActionTone}
                onPress={() => router.push(dashboard.journey.primaryAction?.href as never)}
              />
            ) : null}
          </HeroCard>

          <SectionCard eyebrow="Insights do dia" title="Onde vale concentrar energia">
            {dashboard.insights.length ? (
              dashboard.insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  tone={insight.tone}
                  title={insight.title}
                  body={insight.body}
                  metricLabel={insight.metricLabel}
                  metricValue={insight.metricValue}
                  supportingCopy={insight.supportingCopy}
                />
              ))
            ) : (
              <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
                Assim que houver mais sinais longitudinais, o app passa a sintetizar o que mais altera risco, adesão e performance diária.
              </Text>
            )}
          </SectionCard>

          <SectionCard eyebrow="Próximos passos" title="Loops premium do app">
            <ActionTile
              eyebrow="Meal AI"
              title="Ler prato ou cardápio"
              description="Use texto ou imagem para estimar calorias, risco e melhor escolha para a fase atual."
              href="/meal-analysis"
              tone="brand"
            />
            <ActionTile
              eyebrow="Consulta"
              title="Solicitar concierge clínico"
              description="Abra um pedido com SLA claro, contexto de sintomas e handoff seguro."
              href="/consult-request"
            />
            <ActionTile
              eyebrow="Exames"
              title="Adicionar documento ao hub"
              description="Suba PDFs ou imagens para OCR, timeline e revisão clínica."
              href="/exam-upload"
            />
            <ActionTile
              eyebrow="Médico externo"
              title="Gerar bundle compartilhável"
              description="Monte um link seguro com exames, peso, sono e sinais recentes."
              href="/share-bundle"
            />
            {dashboard.ritualSuggestion ? (
              <ActionTile
                eyebrow="Ritual sugerido"
                title={dashboard.ritualSuggestion.title}
                description={dashboard.ritualSuggestion.benefit}
                href="/rituals"
                tone="accent"
                caption="Abrir rituais"
              />
            ) : null}
            {!dashboard.refill ? (
              <ActionTile
                eyebrow="Refill"
                title="Planejar o próximo reabastecimento"
                description="Abra o pedido cedo para evitar interrupção de rotina e ruído operacional."
                href="/refill-request"
                caption="Solicitar refill"
              />
            ) : null}
          </SectionCard>

          <SectionCard eyebrow="Notificações inteligentes" title="Fila priorizada do paciente" tone="muted">
            {dashboard.notifications.length === 0 ? (
              <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
                Sem alertas relevantes agora. O motor de push está pronto para campanhas clínicas, sono, ritual e refill.
              </Text>
            ) : (
              dashboard.notifications.slice(0, 4).map((notification) => (
                <ActionTile
                  key={notification.id}
                  eyebrow={formatCampaignLabel(notification.campaignType ?? 'clinical')}
                  title={notification.title}
                  description={notification.body}
                  caption={notification.deepLink ? 'Abrir detalhe' : (notification.priority ?? 'medium').toUpperCase()}
                  href={notification.deepLink || undefined}
                  tone={notification.priority === 'urgent' ? 'accent' : 'default'}
                />
              ))
            )}
          </SectionCard>

          <SectionCard eyebrow="Clínica e operação" title="Status assistencial">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricPill label="Pedidos" value={String(dashboard.orders.length)} caption="Histórico comercial consolidado" />
              <MetricPill label="Relatórios" value={String(dashboard.reports.length)} caption="Itens recentes no BFF" />
              <MetricPill label="Exames" value={String(dashboard.exams.totalDocuments)} caption="Documentos no hub" />
              <MetricPill
                label="Consulta"
                value={dashboard.care.latestRequestStatus || 'Sem fila'}
                caption={`SLA ${dashboard.care.conciergeSlaHours}h`}
              />
            </View>
            {dashboard.orders.slice(0, 3).map((order) => (
              <TimelineRow
                key={order.id}
                title={order.label}
                subtitle={`Status ${order.status} · R$ ${(order.amountCents / 100).toFixed(2)}`}
                meta={formatDateLabel(order.createdAt)}
              />
            ))}
          </SectionCard>
        </>
      ) : null}
    </ScreenShell>
  );
}
