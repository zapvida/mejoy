import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { createDoseLog, createWeightLog, syncWearables } from '@/lib/api';
import { useSession } from '@/context/session-context';

export default function JourneyRoute() {
  const session = useSession();
  const [weightKg, setWeightKg] = React.useState('');
  const [circumferenceCm, setCircumferenceCm] = React.useState('');
  const [note, setNote] = React.useState('');
  const [doseMg, setDoseMg] = React.useState('');
  const [phase, setPhase] = React.useState('titulação');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function submitWeight() {
    setError(null);
    try {
      const response = await createWeightLog(session, {
        weightKg: Number(weightKg),
        circumferenceCm: circumferenceCm ? Number(circumferenceCm) : undefined,
        note: note || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage(`Peso salvo com IMC ${response.bmi ?? 'indisponível'} e ocorrido em ${response.occurredAt}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar peso');
    }
  }

  async function submitDose() {
    setError(null);
    try {
      const response = await createDoseLog(session, {
        medication: 'tirzepatida',
        doseMg: Number(doseMg),
        phase,
        adherence: 'taken',
        sideEffects: [],
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setMessage(`Dose ${response.doseMg} mg registrada para a fase ${response.phase}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dose');
    }
  }

  async function syncSleepDemo() {
    setError(null);
    try {
      const response = await syncWearables(session, {
        provider: 'manual',
        sleep: {
          recordedAt: new Date().toISOString(),
          durationHours: 7.2,
          latencyMinutes: 18,
          awakenings: 1,
        },
      });
      setMessage(`Sono sincronizado com score ${response.sleepSnapshot?.score ?? 'N/A'}. ${response.coachingTip}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar sono');
    }
  }

  return (
    <ScreenShell summary="Núcleo GLP-1 com registro de peso, dose, adesão e sincronização de sono já conectado aos contratos e analytics planejados.">
      <SectionCard eyebrow="Peso longitudinal" title="Registrar pesagem">
        <TextField label="Peso (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" />
        <TextField label="Circunferência abdominal (cm)" value={circumferenceCm} onChangeText={setCircumferenceCm} keyboardType="decimal-pad" />
        <TextField label="Nota clínica" value={note} onChangeText={setNote} multiline placeholder="Fome, adesão, sintomas, observações." />
        <PrimaryButton label="Salvar peso" onPress={() => void submitWeight()} disabled={!weightKg} />
      </SectionCard>

      <SectionCard eyebrow="Dose e titulação" title="Registrar aplicação GLP-1">
        <TextField label="Dose (mg)" value={doseMg} onChangeText={setDoseMg} keyboardType="decimal-pad" />
        <TextField label="Fase" value={phase} onChangeText={setPhase} placeholder="titulação, manutenção, ajuste" />
        <PrimaryButton label="Salvar dose" onPress={() => void submitDose()} disabled={!doseMg || !phase.trim()} />
      </SectionCard>

      <SectionCard eyebrow="Wearables + coaching" title="Sincronizar snapshot de sono">
        <Text selectable style={{ color: colors.textMuted, lineHeight: 22 }}>
          A integração real com HealthKit e Health Connect entra no binário nativo. Esta entrega já deixa o contrato, a persistência e o coaching prontos.
        </Text>
        <PrimaryButton label="Enviar snapshot manual" onPress={() => void syncSleepDemo()} tone="accent" />
      </SectionCard>

      {message ? (
        <View style={{ borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#EAF7F0', padding: spacing.lg }}>
          <Text selectable style={{ color: colors.success, lineHeight: 22 }}>
            {message}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View style={{ borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFF1F1', padding: spacing.lg }}>
          <Text selectable style={{ color: colors.danger, lineHeight: 22 }}>
            {error}
          </Text>
        </View>
      ) : null}
    </ScreenShell>
  );
}
