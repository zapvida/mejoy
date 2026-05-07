import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { MetricPill } from '@/components/metric-pill';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TimelineRow } from '@/components/timeline-row';
import { UploadQueueCard } from '@/components/upload-queue-card';
import { useSession } from '@/context/session-context';
import { getDashboard, getExams } from '@/lib/api';
import { formatDateLabel } from '@/lib/formatters';

export default function ReportsRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<Awaited<ReturnType<typeof getDashboard>> | null>(null);
  const [exams, setExams] = React.useState<Awaited<ReturnType<typeof getExams>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [dashboardResponse, examsResponse] = await Promise.all([getDashboard(session), getExams(session)]);
      setDashboard(dashboardResponse);
      setExams(examsResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell
      eyebrow="Relatórios"
      title="Centro clínico do paciente"
      summary="Aqui o paciente entende o que já foi produzido, o que ainda está na fila e o que pode ser compartilhado com o médico externo sem fricção."
      support="O hub combina relatórios MeJoy, timeline de exames e o bundle seguro para handoff assistido."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !dashboard ? (
        <SectionCard eyebrow="Carregando" title="Buscando relatórios e documentos">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Atenção" title="Falha ao sincronizar dados">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      {dashboard ? (
        <HeroCard
          eyebrow="Relatórios + exames + concierge"
          title="Seu contexto clínico está pronto para circular"
          summary="O bundle MeJoy reduz o retrabalho do médico e encurta o caminho entre histórico, exame e próxima decisão."
          badge={<ClinicalStatusBadge label={`${dashboard.reports.length} relatórios`} tone="good" />}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <MetricPill label="Relatórios" value={String(dashboard.reports.length)} caption="Itens recentes consolidados" tone="brand" />
            <MetricPill label="Exames" value={String(exams?.documents.length || 0)} caption="Docs no hub do paciente" />
            <MetricPill label="Checklist" value={String(dashboard.exams.pendingChecklist.length)} caption="Pendências sugeridas pela fase" tone="warning" />
            <MetricPill label="Consulta" value={dashboard.care.latestRequestStatus || 'Sem fila'} caption={`SLA ${dashboard.care.conciergeSlaHours}h`} tone="accent" />
          </View>
        </HeroCard>
      ) : null}

      <SectionCard eyebrow="Relatórios MeJoy" title="Leitura assistida dos últimos materiais">
        {dashboard?.reports.length ? (
          dashboard.reports.map((report) => (
            <TimelineRow
              key={report.id}
              title={`${report.triageSlug} · ${report.status}`}
              subtitle={report.summary || 'Resumo clínico indisponível neste momento.'}
              meta={formatDateLabel(report.createdAt)}
              tone="success"
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            Assim que houver relatórios ativos, eles aparecem aqui com linguagem simplificada e ponte direta para consulta.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Hub de exames" title="Fila documental e OCR clínico" tone="muted">
        {exams?.documents.length ? (
          exams.documents.slice(0, 4).map((document) => <UploadQueueCard key={document.id} document={document} />)
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            Nenhum documento foi anexado ainda. O hub está pronto para PDF, imagem e revisão assistida.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Timeline clínica" title="Últimos marcos do hub">
        {exams?.timeline.length ? (
          exams.timeline.map((item) => (
            <TimelineRow
              key={item.id}
              title={item.title}
              subtitle={item.summary || `${item.type} em status ${item.status}.`}
              meta={formatDateLabel(item.occurredAt)}
              tone={item.status === 'ready' ? 'success' : 'warning'}
            />
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            A timeline aparece conforme exames entram na fila e passam por OCR ou revisão.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Compartilhamento e handoff" title="Abrir próximo passo">
        <ActionTile
          eyebrow="Bundle"
          title="Gerar pacote clínico seguro"
          description="Monte um link expirável com relatórios, peso, sono e documentos relevantes."
          href="/share-bundle"
          tone="brand"
        />
        <ActionTile
          eyebrow="Consulta"
          title="Solicitar suporte do concierge"
          description="Se houver dúvida de conduta, ajuste de dose ou evento adverso, acione o handoff clínico."
          href="/consult-request"
        />
        <ActionTile
          eyebrow="Documentos"
          title="Adicionar novo exame"
          description="Anexe um PDF ou imagem para manter a linha clínica atualizada."
          href="/exam-upload"
          tone="accent"
        />
      </SectionCard>
    </ScreenShell>
  );
}
