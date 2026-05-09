import React from 'react';
import { ActivityIndicator, Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { getDashboard } from '@/lib/api';

const TIER_COMPARISON = [
  {
    id: 'programa_1m',
    title: 'Plano 1 mês',
    summary: 'Dashboard, jornada GLP-1 e Meal AI para entrar rápido na rotina.',
  },
  {
    id: 'programa_3m',
    title: 'Plano 3 meses',
    summary: 'Sono, rituais e concierge clínico entram para proteger adesão e continuidade.',
  },
  {
    id: 'programa_6m',
    title: 'Plano 6 meses',
    summary: 'As 10 features, prevenção, hub de exames, referral e canal premium operado pela equipe.',
  },
];

export default function PremiumBenefitsRoute() {
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar comparação de tiers');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell
      eyebrow="Planos"
      title="Comparativo de valor do cuidado contínuo"
      summary="Esta tela existe para explicar, de forma elegante, o que cada plano realmente libera no app e por que o valor percebido cresce junto com a continuidade."
      support="Ela também serve como estado bloqueado bonito e claro, evitando sensação de app quebrado quando a pessoa ainda não destravou tudo."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard eyebrow="Carregando" title="Buscando comparação de planos">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {dashboard ? (
        <HeroCard
          eyebrow="Seu plano atual"
          title={dashboard.tier.planId.replace('programa_', '').replace('_', ' ')}
          summary={dashboard.tier.includedCare.join(' · ') || 'Prévia do cuidado premium'}
          badge={<ClinicalStatusBadge label={`${dashboard.entitlements.unlockedFeatures.length} módulos`} tone="good" />}
        />
      ) : null}

      <SectionCard eyebrow="Comparativo" title="O que muda entre 1, 3 e 6 meses">
        {TIER_COMPARISON.map((tier) => (
          <ActionTile
            key={tier.id}
            eyebrow={dashboard?.tier.planId === tier.id ? 'Seu plano' : 'Disponível'}
            title={tier.title}
            description={tier.summary}
            tone={dashboard?.tier.planId === tier.id ? 'brand' : 'default'}
            caption={dashboard?.tier.planId === tier.id ? 'Ativo' : 'Comparar'}
          />
        ))}
      </SectionCard>

      <SectionCard eyebrow="As 10 features" title="Tudo o que o plano completo destrava" tone="muted">
        {dashboard?.productAppValue.featureMatrix.map((feature) => (
          <ActionTile
            key={feature.id}
            eyebrow={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? 'Desbloqueado' : 'No plano completo'}
            title={feature.title}
            description={feature.summary}
            tone={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? 'accent' : 'default'}
            caption={dashboard.entitlements.unlockedFeatures.includes(feature.id as never) ? 'Já ativo' : 'Estado bloqueado'}
          />
        ))}
      </SectionCard>

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível comparar os planos">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
