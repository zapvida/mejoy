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

export default function SignInRoute() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = React.useState(session.email);
  const [apiBaseUrl, setApiBaseUrl] = React.useState(session.apiBaseUrl);

  return (
    <ScreenShell
      eyebrow="Acesso"
      title="MeJoy Native Premium"
      summary="O shell nativo já conversa com o BFF mobile/v1 para dashboard, GLP-1, meal AI, notificações, consulta, exames, rituais e bundle clínico."
      support="Use a base local do Next.js em desenvolvimento ou a produção oficial para validação clínica e operacional."
    >
      <HeroCard
        eyebrow="Paciente + aquisição"
        title="Seu concierge de saúde em formato nativo"
        summary="O app nasce com cara de produto premium e operação clínica de verdade: painel longitudinal, jornada GLP-1, sono, rituais, exames e handoff."
      />

      <NativeModalSheet
        eyebrow="Entrar"
        title="Abrir sessão MeJoy"
        summary="No piloto atual, a autenticação usa o email da conta e a base da API do BFF. O fluxo nativo por token evolui em cima desse mesmo contrato."
      >
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="paciente@mejoy.com.br"
        />
        <TextField
          label="Base da API"
          value={apiBaseUrl}
          onChangeText={setApiBaseUrl}
          keyboardType="url"
          placeholder="https://www.mejoy.com.br"
        />
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
        title="Produção e validação"
        description="Em local, use a URL do seu Next.js em execução. Em staging ou produção, use a base oficial e valide o mesmo contrato mobile."
        tone="brand"
      />
      <View style={{ gap: spacing.xs }}>
        <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption }}>
          Capacidades já conectadas nesta base:
        </Text>
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
          Dashboard, perfil, peso, dose, sintomas, meal AI, wearables, rituais, consulta, exames, share bundle e refill.
        </Text>
      </View>
    </ScreenShell>
  );
}
