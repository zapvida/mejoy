import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { requestConsult } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { CareRequestResponse } from '@mejoy/api-contracts/mobile';

export default function ConsultRequestRoute() {
  const session = useSession();
  const [reason, setReason] = React.useState('Ajuste de conduta GLP-1');
  const [preferredPeriod, setPreferredPeriod] = React.useState<'morning' | 'afternoon' | 'evening' | 'first-available'>('first-available');
  const [note, setNote] = React.useState('');
  const [result, setResult] = React.useState<CareRequestResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    try {
      const response = await requestConsult(session, {
        reason,
        preferredPeriod,
        note,
      });
      setResult(response);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar consulta');
    }
  }

  return (
    <ScreenShell summary="Solicitação de consulta com concierge, SLA operacional e ponte para handoff clínico parceiro quando houver contexto de triagem.">
      <SectionCard eyebrow="Concierge clínico" title="Abrir solicitação">
        <TextField label="Motivo" value={reason} onChangeText={setReason} />
        <TextField label="Observações" value={note} onChangeText={setNote} multiline placeholder="Sintomas, dúvidas, ajuste de dose, eventos adversos." />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(['morning', 'afternoon', 'evening', 'first-available'] as const).map((slot) => (
            <Pressable
              key={slot}
              onPress={() => setPreferredPeriod(slot)}
              style={{
                borderRadius: 999,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: preferredPeriod === slot ? colors.brand : colors.border,
                backgroundColor: preferredPeriod === slot ? '#E8F3ED' : '#FFFFFF',
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              }}
            >
              <Text selectable style={{ color: colors.text }}>
                {slot}
              </Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton label="Solicitar consulta" onPress={() => void handleSubmit()} disabled={!reason.trim()} />
      </SectionCard>

      {error ? (
        <View style={{ borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFF1F1', padding: spacing.lg }}>
          <Text selectable style={{ color: colors.danger }}>{error}</Text>
        </View>
      ) : null}

      {result ? (
        <SectionCard eyebrow={result.status} title="Solicitação criada">
          <Text selectable style={{ color: colors.text }}>ID: {result.id}</Text>
          <Text selectable style={{ color: colors.text }}>
            SLA do concierge: {result.conciergeSlaHours}h
          </Text>
          {result.redirectUrl ? (
            <Pressable onPress={() => void Linking.openURL(result.redirectUrl!)}>
              <Text selectable style={{ color: colors.brand, fontWeight: '700' }}>
                Abrir redirect clínico parceiro
              </Text>
            </Pressable>
          ) : (
            <Text selectable style={{ color: colors.textMuted }}>
              O pedido foi aberto sem triagem vinculada; o concierge continua responsável pelo próximo passo.
            </Text>
          )}
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
