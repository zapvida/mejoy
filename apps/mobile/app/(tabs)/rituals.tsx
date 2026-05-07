import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { MetricPill } from '@/components/metric-pill';
import { RitualCard } from '@/components/ritual-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TimelineRow } from '@/components/timeline-row';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { createRitualSession, getRituals } from '@/lib/api';
import { formatDateTimeLabel } from '@/lib/formatters';

type RitualsData = Awaited<ReturnType<typeof getRituals>>;
type RitualTrack = RitualsData['tracks'][number];

export default function RitualsRoute() {
  const session = useSession();
  const [rituals, setRituals] = React.useState<RitualsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submittingId, setSubmittingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setRituals(await getRituals(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar rituais');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  async function completeTrack(track: RitualTrack) {
    setSubmittingId(track.id);
    setError(null);
    try {
      await createRitualSession(session, {
        ritualId: track.id,
        category: track.category,
        durationMinutes: track.durationMinutes,
        outcome: 'completed',
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await trackMobileEvent(session, {
        event: 'meditation_started',
        screen: 'rituals',
        status: 'ok',
        metadata: {
          ritualId: track.id,
          category: track.category,
        },
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar ritual');
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <ScreenShell
      eyebrow="Rituais"
      title="Regulação curta e elegante"
      summary="Micro-áudios de 2 a 10 minutos entram como ferramenta de craving, ansiedade, foco e pré-sono, sem virar uma aba de wellness genérica."
      support="O app escolhe um ritual sugerido com base em sono, jornada e sinais recentes de atrito."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !rituals ? (
        <SectionCard eyebrow="Carregando" title="Buscando biblioteca">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {rituals ? (
        <HeroCard
          eyebrow="Rituais proprietários MeJoy"
          title={rituals.featured ? rituals.featured.title : 'Biblioteca pronta para o dia'}
          summary={rituals.featured ? rituals.featured.benefit : 'Uma prática curta bem encaixada muda a curva do resto do dia.'}
          badge={<ClinicalStatusBadge label={rituals.featured ? 'Sugerido agora' : 'Sempre disponível'} tone="good" />}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <MetricPill label="Trilhas" value={String(rituals.tracks.length)} caption="Biblioteca curta e objetiva" tone="brand" />
            <MetricPill label="Sessões" value={String(rituals.recentSessions.length)} caption="Histórico mais recente" />
            <MetricPill label="Featured" value={rituals.featured ? `${rituals.featured.durationMinutes} min` : 'N/A'} caption={rituals.featured?.recommendedFor || 'Sem sugestão atual'} tone="accent" />
            <MetricPill label="Formato" value="Micro-áudio" caption="Sessões curtas de regulação contextual" tone="warning" />
          </View>
        </HeroCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível registrar o ritual">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Biblioteca" title="Escolha a prática certa para este momento">
        {rituals?.tracks.map((track) => (
          <RitualCard
            key={track.id}
            track={track}
            recommended={rituals.featured?.id === track.id}
            loading={submittingId === track.id}
            onComplete={() => void completeTrack(track)}
          />
        ))}
      </SectionCard>

      <SectionCard eyebrow="Sessões recentes" title="Como a regulação está entrando na rotina" tone="muted">
        {rituals?.recentSessions.length ? (
          rituals.recentSessions.map((session) => (
            <TimelineRow
              key={session.id}
              title={`${session.category} · ${session.durationMinutes} min`}
              subtitle={session.insight || session.reflection || 'Sessão registrada no histórico do paciente.'}
              meta={formatDateTimeLabel(session.completedAt)}
              tone={session.outcome === 'completed' ? 'success' : 'warning'}
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            Quando o paciente concluir a primeira prática, ela aparece aqui como reforço de consistência.
          </Text>
        )}
      </SectionCard>
    </ScreenShell>
  );
}
