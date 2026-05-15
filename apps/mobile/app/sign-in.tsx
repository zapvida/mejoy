import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { HeroCard } from '@/components/hero-card';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';

const canEditApiBaseUrl = process.env.EXPO_PUBLIC_ALLOW_API_BASE_EDIT === '1' || __DEV__;

export default function SignInRoute() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = React.useState(session.email);
  const [apiBaseUrl, setApiBaseUrl] = React.useState(session.apiBaseUrl);

  return (
    <ScreenShell
      eyebrow="Acesso"
      title="MeJoy Premium"
      summary="Entre com a conta MeJoy para abrir dashboard, GLP-1, nutrição, notificações, consulta, exames, rituais e pacote clínico."
      support="A versão de loja usa a API oficial da MeJoy. Configuração manual de ambiente fica restrita a desenvolvimento."
    >
      <HeroCard
        eyebrow="Paciente + aquisição"
        title="Seu concierge de saúde em formato nativo"
        summary="O app nasce com cara de produto premium e operação clínica de verdade: painel longitudinal, jornada GLP-1, sono, rituais, exames e handoff."
      />

      <NativeModalSheet
        eyebrow="Entrar"
        title="Abrir sessão MeJoy"
        summary="Informe o email cadastrado na sua compra ou no atendimento MeJoy."
      >
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="paciente@mejoy.com.br"
        />
        {canEditApiBaseUrl ? (
          <TextField
            label="Base da API"
            value={apiBaseUrl}
            onChangeText={setApiBaseUrl}
            keyboardType="url"
            placeholder="https://www.mejoy.com.br"
          />
        ) : null}
        <PrimaryButton
          label="Abrir app nativo"
          onPress={async () => {
            await Haptics.selectionAsync();
            session.setSession({ email, apiBaseUrl });
            router.replace('/(tabs)');
          }}
          disabled={!email.trim() || !apiBaseUrl.trim()}
        />
      </NativeModalSheet>

      <ActionTile
        eyebrow="Ambientes"
        title="Conta e privacidade"
        description="Se ainda não tiver conta, comece pela avaliação gratuita. O app não mostra dados clínicos sem uma sessão MeJoy."
        tone="brand"
      />
      <View style={{ gap: spacing.xs }}>
        <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption }}>
          Capacidades já conectadas nesta base:
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          Dashboard, perfil, peso, dose, sintomas, nutrição, rituais, consulta, exames, pacote clínico e refill.
        </Text>
      </View>
    </ScreenShell>
  );
}
