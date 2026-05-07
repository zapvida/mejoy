import * as Haptics from 'expo-haptics';
import * as ExpoLinking from 'expo-linking';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { RefillRequest } from '@mejoy/api-contracts/mobile';
import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { createRefillRequest } from '@/lib/api';

export default function RefillRequestRoute() {
  const session = useSession();
  const [medication, setMedication] = React.useState('tirzepatida');
  const [doseMg, setDoseMg] = React.useState('5');
  const [urgency, setUrgency] = React.useState<'routine' | 'soon' | 'urgent'>('routine');
  const [note, setNote] = React.useState('');
  const [result, setResult] = React.useState<RefillRequest | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const response = await createRefillRequest(session, {
        medication,
        doseMg: doseMg ? Number(doseMg) : undefined,
        urgency,
        note: note || undefined,
      });
      setResult(response);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao abrir refill');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Refill"
      title="Pedido de reabastecimento"
      summary="O refill entra como fluxo operacional premium: paciente abre cedo, a equipe vê urgência, ETA e próximo passo sem perder contexto clínico."
    >
      <NativeModalSheet
        eyebrow="Operação farmacológica"
        title="Abrir pedido preventivo"
        summary="Informe a medicação, a dose atual e a urgência. O concierge usa esse contexto para reduzir ruído e evitar quebra de continuidade."
      >
        <TextField label="Medicação" value={medication} onChangeText={setMedication} />
        <TextField label="Dose (mg)" value={doseMg} onChangeText={setDoseMg} keyboardType="decimal-pad" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(['routine', 'soon', 'urgent'] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setUrgency(option)}
              style={{
                borderRadius: 999,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: urgency === option ? colors.brand : colors.border,
                backgroundColor: urgency === option ? colors.brandSoft : colors.card,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              }}
            >
              <Text selectable style={{ color: colors.textStrong, fontWeight: urgency === option ? '700' : '600' }}>
                {option === 'routine' ? 'Rotina' : option === 'soon' ? 'Em breve' : 'Urgente'}
              </Text>
            </Pressable>
          ))}
        </View>
        <TextField
          label="Observações"
          value={note}
          onChangeText={setNote}
          multiline
          placeholder="Estoques, próxima dose, logística, sintomas ou contexto relevante."
        />
        <PrimaryButton
          label={loading ? 'Abrindo...' : 'Abrir refill'}
          onPress={() => void handleSubmit()}
          disabled={loading || !medication.trim()}
        />
      </NativeModalSheet>

      {error ? (
        <SectionCard eyebrow="Falha" title="Pedido não aberto">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      {result ? (
        <SectionCard eyebrow={result.status} title="Refill criado" tone="muted">
          <ClinicalStatusBadge label={`ETA ${result.etaHours}h`} tone={result.status === 'scheduled' ? 'good' : 'attention'} />
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
            {result.medication} {result.doseMg ? `· ${result.doseMg} mg` : ''}
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
            {result.nextStep}
          </Text>
          {result.redirectUrl ? (
            <PrimaryButton
              label="Abrir redirect operacional"
              onPress={() => {
                void trackMobileEvent(session, {
                  event: 'handoff_opened',
                  screen: 'refill-request',
                  status: 'ok',
                  metadata: {
                    refillId: result.id,
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
