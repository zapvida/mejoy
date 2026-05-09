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
import { getPreventionChecklist } from '@/lib/api';

export default function PreventionChecklistRoute() {
  const session = useSession();
  const [checklist, setChecklist] = React.useState<Awaited<ReturnType<typeof getPreventionChecklist>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await getPreventionChecklist(session);
      setChecklist(response);
      await trackMobileEvent(session, {
        event: 'prevention_checklist_viewed',
        screen: 'prevention-checklist',
        status: 'ok',
        metadata: {
          dueTasks: response.dueTasks.length,
          sharedDecisionTasks: response.sharedDecisionTasks.length,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar checklist preventivo');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell
      eyebrow="Prevenção"
      title="Checklist preventivo governado"
      summary="O objetivo desta tela é colocar prevenção e rastreio na rotina do paciente, sem linguagem alarmista e sem transformar o app em diagnóstico automático."
      support="As recomendações abaixo são organizadas por idade, sexo ao nascimento, sinais recentes e governança clínica do ecossistema MeJoy."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !checklist ? (
        <SectionCard eyebrow="Carregando" title="Buscando tarefas preventivas">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {checklist ? (
        <HeroCard
          eyebrow={`Faixa ${checklist.ageBand}`}
          title="Cuidar cedo vale mais do que remediar tarde"
          summary="A proposta do app é te lembrar que checkup, revisão clínica e rastreio são ferramentas de longevidade, não só resposta a problema."
          badge={<ClinicalStatusBadge label={`${checklist.dueTasks.length} pendência(s)`} tone={checklist.dueTasks.length ? 'attention' : 'good'} />}
        />
      ) : null}

      <SectionCard eyebrow="Prioridade do ciclo" title="Tarefas que merecem revisão agora">
        {checklist?.dueTasks.length ? (
          checklist.dueTasks.map((task) => (
            <ActionTile
              key={task.id}
              eyebrow={`${task.category} · ${task.priority}`}
              title={task.title}
              description={task.summary}
              href={task.href as never}
              tone={task.priority === 'high' ? 'accent' : 'default'}
              caption={task.dueLabel}
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            Nenhuma pendência preventiva crítica apareceu neste recorte.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Decisão compartilhada" title="Pontos que pedem conversa clínica">
        {checklist?.sharedDecisionTasks.length ? (
          checklist.sharedDecisionTasks.map((task) => (
            <ActionTile
              key={task.id}
              eyebrow={task.source}
              title={task.title}
              description={task.summary}
              href={task.href as never}
              caption={task.dueLabel}
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            Sem tarefas de decisão compartilhada abertas neste momento.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Fontes e governança" title="De onde vêm essas trilhas" tone="muted">
        {checklist?.sources.map((source) => (
          <Text key={source} selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
            • {source}
          </Text>
        ))}
      </SectionCard>

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível carregar a prevenção">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
