import * as Notifications from 'expo-notifications';
import React from 'react';
import { Linking, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { MetricPill } from '@/components/metric-pill';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { getNotifications, getProfile } from '@/lib/api';
import { formatCampaignLabel } from '@/lib/formatters';

export default function ProfileRoute() {
  const session = useSession();
  const [profile, setProfile] = React.useState<Awaited<ReturnType<typeof getProfile>> | null>(null);
  const [notifications, setNotifications] = React.useState<Awaited<ReturnType<typeof getNotifications>> | null>(null);
  const [permission, setPermission] = React.useState<Awaited<ReturnType<typeof Notifications.getPermissionsAsync>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, notificationResponse, permissionResponse] = await Promise.all([
        getProfile(session),
        getNotifications(session),
        Notifications.getPermissionsAsync(),
      ]);
      setProfile(profileResponse);
      setNotifications(notificationResponse);
      setPermission(permissionResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  async function requestPushPermission() {
    await trackMobileEvent(session, {
      event: 'push_permission_prompted',
      screen: 'profile',
      status: 'info',
      metadata: {
        canAskAgain: permission?.canAskAgain ?? false,
      },
    });
    const nextPermission = await Notifications.requestPermissionsAsync();
    setPermission(nextPermission);
  }

  const permissionTone =
    permission?.status === 'granted' ? 'good' : permission?.canAskAgain ? 'attention' : 'high';

  return (
    <ScreenShell
      eyebrow="Perfil"
      title="Conta, preferências e permissões"
      summary="O perfil segura identidade, janela silenciosa, flags do rollout e as permissões nativas que deixam o app agir como concierge de verdade."
      support="Aqui também vivem o estado de push e os links profundos que reconectam o paciente ao fluxo certo."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      <HeroCard
        eyebrow="Conta MeJoy"
        title={profile?.name || session.email || 'Paciente MeJoy'}
        summary={profile?.email || 'Conta em modo piloto nativo.'}
        badge={<ClinicalStatusBadge label={permission?.status === 'granted' ? 'Push ativo' : 'Push pendente'} tone={permissionTone} />}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <MetricPill label="IMC" value={profile?.bmi != null ? profile.bmi.toFixed(1) : 'N/A'} caption="Leitura atual do perfil" tone="brand" />
          <MetricPill label="Peso" value={profile?.weightKg != null ? `${profile.weightKg} kg` : 'N/A'} caption="Último valor de cadastro" />
          <MetricPill label="Altura" value={profile?.heightCm != null ? `${profile.heightCm} cm` : 'N/A'} caption="Base para cálculo longitudinal" tone="accent" />
          <MetricPill label="Quiet hours" value={notifications ? `${notifications.preferences.quietHoursStart}h` : 'N/A'} caption={notifications ? `até ${notifications.preferences.quietHoursEnd}h` : 'Sem sync'} tone="warning" />
        </View>
      </HeroCard>

      {error ? (
        <SectionCard eyebrow="Atenção" title="Falha ao carregar preferências">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Push + permissões" title="Estado nativo do dispositivo">
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          Status atual: {permission?.status || 'indefinido'}.
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
          Quando o push entra, o app consegue operar lembretes clínicos, refill, pesagem, sono e rituais de forma silenciosa e segmentada.
        </Text>
        {permission?.status !== 'granted' ? (
          <PrimaryButton
            label={permission?.canAskAgain ? 'Ativar push' : 'Abrir ajustes'}
            onPress={() => {
              if (permission?.canAskAgain) {
                void requestPushPermission();
                return;
              }
              void Linking.openSettings();
            }}
          />
        ) : (
          <PrimaryButton label="Push liberado" onPress={() => void load()} tone="ghost" />
        )}
      </SectionCard>

      <SectionCard eyebrow="Preferências" title="Centro de notificações do paciente" tone="muted">
        {notifications ? (
          <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <ClinicalStatusBadge label={notifications.preferences.clinical ? 'Clínico ON' : 'Clínico OFF'} tone={notifications.preferences.clinical ? 'good' : 'attention'} />
              <ClinicalStatusBadge label={notifications.preferences.lifestyle ? 'Lifestyle ON' : 'Lifestyle OFF'} tone={notifications.preferences.lifestyle ? 'good' : 'attention'} />
              <ClinicalStatusBadge label={notifications.preferences.reminders ? 'Lembretes ON' : 'Lembretes OFF'} tone={notifications.preferences.reminders ? 'good' : 'attention'} />
              <ClinicalStatusBadge label={notifications.preferences.marketing ? 'Marketing ON' : 'Marketing OFF'} tone={notifications.preferences.marketing ? 'attention' : 'low'} />
            </View>
            {notifications.notifications.slice(0, 4).map((notification) => (
              <ActionTile
                key={notification.id}
                eyebrow={formatCampaignLabel(notification.campaignType ?? 'clinical')}
                title={notification.title}
                description={notification.body}
                href={notification.deepLink || undefined}
                caption={notification.dismissState === 'completed' ? 'Concluído' : 'Abrir fluxo'}
              />
            ))}
          </>
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            As preferências aparecem assim que o app sincronizar o centro de notificações.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Feature flags" title="Capacidades liberadas neste rollout">
        {notifications ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            {Object.entries(notifications.featureFlags).map(([flag, enabled]) => (
              <ClinicalStatusBadge
                key={flag}
                label={`${flag} ${enabled ? 'ON' : 'OFF'}`}
                tone={enabled ? 'good' : 'attention'}
              />
            ))}
          </View>
        ) : null}
      </SectionCard>

      <PrimaryButton label="Sair do app" onPress={session.signOut} tone="ghost" />
    </ScreenShell>
  );
}
