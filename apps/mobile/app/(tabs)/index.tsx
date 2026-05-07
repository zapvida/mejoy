import { Link } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { getDashboard } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { PatientDashboard } from '@mejoy/api-contracts/mobile';

export default function DashboardRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<PatientDashboard | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setDashboard(await getDashboard(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell summary="Painel longitudinal do paciente com jornada clínica, métricas GLP-1, retenção e CTAs de produção já conectados ao BFF.">
      {loading ? (
        <SectionCard eyebrow="Sincronizando" title="Carregando jornada">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Atenção" title="Não foi possível carregar o painel">
          <Text selectable style={{ color: colors.danger, lineHeight: 22 }}>
            {error}
          </Text>
          <PrimaryButton label="Tentar novamente" onPress={() => void load()} />
        </SectionCard>
      ) : null}

      {dashboard ? (
        <>
          <SectionCard eyebrow={dashboard.journey.state} title={dashboard.journey.title}>
            <Text selectable style={{ color: colors.text, lineHeight: 22 }}>
              {dashboard.journey.summary}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <Metric label="IMC" value={dashboard.metrics.bmi ? dashboard.metrics.bmi.toFixed(1) : 'N/A'} />
              <Metric label="Peso" value={dashboard.metrics.currentWeightKg ? `${dashboard.metrics.currentWeightKg} kg` : 'N/A'} />
              <Metric label="Adesão" value={dashboard.glp1.adherenceScore != null ? `${dashboard.glp1.adherenceScore}%` : 'N/A'} />
              <Metric label="Sono" value={dashboard.sleep.consistencyScore != null ? `${dashboard.sleep.consistencyScore}` : 'N/A'} />
            </View>
            {dashboard.journey.primaryAction ? (
              <Text selectable style={{ color: colors.textMuted }}>
                CTA atual: {dashboard.journey.primaryAction.label}
              </Text>
            ) : null}
          </SectionCard>

          <SectionCard eyebrow="Próximas ações" title="Abrir loops de retenção">
            <Link href="/meal-analysis" asChild>
              <Pressable style={linkButtonStyle}>
                <Text selectable style={linkLabelStyle}>Meal AI e leitura de cardápio</Text>
              </Pressable>
            </Link>
            <Link href="/consult-request" asChild>
              <Pressable style={linkButtonStyle}>
                <Text selectable style={linkLabelStyle}>Solicitar consulta e concierge</Text>
              </Pressable>
            </Link>
            <Link href="/exam-upload" asChild>
              <Pressable style={linkButtonStyle}>
                <Text selectable style={linkLabelStyle}>Registrar exame ou documento</Text>
              </Pressable>
            </Link>
            <Link href="/share-bundle" asChild>
              <Pressable style={linkButtonStyle}>
                <Text selectable style={linkLabelStyle}>Gerar pacote clínico compartilhável</Text>
              </Pressable>
            </Link>
          </SectionCard>

          <SectionCard eyebrow="Notificações" title="Fila inteligente do paciente">
            {dashboard.notifications.length === 0 ? (
              <Text selectable style={{ color: colors.textMuted }}>
                Sem alertas relevantes agora. O motor mobile já está pronto para push segmentado.
              </Text>
            ) : (
              dashboard.notifications.slice(0, 4).map((notification) => (
                <View
                  key={notification.id}
                  style={{
                    borderRadius: 18,
                    borderCurve: 'continuous',
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: spacing.lg,
                    gap: spacing.sm,
                  }}
                >
                  <Text selectable style={{ color: colors.text, fontWeight: '700' }}>
                    {notification.title}
                  </Text>
                  <Text selectable style={{ color: colors.textMuted, lineHeight: 20 }}>
                    {notification.body}
                  </Text>
                </View>
              ))
            )}
          </SectionCard>

          <SectionCard eyebrow="Clínica + operação" title="Pedidos, relatórios e concierge">
            <Text selectable style={{ color: colors.text }}>Pedidos recentes: {dashboard.orders.length}</Text>
            <Text selectable style={{ color: colors.text }}>Relatórios recentes: {dashboard.reports.length}</Text>
            <Text selectable style={{ color: colors.text }}>
              Consulta atual: {dashboard.care.latestRequestStatus || 'sem solicitação ativa'}
            </Text>
            <Text selectable style={{ color: colors.text }}>
              Exames no hub: {dashboard.exams.totalDocuments}
            </Text>
          </SectionCard>
        </>
      ) : null}
    </ScreenShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        minWidth: '47%',
        borderRadius: 18,
        borderCurve: 'continuous',
        backgroundColor: colors.surfaceStrong,
        padding: spacing.md,
        gap: 4,
      }}
    >
      <Text selectable style={{ color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', fontWeight: '700' }}>
        {label}
      </Text>
      <Text selectable style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
        {value}
      </Text>
    </View>
  );
}

const linkButtonStyle = {
  borderRadius: 18,
  borderCurve: 'continuous' as const,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.lg,
  backgroundColor: '#FFFFFF',
};

const linkLabelStyle = {
  color: colors.text,
  fontSize: 16,
  fontWeight: '600' as const,
};
