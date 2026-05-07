import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { createShareBundle } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { ClinicalShareBundleResponse } from '@mejoy/api-contracts/mobile';

export default function ShareBundleRoute() {
  const session = useSession();
  const [note, setNote] = React.useState('');
  const [expiresInHours, setExpiresInHours] = React.useState('72');
  const [result, setResult] = React.useState<ClinicalShareBundleResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleShareBundle() {
    setError(null);
    try {
      const response = await createShareBundle(session, {
        note,
        expiresInHours: Number(expiresInHours),
        includeSleep: true,
        includeSymptoms: true,
      });
      setResult(response);
      await Haptics.selectionAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar pacote');
    }
  }

  return (
    <ScreenShell summary="Pacote clínico seguro e expirável para médico externo, reaproveitando relatório, jornada, peso e sono do paciente.">
      <SectionCard eyebrow="Bundle seguro" title="Gerar link compartilhável">
        <TextField label="Nota para o médico" value={note} onChangeText={setNote} multiline placeholder="Contexto clínico que deve acompanhar o bundle." />
        <TextField label="Expira em horas" value={expiresInHours} onChangeText={setExpiresInHours} keyboardType="numeric" />
        <PrimaryButton label="Gerar pacote" onPress={() => void handleShareBundle()} disabled={!expiresInHours.trim()} />
      </SectionCard>

      {error ? (
        <View style={{ borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFF1F1', padding: spacing.lg }}>
          <Text selectable style={{ color: colors.danger }}>{error}</Text>
        </View>
      ) : null}

      {result ? (
        <SectionCard eyebrow="Bundle criado" title="Pronto para compartilhar">
          <Text selectable style={{ color: colors.text }}>ID: {result.id}</Text>
          <Text selectable style={{ color: colors.text }}>Expira em: {result.expiresAt}</Text>
          <Text selectable style={{ color: colors.textMuted, lineHeight: 22 }}>
            {result.bundle.summary}
          </Text>
          <Text selectable style={{ color: colors.brand, lineHeight: 22 }}>
            {result.shareUrl}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
