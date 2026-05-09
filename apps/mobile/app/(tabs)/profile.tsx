import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionCard } from '@/components/action-card';
import { AppScreen } from '@/components/app-screen';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { MetricCard } from '@/components/metric-card';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';
import { profileQuickActions } from '@/content/mejoy-premium';
import { useSession } from '@/context/session-context';
import { getNotifications, getProfile, getTierDetails } from '@/lib/api';

export default function ProfileRoute() {
  const session = useSession();
  const [profile, setProfile] = React.useState<Awaited<ReturnType<typeof getProfile>> | null>(null);
  const [tier, setTier] = React.useState<Awaited<ReturnType<typeof getTierDetails>> | null>(null);
  const [notifications, setNotifications] = React.useState<Awaited<ReturnType<typeof getNotifications>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, tierResponse, notificationResponse] = await Promise.all([
        getProfile(session),
        getTierDetails(session),
        getNotifications(session),
      ]);
      setProfile(profileResponse);
      setTier(tierResponse);
      setNotifications(notificationResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <AppScreen
      eyebrow="Perfil"
      title="Seu cuidado também precisa de uma base organizada"
      summary="Plano, integrações, segurança, assinatura e suporte aparecem de forma limpa para qualquer faixa etária."
      support="O objetivo é evitar menus perdidos e deixar claro o que está ativo, o que está conectado e para onde ir."
      refreshing={loading}
      onRefresh={() => void load()}
      heroAside={<StatusBadge label={tier?.durationMonths === 6 ? '6 meses ativo' : tier?.durationMonths === 3 ? '3 meses ativo' : '1 mês ativo'} tone="dark" />}
    >
      {loading && !profile ? <LoadingState title="Abrindo seu perfil" body="Estou puxando assinatura, integrações e preferências." /> : null}
      {error && !profile ? <ErrorState title="Não consegui abrir seu perfil agora" body={error} /> : null}

      {profile && tier && notifications ? (
        <>
          <PremiumCard tone="default">
            <SectionTitle eyebrow="Conta" title={profile.name || 'Paciente MeJoy'} summary={profile.email || 'Conta MeJoy ativa'} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricCard label="Plano" value={`${tier.durationMonths}m`} caption="duração atual" tone="brand" />
              <MetricCard label="Features" value={String(tier.unlockedFeatures.length)} caption="desbloqueadas" tone="accent" />
              <MetricCard label="Canal premium" value={tier.specialistChannelEligible ? 'ativo' : 'indisponível'} caption="governado" tone="success" />
              <MetricCard label="Notificações" value={String(notifications.notifications.length)} caption="no feed" tone="warning" />
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Ações rápidas" title="Abra exatamente o que precisa" />
            <View style={{ gap: spacing.sm }}>
              {profileQuickActions.map((action) => (
                <ActionCard
                  key={action.title}
                  eyebrow={action.eyebrow}
                  title={action.title}
                  description={action.description}
                  href={action.href as never}
                  tone={action.tone}
                />
              ))}
              <ActionCard
                eyebrow="Notificações"
                title="Ajustar lembretes e revisar feed"
                description="Silêncio, clínica, lifestyle e mensagens importantes ficam organizados sem bagunça."
                href="/notifications-center"
              />
            </View>
          </PremiumCard>

          <PremiumCard tone="muted">
            <SectionTitle eyebrow="Segurança clínica" title="O app apoia, mas não substitui decisão médica" />
            <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
              Ajustes de dose precisam de validação médica. Se o sintoma for intenso ou persistente, fale com um médico. Seu histórico e suas preferências permanecem organizados para reduzir retrabalho.
            </Text>
          </PremiumCard>
        </>
      ) : null}
    </AppScreen>
  );
}
