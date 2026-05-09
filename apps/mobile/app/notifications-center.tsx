import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { getNotifications } from '@/lib/api';
import { formatCampaignLabel } from '@/lib/formatters';

export default function NotificationsCenterRoute() {
  const session = useSession();
  const [notifications, setNotifications] = React.useState<Awaited<ReturnType<typeof getNotifications>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setNotifications(await getNotifications(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell
      eyebrow="Notificações"
      title="Centro de sinais do paciente"
      summary="As notificações do MeJoy existem para reduzir atrito, não para gerar culpa. Cada campanha precisa ser útil, clara e acionável."
      support="Aqui o paciente vê o que está pendente, o que já foi concluído e quais categorias estão ativas no momento."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !notifications ? (
        <SectionCard eyebrow="Carregando" title="Buscando sinais recentes">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {notifications ? (
        <HeroCard
          eyebrow="Centro clínico + lifestyle"
          title={`${notifications.notifications.length} notificações neste ciclo`}
          summary="Quiet hours, prioridade e tipo de campanha já entram no payload para o paciente entender por que o app chamou sua atenção."
          badge={<ClinicalStatusBadge label={`${notifications.preferences.quietHoursStart}h → ${notifications.preferences.quietHoursEnd}h`} tone="low" />}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <ClinicalStatusBadge label={notifications.preferences.clinical ? 'Clínico ON' : 'Clínico OFF'} tone={notifications.preferences.clinical ? 'good' : 'attention'} />
            <ClinicalStatusBadge label={notifications.preferences.lifestyle ? 'Lifestyle ON' : 'Lifestyle OFF'} tone={notifications.preferences.lifestyle ? 'good' : 'attention'} />
            <ClinicalStatusBadge label={notifications.preferences.reminders ? 'Lembretes ON' : 'Lembretes OFF'} tone={notifications.preferences.reminders ? 'good' : 'attention'} />
          </View>
        </HeroCard>
      ) : null}

      <SectionCard eyebrow="Fila atual" title="Tudo o que o app está priorizando">
        {notifications?.notifications.map((notification) => (
          <ActionTile
            key={notification.id}
            eyebrow={`${formatCampaignLabel(notification.campaignType || 'clinical')} · ${notification.priority}`}
            title={notification.title}
            description={notification.body}
            href={(notification.deepLink || undefined) as never}
            tone={notification.priority === 'urgent' ? 'accent' : 'default'}
            caption={notification.dismissState}
          />
        ))}
      </SectionCard>

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível carregar as notificações">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
