import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { getNotifications, getProfile } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { MobileProfile, NotificationListResponse } from '@mejoy/api-contracts/mobile';

export default function ProfileRoute() {
  const session = useSession();
  const [profile, setProfile] = React.useState<MobileProfile | null>(null);
  const [notifications, setNotifications] = React.useState<NotificationListResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    Promise.all([getProfile(session), getNotifications(session)])
      .then(([profileResponse, notificationResponse]) => {
        setProfile(profileResponse);
        setNotifications(notificationResponse);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      });
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell summary="Perfil, preferências de notificação e visão de flags mobile que controlam rollout, rollback e lançamento contínuo.">
      <SectionCard eyebrow="Conta" title="Identidade do paciente">
        {error ? <Text selectable style={{ color: colors.danger }}>{error}</Text> : null}
        <Text selectable style={{ color: colors.text }}>Email: {profile?.email || session.email}</Text>
        <Text selectable style={{ color: colors.text }}>Nome: {profile?.name || 'Não informado'}</Text>
        <Text selectable style={{ color: colors.text }}>WhatsApp: {profile?.whatsapp || 'Não informado'}</Text>
        <Text selectable style={{ color: colors.text }}>
          IMC atual: {profile?.bmi != null ? profile.bmi.toFixed(1) : 'indisponível'}
        </Text>
      </SectionCard>

      <SectionCard eyebrow="Push + quiet hours" title="Preferências ativas">
        {notifications ? (
          <>
            <Text selectable style={{ color: colors.text }}>
              Janela silenciosa: {notifications.preferences.quietHoursStart}h → {notifications.preferences.quietHoursEnd}h
            </Text>
            <Text selectable style={{ color: colors.text }}>
              Clínico: {notifications.preferences.clinical ? 'ligado' : 'desligado'}
            </Text>
            <Text selectable style={{ color: colors.text }}>
              Lifestyle: {notifications.preferences.lifestyle ? 'ligado' : 'desligado'}
            </Text>
            <Text selectable style={{ color: colors.text }}>
              Marketing: {notifications.preferences.marketing ? 'ligado' : 'desligado'}
            </Text>
          </>
        ) : (
          <Text selectable style={{ color: colors.textMuted }}>Preferências serão exibidas após a primeira sincronização.</Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Feature flags" title="Capacidades liberadas no app">
        {notifications ? (
          Object.entries(notifications.featureFlags).map(([flag, enabled]) => (
            <View key={flag} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text selectable style={{ color: colors.text }}>{flag}</Text>
              <Text selectable style={{ color: enabled ? colors.success : colors.warning }}>{enabled ? 'ON' : 'OFF'}</Text>
            </View>
          ))
        ) : null}
      </SectionCard>

      <PrimaryButton label="Sair do piloto" onPress={session.signOut} />
    </ScreenShell>
  );
}
