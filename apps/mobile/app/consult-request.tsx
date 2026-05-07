import * as Haptics from 'expo-haptics';
import * as ExpoLinking from 'expo-linking';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CareRequestResponse } from '@mejoy/api-contracts/mobile';
import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { requestConsult } from '@/lib/api';
import { formatPeriodLabel } from '@/lib/formatters';

export default function ConsultRequestRoute() {
  const session = useSession();
  const [reason, setReason] = React.useState('Ajuste de conduta GLP-1');
  const [preferredPeriod, setPreferredPeriod] = React.useState<'morning' | 'afternoon' | 'evening' | 'first-available'>('first-available');
  const [note, setNote] = React.useState('');
  const [result, setResult] = React.useState<CareRequestResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const response = await requestConsult(session, {
        reason,
        preferredPeriod,
        note,
      });
      setResult(response);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await trackMobileEvent(session, {
        event: 'consult_requested',
        screen: 'consult-request',
        status: 'ok',
        metadata: {
          preferredPeriod,
          hasRedirect: Boolean(response.redirectUrl),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar consulta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Consulta"
      title="Concierge clínico"
      summary="A consulta no v1 segue por solicitação inteligente e handoff, não por agenda médica aberta. O paciente vê SLA, status e próximo passo com clareza."
    >
      <NativeModalSheet
        eyebrow="Abertura do pedido"
        title="Solicitar suporte assistido"
        summary="Descreva o motivo, escolha a melhor janela e envie observações úteis. Se houver contexto de triagem ou parceiro clínico, o redirect já nasce pronto."
      >
        <TextField label="Motivo" value={reason} onChangeText={setReason} />
        <TextField
          label="Observações"
          value={note}
          onChangeText={setNote}
          multiline
          placeholder="Sintomas, dúvidas, ajuste de dose, eventos adversos."
        />
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
                backgroundColor: preferredPeriod === slot ? colors.brandSoft : colors.card,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              }}
            >
              <Text selectable style={{ color: colors.textStrong, fontWeight: preferredPeriod === slot ? '700' : '600' }}>
                {formatPeriodLabel(slot)}
              </Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label={loading ? 'Solicitando...' : 'Solicitar consulta'}
          onPress={() => void handleSubmit()}
          disabled={loading || !reason.trim()}
        />
      </NativeModalSheet>

      {error ? (
        <SectionCard eyebrow="Falha" title="Pedido não criado">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      {result ? (
        <SectionCard eyebrow={result.status} title="Solicitação criada" tone="muted">
          <ClinicalStatusBadge label={`SLA ${result.conciergeSlaHours}h`} tone="attention" />
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
            ID {result.id}
          </Text>
          <Text selectable style={{ color: colors.textMuted, fontSize: typography.body, lineHeight: 22 }}>
            O concierge já recebeu o pedido. A evolução agora depende do contexto assistencial e do parceiro clínico aplicável.
          </Text>
          {result.redirectUrl ? (
            <PrimaryButton
              label="Abrir redirect clínico"
              onPress={() => {
                void trackMobileEvent(session, {
                  event: 'handoff_opened',
                  screen: 'consult-request',
                  status: 'ok',
                  metadata: {
                    requestId: result.id,
                  },
                });
                void ExpoLinking.openURL(result.redirectUrl!);
              }}
              tone="accent"
            />
          ) : null}
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
