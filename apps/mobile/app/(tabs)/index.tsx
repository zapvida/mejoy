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
import { formatAdherence, formatDateLabel, formatWeight } from '@/lib/formatters';

function scoreLabel(score: number) {
  if (score >= 80) return 'Elite preventiva';
  if (score >= 60) return 'Consistência boa';
  if (score >= 40) return 'Zona de atenção';
  return 'Zona crítica';
}

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
          score: response.healthScore.overallScore,
          tier: response.tier.planId,
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
      await trackMobileEvent(session, {
        event: 'app_value_block_viewed',
        screen: 'home',
        status: 'ok',
        metadata: {
          featuredCount: response.productAppValue.featureMatrix.filter((feature) => feature.featured).length,
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
  const leadNotification =
    dashboard?.notifications.find((notification) => notification.priority === 'urgent') ?? dashboard?.notifications[0] ?? null;
  const pendingGoals = dashboard?.goals.filter((goal) => !goal.completed).slice(0, 3) ?? [];
  const featuredLocked = dashboard?.lockedFeatures.slice(0, 4) ?? [];

  return (
    <ScreenShell
      eyebrow="Home"
      title="Painel preventivo MeJoy"
      summary="O app organiza score, prevenção, metas, próximos passos e sinais clínicos sem virar um feed confuso. Tudo foi desenhado para o paciente saber exatamente o que mover hoje."
      support="A primeira dobra mostra onde sua saúde está, o que está puxando o score para baixo e qual ação melhora o dia seguinte com menos fricção."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard
          eyebrow="Sincronizando"
          title="Montando sua leitura integral"
          support="O painel está consolidando score, sinais, prevenção, jornada e continuidade do cuidado."
          tone="muted"
        >
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Atenção" title="Não foi possível montar sua home">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 23 }}>
            {error}
          </Text>
          <PrimaryButton label="Tentar novamente" onPress={() => void load()} />
        </SectionCard>
      ) : null}

      {dashboard ? (
        <>
          <HeroCard
            eyebrow={dashboard.protocolContext.primaryProtocolTitle}
            title={
              dashboard.profile?.name
                ? `${dashboard.profile.name}, sua saúde está em ${dashboard.healthScore.overallScore}/100`
                : `Sua saúde está em ${dashboard.healthScore.overallScore}/100`
            }
            summary={`${scoreLabel(dashboard.healthScore.overallScore)}. ${dashboard.riskStatus.summary}`}
            badge={<ClinicalStatusBadge label={dashboard.tier.planId.replace('programa_', '').replace('_', ' ')} tone={riskTone} />}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricPill
                label="Health score"
                value={`${dashboard.healthScore.overallScore}/100`}
                caption={`${scoreLabel(dashboard.healthScore.overallScore)} · Δ ${dashboard.healthScore.delta24h >= 0 ? '+' : ''}${dashboard.healthScore.delta24h}`}
                tone="brand"
              />
              <MetricPill
                label="Peso"
                value={formatWeight(dashboard.metrics.currentWeightKg)}
                caption={`Último log ${formatDateLabel(dashboard.metrics.lastWeightLoggedAt)}`}
              />
              <MetricPill
                label="Adesão"
                value={formatAdherence(dashboard.glp1.adherenceScore)}
                caption={dashboard.glp1.dosePhase || 'Fase clínica'}
                tone="accent"
              />
              <MetricPill
                label="Sono"
                value={dashboard.sleep.consistencyScore != null ? `${dashboard.sleep.consistencyScore}/100` : 'N/A'}
                caption={dashboard.sleep.coachingTip}
                tone="warning"
              />
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
            eyebrow="Pilares do score"
            title="O que mais está puxando sua nota de saúde"
            support="Cada pilar vale pontos reais. O objetivo não é perfeição; é deixar claro onde uma ação pequena muda muito o dia seguinte."
          >
            {dashboard.healthScore.pillars.map((pillar) => (
              <TimelineRow
                key={pillar.id}
                title={`${pillar.label} · ${pillar.currentScore}/${pillar.maxScore}`}
                subtitle={pillar.explanation}
                meta={pillar.status === 'good' ? 'Estável' : pillar.status === 'attention' ? 'Atenção' : 'Crítico'}
                tone={pillar.status === 'good' ? 'success' : 'warning'}
              />
            ))}
            {dashboard.healthScore.nextBestActions.map((action) => (
              <ActionTile
                key={action.id}
                eyebrow={`+${action.scoreImpact} pontos`}
                title={action.title}
                description={action.reason}
                href={action.href as never}
                tone="accent"
                caption="Abrir ação"
              />
            ))}
          </SectionCard>

          <SectionCard
            eyebrow="Agora"
            title="O melhor próximo passo"
            support="A home precisa tirar ambiguidade. Aqui fica a ação que mais reduz risco ou aumenta score com mínimo atrito."
          >
            {dashboard.journey.primaryAction ? (
              <ActionTile
                eyebrow="Ação principal"
                title={dashboard.journey.primaryAction.label}
                description={dashboard.journey.summary}
                onPress={() => router.push(dashboard.journey.primaryAction?.href as never)}
                tone={primaryActionTone === 'accent' ? 'accent' : 'brand'}
                caption="Abrir agora"
              />
            ) : null}
            {leadNotification ? (
              <ActionTile
                eyebrow="Sinal prioritário"
                title={leadNotification.title}
                description={leadNotification.body}
                href={(leadNotification.deepLink || '/notifications-center') as never}
                tone={leadNotification.priority === 'urgent' ? 'accent' : 'default'}
                caption="Ver detalhe"
              />
            ) : null}
            {dashboard.ritualSuggestion ? (
              <ActionTile
                eyebrow="Regulação sugerida"
                title={dashboard.ritualSuggestion.title}
                description={dashboard.ritualSuggestion.benefit}
                href="/rituals"
                tone="accent"
                caption="Abrir ritual"
              />
            ) : null}
          </SectionCard>

          <SectionCard
            eyebrow="Metas do dia"
            title="Gamificação inteligente do que realmente importa"
            support="Cada meta concluída sobe pontos reais em um pilar específico e reforça a leitura da sua semana."
          >
            {pendingGoals.length ? (
              pendingGoals.map((goal) => (
                <ActionTile
                  key={goal.id}
                  eyebrow={`${goal.pillar} · +${goal.scoreImpact}`}
                  title={goal.title}
                  description="Meta pendente. Abra o painel de metas para confirmar e ver o impacto no score."
                  href="/goals"
                  tone="brand"
                  caption="Atualizar"
                />
              ))
            ) : (
              <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
                Todas as metas principais deste recorte já aparecem como concluídas. Abra a central de metas para revisar a próxima camada.
              </Text>
            )}
          </SectionCard>

          <SectionCard
            eyebrow="Prevenção"
            title="Não espere piorar para agir"
            support="O app organiza rastreio, checkups e revisão clínica para que prevenção entre na rotina quando a pessoa ainda está bem."
            tone="muted"
          >
            {dashboard.prevention.dueTasks.slice(0, 3).map((task) => (
              <ActionTile
                key={task.id}
                eyebrow={task.priority === 'high' ? 'Prioridade alta' : 'Prevenção governada'}
                title={task.title}
                description={task.summary}
                href={task.href as never}
                tone={task.priority === 'high' ? 'accent' : 'default'}
                caption={task.dueLabel}
              />
            ))}
            <PrimaryButton
              label="Abrir checklist preventivo"
              onPress={() => router.push('/prevention-checklist')}
              tone="ghost"
              detail={`${dashboard.prevention.dueTasks.length} tarefa(s) prioritária(s) neste ciclo`}
            />
          </SectionCard>

          <SectionCard
            eyebrow={dashboard.dailyCuriosity.eyebrow}
            title={dashboard.dailyCuriosity.title}
            support={dashboard.dailyCuriosity.takeaway}
          >
            <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
              {dashboard.dailyCuriosity.body}
            </Text>
          </SectionCard>

          <SectionCard
            eyebrow="Seu plano"
            title="O que está desbloqueado hoje"
            support="O app já mostra o que o paciente tem agora e o que ainda fica reservado para fases mais profundas de cuidado."
          >
            <ActionTile
              eyebrow={`${dashboard.tier.durationMonths} mês(es)`}
              title={`Plano ${dashboard.tier.planId.replace('programa_', '').replace('_', ' ')}`}
              description={dashboard.tier.includedCare.join(' · ') || 'Prévia do ecossistema MeJoy'}
              tone="brand"
              caption="Tier atual"
            />
            {featuredLocked.length ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                {featuredLocked.map((feature) => (
                  <ClinicalStatusBadge key={feature} label={`${feature} bloqueado`} tone="attention" />
                ))}
              </View>
            ) : null}
            <ActionTile
              eyebrow="Comparativo de valor"
              title={
                dashboard.tier.planId === 'programa_6m'
                  ? 'Você já está no pacote mais completo'
                  : 'Ver o que entra no plano completo de 6 meses'
              }
              description={
                dashboard.tier.planId === 'programa_6m'
                  ? 'Seu acesso já libera prevenção, referral, canal premium e continuidade multidisciplinar.'
                  : 'Sono, rituais, prevenção, hub de exames, notifications e canal premium ficam claros na tela de benefícios.'
              }
              href="/premium-benefits"
              caption="Abrir benefícios"
            />
          </SectionCard>

          <SectionCard
            eyebrow="Ecossistema vivo"
            title="Referral, exames, relatórios e cuidado premium"
            support="O app precisa mostrar que o valor não termina na compra. Ele continua em organização clínica, prevenção e progressão do cuidado."
          >
            <ActionTile
              eyebrow="Referral"
              title={`Seu progresso de indicação está em ${dashboard.referral.rewardProgress}%`}
              description={dashboard.referral.nextReward}
              href="/referral-gamification"
              tone="accent"
              caption="Abrir referral"
            />
            <ActionTile
              eyebrow="Centro clínico"
              title="Relatórios, bundle e exames"
              description="Abra o hub para anexar documentos, revisar relatórios e compartilhar contexto de forma segura."
              href="/reports"
              tone="brand"
              caption="Abrir hub"
            />
            <ActionTile
              eyebrow="Canal premium"
              title={
                dashboard.tier.specialistChannelEligible
                  ? 'Solicitar ativação do canal com especialista'
                  : 'Canal premium disponível no plano completo'
              }
              description={
                dashboard.tier.specialistChannelEligible
                  ? 'O pedido vai para a equipe, que decide a melhor linha de acompanhamento para seu caso.'
                  : 'Antes de ativar um cuidado mais profundo, veja o comparativo dos tiers e dos benefícios assistidos.'
              }
              href={dashboard.tier.specialistChannelEligible ? '/specialist-request' : '/premium-benefits'}
              caption={dashboard.tier.specialistChannelEligible ? 'Pedir ativação' : 'Ver comparação'}
            />
          </SectionCard>

          <SectionCard
            eyebrow="Valor do app"
            title="As 10 alavancas premium que acompanham o produto"
            support="Estas são as features que tornam a compra contínua, prática e muito mais valiosa do que um simples pós-venda."
            tone="muted"
          >
            {dashboard.productAppValue.featureMatrix.map((feature) => (
              <ActionTile
                key={feature.id}
                eyebrow={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? 'Desbloqueado' : 'Incluído no ecossistema'}
                title={feature.title}
                description={feature.appValue}
                tone={feature.featured ? 'accent' : 'default'}
                caption={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? 'Ativo no seu plano' : 'Ver no comparativo'}
                href={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? undefined : '/premium-benefits'}
              />
            ))}
          </SectionCard>

          <SectionCard
            eyebrow="Insights do dia"
            title="Onde concentrar energia"
            support="Leitura editorial do que mais altera risco, consistência e margem de evolução nesta fase."
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
                Assim que houver mais sinais longitudinais, o app passa a sintetizar o que mais altera risco, prevenção e performance diária.
              </Text>
            )}
          </SectionCard>
        </>
      ) : null}
    </ScreenShell>
  );
}
