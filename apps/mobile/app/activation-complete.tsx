import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { HeroCard } from '@/components/hero-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';

export default function ActivationCompleteRoute() {
  const params = useLocalSearchParams<{
    paymentId?: string;
    status?: string;
    reportId?: string;
    source?: string;
  }>();
  const router = useRouter();
  const session = useSession();

  React.useEffect(() => {
    void trackMobileEvent(
      { apiBaseUrl: session.apiBaseUrl, email: session.email },
      {
        event: 'app_activation_completed',
        screen: 'activation-complete',
        status: params.status === 'confirmed' ? 'ok' : 'info',
        metadata: {
          paymentId: params.paymentId || null,
          source: params.source || 'checkout',
        },
      }
    );
  }, [params.paymentId, params.source, params.status, session.apiBaseUrl, session.email]);

  const title =
    params.status === 'confirmed'
      ? 'Pagamento confirmado'
      : params.status === 'pending'
        ? 'Pagamento em validação'
        : 'Ativação iniciada';

  const summary =
    params.status === 'confirmed'
      ? 'Seu app já pode assumir a continuidade da jornada com dashboard, rituais, exames e concierge.'
      : params.status === 'pending'
        ? 'O pagamento ainda está sendo conciliado. Você pode entrar no app agora e acompanhar a jornada enquanto a ativação conclui.'
        : 'O retorno do checkout chegou ao app. O próximo passo agora é entrar na área do paciente.';

  return (
    <ScreenShell
      eyebrow="Ativação"
      title="Retorno do checkout"
      summary="Quando o fluxo web termina, o app recebe a continuidade e mantem o paciente dentro da experiencia nativa."
    >
      <HeroCard eyebrow="Launch continuity" title={title} summary={summary}>
        <PrimaryButton
          label={session.email ? 'Abrir meu painel' : 'Entrar com minha conta'}
          detail={session.email ? 'Continuar a jornada no app' : 'Ativar acesso para seguir'}
          onPress={() => router.replace(session.email ? '/(tabs)' : '/sign-in')}
        />
      </HeroCard>

      <SectionCard eyebrow="Status" title="Sinal recebido do checkout" support="Esses dados ajudam a validar o retorno do checkout e a continuidade da ativacao.">
        <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
          Payment ID: {params.paymentId || 'nao informado'}
        </Text>
        <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
          Fonte: {params.source || 'checkout'}
        </Text>
      </SectionCard>

      <SectionCard eyebrow="Proximo passo" title="Continuar no app" support="O retorno foi reconhecido. Agora a meta e reduzir qualquer friccao para entrar na area do paciente." tone="muted">
        {session.email ? (
          <PrimaryButton label="Abrir meu painel" onPress={() => router.replace('/(tabs)')} />
        ) : (
          <PrimaryButton label="Entrar com minha conta" onPress={() => router.replace('/sign-in')} />
        )}
      </SectionCard>
    </ScreenShell>
  );
}
