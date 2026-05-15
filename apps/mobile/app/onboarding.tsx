import * as Haptics from 'expo-haptics';
import * as ExpoLinking from 'expo-linking';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { HeroCard } from '@/components/hero-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { buildAppReturnUrl, buildEmagrecimentoCheckoutUrl, buildEmagrecimentoEntryUrl } from '@/lib/commerce';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { getEntitlements } from '@/lib/api';

export default function OnboardingRoute() {
  const router = useRouter();
  const session = useSession();
  const appReturnUrl = React.useMemo(() => buildAppReturnUrl('/activation-complete'), []);
  const [entitlements, setEntitlements] = React.useState<Awaited<ReturnType<typeof getEntitlements>> | null>(null);
  const [loadingEntitlements, setLoadingEntitlements] = React.useState(true);
  const [entitlementError, setEntitlementError] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    let active = true;

    async function loadEntitlements() {
      setLoadingEntitlements(true);
      setEntitlementError(null);
      try {
        const response = await getEntitlements(session);
        if (!active) return;
        setEntitlements(response);
        await trackMobileEvent(session, {
          event: 'entitlement_seen',
          screen: 'onboarding',
          status: 'ok',
          metadata: {
            activationState: response.activationState,
            primaryProtocol: response.protocolContext.primaryProtocolSlug,
            recommendedModules: response.recommendedModules.length,
          },
        });
      } catch (error) {
        if (!active) return;
        setEntitlementError(error instanceof Error ? error.message : 'Nao foi possivel carregar o acesso premium.');
      } finally {
        if (active) {
          setLoadingEntitlements(false);
        }
      }
    }

    void loadEntitlements();

    return () => {
      active = false;
    };
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
      summary="O app nativo cobre aquisicao, ativacao e continuidade: toda compra no web libera o App MeJoy Premium com uma home personalizada pelo seu produto, protocolo e sinais."
      support="Quando a compra for concluida, o fluxo pode voltar diretamente para o app pelo deep link de ativacao."
    >
      <HeroCard
        eyebrow={entitlements?.protocolContext.primaryProtocolTitle || 'Obesidade + GLP-1 + concierge'}
        title={
          entitlements?.activationState === 'visitor'
            ? 'Uma jornada premium, nao um app generico'
            : 'Seu acesso premium ja nasce junto com a compra'
        }
        summary={
          entitlements?.productAppValue.summary ||
          'Triagem, plano recomendado, checkout hibrido, painel longitudinal, rituais, exames, refill e handoff clinico convivem na mesma base.'
        }
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {entitlements?.activationState === 'activated_patient' || entitlements?.activationState === 'care_active' ? (
            <PrimaryButton
              label="Abrir meu painel"
              onPress={() => router.replace('/(tabs)')}
              detail="Continuar na area do paciente"
            />
          ) : (
            <>
              <PrimaryButton
                label="Fazer avaliação gratuita"
                onPress={() => void openExternal(buildEmagrecimentoEntryUrl(session.apiBaseUrl), 'triage')}
                detail="Comecar pela leitura clinica"
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
                detail="Entrar direto no fechamento"
              />
            </>
          )}
        </View>
      </HeroCard>

      <SectionCard
        eyebrow="Acesso MeJoy Premium"
        title="Todo comprador do web ganha o app completo"
        support="A ativacao inicial decide prioridade de modulos e proximos passos, mas o app premium ja faz parte do sistema vendido no web."
      >
        {loadingEntitlements ? (
          <ActivityIndicator color={colors.brand} />
        ) : entitlementError ? (
          <>
            <ActionTile
              eyebrow="Conta MeJoy"
              title="Continue pela avaliacao ou entre com sua conta"
              description="Nao encontrei uma sessao ativa neste aparelho. A experiencia continua pela avaliacao gratuita ou pelo email vinculado a compra."
              tone="brand"
              caption="Sem dados clinicos expostos"
            />
            <ActionTile
              eyebrow="Avaliacao"
              title="Comecar pelo fluxo oficial"
              description="A avaliacao abre no ambiente MeJoy e retorna para o app quando a ativacao estiver concluida."
              onPress={() => void openExternal(buildEmagrecimentoEntryUrl(session.apiBaseUrl), 'triage')}
              caption="Abrir avaliacao"
            />
          </>
        ) : entitlements ? (
          <>
            <ActionTile
              eyebrow={entitlements.activationState.replace(/_/g, ' ')}
              title={entitlements.productAppValue.headline}
              description={`Trilha principal: ${entitlements.protocolContext.primaryProtocolTitle}. O app abre com ${entitlements.recommendedModules.length} modulos priorizados para o seu momento.`}
              tone="brand"
              caption="Acesso incluido"
            />
            {entitlements.recommendedActions.map((action) => (
              <ActionTile
                key={action.href}
                eyebrow="Proximo passo"
                title={action.label}
                description={action.reason}
                href={action.href as never}
                caption="Abrir"
              />
            ))}
          </>
        ) : null}
      </SectionCard>

      {entitlements ? (
        <SectionCard
          eyebrow="O que voce desbloqueia"
          title="As features premium ja entram no valor do produto"
          support="O web vende produto, protocolo e continuidade nativa. Esse bloco precisa deixar o valor do app explicito desde a entrada."
          tone="muted"
        >
          {entitlements.productAppValue.featureMatrix.slice(0, 6).map((feature) => (
            <ActionTile
              key={feature.id}
              eyebrow={feature.featured ? 'Feature premium' : 'Continuacao assistida'}
              title={feature.title}
              description={feature.appValue}
              caption="Incluido no app"
              tone={feature.featured ? 'accent' : 'default'}
            />
          ))}
        </SectionCard>
      ) : null}

      <SectionCard
        eyebrow="Planos"
        title="Como o app organiza cada duração do cuidado"
        support="A narrativa comercial precisa ser simples: quanto maior a continuidade, maior a camada de prevenção, suporte e inteligência prática no app."
      >
        <ActionTile
          eyebrow="1 mês"
          title="Entrada rápida na rotina"
          description="Dashboard, jornada GLP-1 e Meal AI para organizar execução com baixa fricção."
          tone="brand"
          caption="Base do sistema"
        />
        <ActionTile
          eyebrow="3 meses"
          title="Proteção de consistência"
          description="Sono, rituais e concierge entram para reduzir recaída e dar mais estabilidade clínica."
          tone="accent"
          caption="Mais continuidade"
        />
        <ActionTile
          eyebrow="6 meses"
          title="Cuidado integral preventivo"
          description="As 10 features, prevenção, hub de exames, referral e canal premium operado pela equipe."
          caption="Valor máximo"
        />
      </SectionCard>

      <SectionCard
        eyebrow="Entrada inteligente"
        title="Escolha o melhor comeco"
        support="O objetivo aqui e reduzir friccao: voce entra pela porta que melhor combina com o seu momento."
      >
        <ActionTile
          eyebrow="Aquisicao"
          title="Avaliacao inicial no fluxo web premium"
          description="Abra a landing e a triagem oficial com rastreamento mobile e retorno limpo ao app quando quiser continuar como paciente."
          onPress={() => void openExternal(buildEmagrecimentoEntryUrl(session.apiBaseUrl), 'triage')}
          tone="brand"
          caption="Abrir avaliacao"
        />
        <ActionTile
          eyebrow="Checkout"
          title="Programa tirzepatida · 3 meses"
          description="Entrar direto no checkout compartilhado com retorno ao app apos pagamento ou ativacao."
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
      </SectionCard>

      <SectionCard
        eyebrow="Retorno ao app"
        title="Como a ativacao funciona"
        support="O app precisa deixar muito claro o que acontece depois do checkout e quando a area do paciente abre."
        tone="muted"
      >
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          1. Voce entra pela avaliacao ou checkout hibrido.
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          2. A confirmacao ou o status do pagamento pode voltar para o app via `mejoy://activation-complete`.
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          3. Depois disso, a jornada do paciente continua no dashboard nativo.
        </Text>
        <ActionTile
          eyebrow="Acesso"
          title="Entrar manualmente"
          description="Se voce ja tem conta MeJoy, pule a aquisicao e va direto para a area do paciente."
          href="/sign-in"
          caption="Abrir acesso"
        />
      </SectionCard>
    </ScreenShell>
  );
}
