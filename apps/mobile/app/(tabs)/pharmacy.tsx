import React from 'react';
import { View } from 'react-native';

import { spacing } from '@mejoy/design-tokens';
import { ActionCard } from '@/components/action-card';
import { AppScreen } from '@/components/app-screen';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { PharmacyOrderCard } from '@/components/pharmacy-order-card';
import { PremiumCard } from '@/components/premium-card';
import { PrescriptionCard } from '@/components/prescription-card';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';
import { pharmacyQuickActions } from '@/content/mejoy-premium';
import { useSession } from '@/context/session-context';
import { getDashboard } from '@/lib/api';

export default function PharmacyRoute() {
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
      setError(err instanceof Error ? err.message : 'Erro ao abrir a farmácia');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  return (
    <AppScreen
      eyebrow="Farmácia"
      title="Prescrição, pedido e recompra no mesmo lugar"
      summary="A área de farmácia precisa transmitir confiança: o paciente sabe o que foi prescrito, o que está em produção e quando deve agir."
      support="ZapFarm está modelado com clareza operacional. Onde a integração externa ainda não for real, isso vai aparecer no audit-summary."
      refreshing={loading}
      onRefresh={() => void load()}
      heroAside={<StatusBadge label="ZapFarm modelado" tone="dark" />}
    >
      {loading && !dashboard ? <LoadingState title="Montando sua farmácia" body="Estou organizando prescrição, pedidos e recompra." /> : null}
      {error && !dashboard ? <ErrorState title="Não consegui abrir sua farmácia agora" body={error} /> : null}

      {dashboard ? (
        <>
          <PremiumCard tone="default">
            <SectionTitle eyebrow="Ações principais" title="Tudo o que foi prescrito está organizado aqui" />
            <View style={{ gap: spacing.sm }}>
              {pharmacyQuickActions.map((action) => (
                <ActionCard
                  key={action.title}
                  eyebrow={action.eyebrow}
                  title={action.title}
                  description={action.description}
                  href={action.href as never}
                  tone={action.tone}
                />
              ))}
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Prescrições ativas" title="Categorias claras para o paciente" />
            <View style={{ gap: spacing.sm }}>
              <PrescriptionCard label="GLP-1 semanal" clinician="endócrino" summary="Dose atual, janela de aplicação e orientação de segurança ficam visíveis." tone="brand" />
              <PrescriptionCard label="Manipulado metabólico" clinician="farmácia" summary="Fórmula individualizada com revisão humana antes da produção." tone="accent" />
              <PrescriptionCard label="Suplementos de apoio" clinician="nutrição" summary="Itens complementares organizados fora da medicação principal." tone="neutral" />
            </View>
          </PremiumCard>

          <PremiumCard tone="default">
            <SectionTitle eyebrow="Pedidos" title="Acompanhe status sem precisar perguntar" />
            <View style={{ gap: spacing.sm }}>
              {dashboard.orders.length ? (
                dashboard.orders.slice(0, 3).map((order) => (
                  <PharmacyOrderCard
                    key={order.id}
                    title={order.label}
                    status={order.status}
                    eta="A próxima recompra ficará sugerida antes de acabar o ciclo."
                    body="Produção, envio e entrega aparecem com menos ruído e mais previsibilidade."
                  />
                ))
              ) : (
                <ActionCard
                  eyebrow="Sem pedido ativo"
                  title="Abrir primeira compra do ciclo"
                  description="Quando houver prescrição pronta, o fluxo farmacêutico entra aqui sem quebrar o resto do app."
                  href="/prescriptions"
                  tone="brand"
                />
              )}
            </View>
          </PremiumCard>
        </>
      ) : null}
    </AppScreen>
  );
}
