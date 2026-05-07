import * as Haptics from 'expo-haptics';
import * as ExpoLinking from 'expo-linking';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { HeroCard } from '@/components/hero-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { buildAppReturnUrl, buildEmagrecimentoCheckoutUrl, buildEmagrecimentoEntryUrl } from '@/lib/commerce';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';

export default function OnboardingRoute() {
  const session = useSession();
  const appReturnUrl = React.useMemo(() => buildAppReturnUrl('/activation-complete'), []);

  React.useEffect(() => {
    void trackMobileEvent(
      { apiBaseUrl: session.apiBaseUrl, email: session.email },
      {
        event: 'onboarding_started',
        screen: 'onboarding',
        status: 'info',
        metadata: {
          authenticated: Boolean(session.email),
        },
      }
    );
  }, [session.apiBaseUrl, session.email]);

  async function openExternal(url: string, target: 'triage' | 'checkout') {
    await Haptics.selectionAsync();
    await trackMobileEvent(
      { apiBaseUrl: session.apiBaseUrl, email: session.email },
      {
        event: 'onboarding_checkout_opened',
        screen: 'onboarding',
        status: 'ok',
        metadata: {
          target,
        },
      }
    );
    await ExpoLinking.openURL(url);
  }

  return (
    <ScreenShell
      eyebrow="Aquisição"
      title="Entrar na jornada MeJoy"
      summary="O app nativo agora cobre tanto aquisição quanto paciente: você pode começar pela avaliação, abrir o checkout híbrido e retornar ao app já pronto para ativação."
      support="Quando a compra for concluída, o fluxo pode voltar diretamente para o app pelo deep link de ativação."
    >
      <HeroCard
        eyebrow="Obesidade + GLP-1 + concierge"
        title="Uma jornada premium, não um app genérico"
        summary="Triagem, plano recomendado, checkout híbrido, painel longitudinal, rituais, exames, refill e handoff clínico já convivem na mesma base."
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <PrimaryButton
            label="Fazer avaliação gratuita"
            onPress={() => void openExternal(buildEmagrecimentoEntryUrl(session.apiBaseUrl), 'triage')}
          />
          <PrimaryButton
            label="Abrir checkout 3 meses"
            onPress={() =>
              void openExternal(
                buildEmagrecimentoCheckoutUrl(session.apiBaseUrl, {
                  planId: 'programa-3m',
                  trilha: 'tirzepatida',
                  appReturnUrl,
                }),
                'checkout'
              )
            }
            tone="accent"
          />
        </View>
      </HeroCard>

      <SectionCard eyebrow="Entrada inteligente" title="Escolha o melhor começo">
        <ActionTile
          eyebrow="Aquisição"
          title="Avaliação inicial no fluxo web premium"
          description="Abra a landing e a triagem oficial com rastreamento mobile e retorno limpo ao app quando quiser continuar como paciente."
          onPress={() => void openExternal(buildEmagrecimentoEntryUrl(session.apiBaseUrl), 'triage')}
          tone="brand"
          caption="Abrir avaliação"
        />
        <ActionTile
          eyebrow="Checkout híbrido"
          title="Programa tirzepatida · 3 meses"
          description="Entrar direto no checkout compartilhado com retorno preparado para o app após pagamento ou ativação."
          onPress={() =>
            void openExternal(
              buildEmagrecimentoCheckoutUrl(session.apiBaseUrl, {
                planId: 'programa-3m',
                trilha: 'tirzepatida',
                appReturnUrl,
              }),
              'checkout'
            )
          }
          tone="accent"
          caption="Abrir checkout"
        />
        <ActionTile
          eyebrow="Paciente atual"
          title="Já tenho conta MeJoy"
          description="Entrar direto no app do paciente para ver dashboard, jornada, exames, rituais e concierge."
          href="/sign-in"
          caption="Entrar como paciente"
        />
      </SectionCard>

      <SectionCard eyebrow="Retorno ao app" title="Como a ativação funciona" tone="muted">
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          1. Você entra pela avaliação ou checkout híbrido.
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          2. A confirmação ou o status do pagamento pode voltar para o app via `mejoy://activation-complete`.
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          3. Depois disso, a jornada do paciente continua no dashboard nativo.
        </Text>
        <ActionTile
          eyebrow="Acesso"
          title="Entrar manualmente"
          description="Se você já tem conta MeJoy, pule a aquisição e vá direto para a área do paciente."
          href="/sign-in"
          caption="Abrir acesso"
        />
      </SectionCard>
    </ScreenShell>
  );
}
