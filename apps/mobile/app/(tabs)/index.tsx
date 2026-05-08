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
      await trackMobileEvent(session, {
        event: 'protocol_personalized_home_loaded',
        screen: 'home',
        status: 'ok',
        metadata: {
          activationState: response.activationState,
          careLane: response.careLane,
          protocol: response.protocolContext.primaryProtocolSlug,
          recommendedModules: response.recommendedModules.length,
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
  const leadNotification = dashboard?.notifications.find((notification) => notification.priority === 'urgent') ?? dashboard?.notifications[0] ?? null;

  return (
    <ScreenShell
      eyebrow="Home"
      title="Painel de continuidade"
      summary="O app organiza o que importa hoje, o que merece monitoramento e o que ja esta fluindo sem atrito na sua jornada clinica."
      support="Puxe para atualizar peso, sinais, refill, documentos e tarefas do concierge sem sair do mesmo painel."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard
          eyebrow="Sincronizando"
          title="Montando seu dia clinico"
          support="O painel esta consolidando sinais, jornada e operacao em uma leitura unica."
          tone="muted"
        >
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard
          eyebrow="Atencao"
          title="Nao foi possivel carregar o painel"
          support="Sua sessao continua preservada. Tente novamente para restaurar a leitura completa."
        >
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
              <MetricPill label="Peso" value={formatWeight(dashboard.metrics.currentWeightKg)} caption={`Ultimo log ${formatDateLabel(dashboard.metrics.lastWeightLoggedAt)}`} tone="brand" />
              <MetricPill label="IMC" value={dashboard.metrics.bmi != null ? dashboard.metrics.bmi.toFixed(1) : 'N/A'} caption="Faixa corporal atual" />
              <MetricPill label="Adesao" value={formatAdherence(dashboard.glp1.adherenceScore)} caption={dashboard.glp1.dosePhase || 'Fase nao definida'} tone="accent" />
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

          <SectionCard
            eyebrow="Hoje"
            title="O melhor proximo passo"
            support="A primeira dobra do app serve para tirar ambiguidade e deixar claro o que fazer agora."
          >
            {dashboard.journey.primaryAction ? (
              <ActionTile
                eyebrow="Agora"
                title={dashboard.journey.primaryAction.label}
                description={dashboard.journey.summary}
                onPress={() => router.push(dashboard.journey.primaryAction?.href as never)}
                tone={primaryActionTone === 'accent' ? 'accent' : 'brand'}
                caption="Abrir agora"
              />
            ) : null}
            {dashboard.ritualSuggestion ? (
              <ActionTile
                eyebrow="Ritual sugerido"
                title={dashboard.ritualSuggestion.title}
                description={dashboard.ritualSuggestion.benefit}
                href="/rituals"
                tone="accent"
                caption="Abrir ritual"
              />
            ) : null}
            {leadNotification ? (
              <ActionTile
                eyebrow="Sinal prioritario"
                title={leadNotification.title}
                description={leadNotification.body}
                href={leadNotification.deepLink || undefined}
                tone={leadNotification.priority === 'urgent' ? 'accent' : 'default'}
                caption={leadNotification.deepLink ? 'Abrir detalhe' : 'Monitorado pela equipe'}
              />
            ) : !dashboard.refill ? (
              <ActionTile
                eyebrow="Refill"
                title="Planejar o proximo reabastecimento"
                description="Abra o pedido cedo para evitar interrupcao de rotina e ruido operacional."
                href="/refill-request"
                caption="Solicitar refill"
              />
            ) : null}
          </SectionCard>

          <SectionCard
            eyebrow="Personalizado para voce"
            title={dashboard.protocolContext.primaryProtocolTitle}
            support="A priorizacao da home considera produto comprado, protocolo principal e sinais mais recentes em vez de abrir um app generico."
          >
            <ActionTile
              eyebrow={dashboard.activationState.replace(/_/g, ' ')}
              title={dashboard.productAppValue.headline}
              description={dashboard.productAppValue.summary}
              tone="brand"
              caption="Acesso premium ativo"
            />
            {dashboard.recommendedActions.map((action) => (
              <ActionTile
                key={action.href}
                eyebrow="Prioridade do sistema"
                title={action.label}
                description={action.reason}
                href={action.href as never}
                tone="accent"
                caption="Abrir"
              />
            ))}
          </SectionCard>

          <SectionCard
            eyebrow="Insights do dia"
            title="Onde vale concentrar energia"
            support="Leitura editorial do que mais altera risco, adesao e performance cotidiana."
          >
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
                Assim que houver mais sinais longitudinais, o app passa a sintetizar o que mais altera risco, adesao e performance diaria.
              </Text>
            )}
          </SectionCard>

          <SectionCard
            eyebrow="Valor do ecossistema"
            title="O que o App MeJoy Premium ja coloca na sua rotina"
            support="Estas sao as alavancas de maior valor percebido que o produto web entrega junto com a continuidade nativa."
            tone="muted"
          >
            {dashboard.productAppValue.featureMatrix
              .filter((feature) => feature.featured)
              .slice(0, 5)
              .map((feature) => (
                <ActionTile
                  key={feature.id}
                  eyebrow="Feature premium"
                  title={feature.title}
                  description={feature.appValue}
                  tone={dashboard.recommendedModules.includes(feature.id as never) ? 'accent' : 'default'}
                  caption="Incluido no seu acesso"
                />
              ))}
          </SectionCard>

          <SectionCard
            eyebrow="Ferramentas do app"
            title="Loops premium ativos"
            support="Essas alavancas continuam disponiveis quando voce quiser aprofundar a jornada."
          >
            <ActionTile
              eyebrow="Meal AI"
              title="Ler prato ou cardapio"
              description="Use texto ou imagem para estimar calorias, risco e melhor escolha para a fase atual."
              href="/meal-analysis"
              tone="brand"
            />
            <ActionTile
              eyebrow="Consulta"
              title="Solicitar concierge clinico"
              description="Abra um pedido com SLA claro, contexto de sintomas e handoff seguro."
              href="/consult-request"
            />
            <ActionTile
              eyebrow="Exames"
              title="Adicionar documento ao hub"
              description="Suba PDFs ou imagens para OCR, timeline e revisao clinica."
              href="/exam-upload"
            />
            <ActionTile
              eyebrow="Medico externo"
              title="Gerar bundle compartilhavel"
              description="Monte um link seguro com exames, peso, sono e sinais recentes."
              href="/share-bundle"
            />
            {!dashboard.ritualSuggestion ? (
              <ActionTile
                eyebrow="Rituais"
                title="Abrir biblioteca de rituais"
                description="Veja rotinas guiadas para sono, adesao, saciedade e previsibilidade da semana."
                href="/rituals"
                tone="accent"
                caption="Abrir rituais"
              />
            ) : null}
          </SectionCard>

          <SectionCard
            eyebrow="Notificacoes inteligentes"
            title="Fila priorizada do paciente"
            support="Alertas clinicos, operacionais e comportamentais aparecem ordenados por urgencia e contexto."
            tone="muted"
          >
            {dashboard.notifications.length === 0 ? (
              <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
                Sem alertas relevantes agora. O motor de push continua pronto para campanhas clinicas, sono, ritual e refill sem poluir a tela.
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

          <SectionCard
            eyebrow="Clinica e operacao"
            title="Status assistencial"
            support="Aqui voce enxerga a camada operacional que sustenta a experiencia premium por tras da interface."
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricPill label="Pedidos" value={String(dashboard.orders.length)} caption="Historico comercial consolidado" />
              <MetricPill label="Relatorios" value={String(dashboard.reports.length)} caption="Itens recentes no BFF" />
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
