import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';

export default function SignInRoute() {
  const router = useRouter();
  const session = useSession();
  const [email, setEmail] = React.useState(session.email);
  const [apiBaseUrl, setApiBaseUrl] = React.useState(session.apiBaseUrl);

  return (
    <ScreenShell summary="A primeira entrega do app usa o BFF MeJoy atual e já conversa com as rotas mobile/v1 para dashboard, GLP-1, notificações, consulta e pacote clínico.">
      <SectionCard eyebrow="Piloto nativo" title="Entrar com sua conta MeJoy">
        <Text selectable style={{ color: colors.textMuted, lineHeight: 22 }}>
          No piloto, o app usa o email da sua conta MeJoy para autenticação assistida no BFF enquanto a camada mobile avança para token nativo completo.
        </Text>
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
      </SectionCard>
      <View style={{ gap: spacing.sm }}>
        <Text selectable style={{ color: colors.textMuted, fontSize: 13 }}>
          Recomendações de ambiente:
        </Text>
        <Text selectable style={{ color: colors.text, lineHeight: 21 }}>
          1. Em local: use a URL do seu Next.js em execução.
        </Text>
        <Text selectable style={{ color: colors.text, lineHeight: 21 }}>
          2. Em validação: use `https://www.mejoy.com.br`.
        </Text>
        <Text selectable style={{ color: colors.text, lineHeight: 21 }}>
          3. O app já suporta dashboard, perfil, peso, dose, meal AI, wearables, consulta, exames e share bundle.
        </Text>
      </View>
    </ScreenShell>
  );
}
