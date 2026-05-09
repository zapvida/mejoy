import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { getReferralStatus, getTierDetails } from '@/lib/api';

export default function ReferralGamificationRoute() {
  const session = useSession();
  const [referral, setReferral] = React.useState<Awaited<ReturnType<typeof getReferralStatus>> | null>(null);
  const [tier, setTier] = React.useState<Awaited<ReturnType<typeof getTierDetails>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [referralResponse, tierResponse] = await Promise.all([getReferralStatus(session), getTierDetails(session)]);
      setReferral(referralResponse);
      setTier(tierResponse);
      await trackMobileEvent(session, {
        event: 'referral_status_viewed',
        screen: 'referral',
        status: 'ok',
        metadata: {
          rewardProgress: referralResponse.rewardProgress,
          tier: tierResponse.planId,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar referral');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell
      eyebrow="Referral"
      title="Indicar também vira parte da jornada"
      summary="No lançamento store-safe, a indicação entra como gamificação e progresso de cuidado, não como carteira financeira dentro do app."
      support="A equipe pode usar essa camada para destravar benefícios operacionais e entender quem está puxando mais gente para uma jornada de saúde séria."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !referral ? (
        <SectionCard eyebrow="Carregando" title="Buscando progresso de indicação">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {referral ? (
        <HeroCard
          eyebrow="Seu código"
          title={referral.inviteCode}
          summary={referral.nextReward}
          badge={<ClinicalStatusBadge label={`${referral.rewardProgress}%`} tone={referral.rewardProgress >= 80 ? 'good' : 'attention'} />}
        />
      ) : null}

      <SectionCard eyebrow="Progresso" title="O que acontece com a indicação hoje">
        <ActionTile
          eyebrow="Link de entrada"
          title="Abrir QR ou link de convite"
          description={referral?.qrCode || 'Sem link disponível no momento.'}
          tone="brand"
          caption="Compartilhar fora do app"
        />
        <ActionTile
          eyebrow="Plano atual"
          title={tier ? `${tier.planId} · ${tier.durationMonths} mês(es)` : 'Prévia do tier'}
          description={
            tier?.specialistChannelEligible
              ? 'Seu plano já conversa com benefícios premium e ativação operacional de especialistas.'
              : 'Subir para o plano mais completo destrava a camada premium de continuidade.'
          }
          caption="Valor do tier"
        />
      </SectionCard>

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível carregar o referral">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
