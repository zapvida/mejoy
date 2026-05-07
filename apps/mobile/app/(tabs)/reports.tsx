import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { getDashboard } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { PatientDashboard } from '@mejoy/api-contracts/mobile';

export default function ReportsRoute() {
  const session = useSession();
  const [dashboard, setDashboard] = React.useState<PatientDashboard | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getDashboard(session).then(setDashboard).catch((err) => {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
    });
  }, [session.apiBaseUrl, session.email]);

  return (
    <ScreenShell summary="Centro de relatórios e explicação assistiva. Nesta fundação, os relatórios vêm do dashboard consolidado já existente no BFF.">
      <SectionCard eyebrow="Relatórios MeJoy" title="Últimos relatórios">
        {error ? <Text selectable style={{ color: colors.danger }}>{error}</Text> : null}
        {dashboard?.reports.length ? (
          dashboard.reports.map((report) => (
            <View
              key={report.id}
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
                {report.triageSlug} · {report.status}
              </Text>
              <Text selectable style={{ color: colors.textMuted, lineHeight: 20 }}>
                {report.summary || 'Resumo clínico indisponível neste momento.'}
              </Text>
            </View>
          ))
        ) : (
          <Text selectable style={{ color: colors.textMuted }}>
            Assim que houver relatórios ativos, eles aparecerão aqui com explicação simplificada e CTA de consulta.
          </Text>
        )}
      </SectionCard>

      <SectionCard eyebrow="Compartilhamento seguro" title="Próximos passos com o médico">
        <Link href="/share-bundle" style={{ color: colors.brand, fontSize: 16, fontWeight: '700' }}>
          Gerar pacote clínico seguro
        </Link>
        <Link href="/consult-request" style={{ color: colors.brand, fontSize: 16, fontWeight: '700' }}>
          Solicitar consulta com concierge
        </Link>
      </SectionCard>
    </ScreenShell>
  );
}
