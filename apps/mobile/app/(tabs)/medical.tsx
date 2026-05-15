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
import { TimelineRow } from '@/components/timeline-row';
import { medicalQuickActions } from '@/content/mejoy-premium';
import { useSession } from '@/context/session-context';
import { getDashboard, getExams } from '@/lib/api';

export default function MedicalRoute() {
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
      setError(err instanceof Error ? err.message : 'Erro ao abrir a área médica');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <AppScreen
      eyebrow="Médico"
      title="Atendimento rápido com contexto pronto"
      summary="A experiência médica precisa parecer premium: o paciente sabe o que fazer, o médico recebe resumo e o histórico fica organizado."
      support="ZapVida entra como caminho assistencial do ecossistema, com orientação humana para ajuste de dose, sintomas importantes e dúvidas clínicas."
      refreshing={loading}
      onRefresh={() => void load()}
      heroAside={<StatusBadge label="ZapVida ativo" tone="dark" />}
    >
      {loading && !dashboard ? <LoadingState title="Abrindo sua área médica" body="Estou organizando fila, resumo clínico e histórico recente." /> : null}
      {error && !dashboard ? <ErrorState title="Não consegui abrir sua área médica agora" body={error} /> : null}

      {dashboard && exams ? (
        <>
          <PremiumCard tone="dark">
            <SectionTitle eyebrow="Resumo automático" title="Seu médico já recebe o essencial antes do contato" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <MetricCard label="Peso" value={dashboard.metrics.currentWeightKg != null ? `${dashboard.metrics.currentWeightKg.toFixed(1)} kg` : 'Sem leitura'} caption="último registro" tone="brand" />
              <MetricCard label="Dose atual" value={dashboard.glp1.currentDoseMg != null ? `${dashboard.glp1.currentDoseMg} mg` : 'Sem dose'} caption="GLP-1" tone="accent" />
              <MetricCard label="Exames" value={String(exams.documents.length)} caption="documentos no hub" tone="success" />
              <MetricCard label="Sono" value={dashboard.sleep.consistencyScore != null ? `${dashboard.sleep.consistencyScore}/100` : 'manual'} caption="recuperação" tone="warning" />
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Ações" title="Como prefere ser atendido" />
            <View style={{ gap: spacing.sm }}>
              {medicalQuickActions.map((action) => (
                <ActionCard
                  key={action.title}
                  eyebrow={action.eyebrow}
                  title={action.title}
                  description={action.description}
                  href={action.href as never}
                  tone={action.tone}
                  badge={'badge' in action ? action.badge : undefined}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Últimos sinais" title="O que merece ser visto pelo médico" summary="Sintoma, pedido farmacêutico e relatório ficam em uma mesma conversa clínica." />
            <View style={{ gap: spacing.sm }}>
              {dashboard.notifications.slice(0, 4).map((notification) => (
                <TimelineRow
                  key={notification.id}
                  title={notification.title}
                  subtitle={notification.body}
                  meta={notification.priority}
                  tone={notification.level === 'critical' ? 'warning' : notification.level === 'success' ? 'success' : 'default'}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="muted">
            <SectionTitle eyebrow="Orientação pós-consulta" title="O app não termina quando o médico sai da tela" />
            <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
              Resumo da orientação, prescrição, próxima ação e necessidade de retorno ficam claros. Você não precisa lembrar sozinho de tudo o que foi dito.
            </Text>
          </PremiumCard>
        </>
      ) : null}
    </AppScreen>
  );
}
