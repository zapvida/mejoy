import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ActionTile } from '@/components/action-tile';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { InsightCard } from '@/components/insight-card';
import { MetricPill } from '@/components/metric-pill';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { TimelineRow } from '@/components/timeline-row';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { createDoseLog, createSideEffectLog, createWeightLog, getJourney, syncWearables } from '@/lib/api';
import { formatAdherence, formatDateLabel, formatDateTimeLabel, formatTrend } from '@/lib/formatters';

export default function JourneyRoute() {
  const session = useSession();
  const [journey, setJourney] = React.useState<Awaited<ReturnType<typeof getJourney>> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [weightKg, setWeightKg] = React.useState('');
  const [circumferenceCm, setCircumferenceCm] = React.useState('');
  const [note, setNote] = React.useState('');
  const [doseMg, setDoseMg] = React.useState('');
  const [phase, setPhase] = React.useState('Titulação');
  const [symptom, setSymptom] = React.useState('Náusea');
  const [severity, setSeverity] = React.useState<'low' | 'medium' | 'high'>('low');
  const [symptomNote, setSymptomNote] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setJourney(await getJourney(session));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar jornada');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    void load();
  }, [session.apiBaseUrl, session.email]);

  async function submitWeight() {
    setError(null);
    try {
      const response = await createWeightLog(session, {
        weightKg: Number(weightKg),
        circumferenceCm: circumferenceCm ? Number(circumferenceCm) : undefined,
        note: note || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await trackMobileEvent(session, {
        event: 'weight_logged',
        screen: 'journey',
        status: 'ok',
        metadata: {
          weightKg: Number(weightKg),
        },
      });
      setMessage(`Peso salvo com IMC ${response.bmi ?? 'indisponível'} em ${formatDateTimeLabel(response.occurredAt)}.`);
      setWeightKg('');
      setCircumferenceCm('');
      setNote('');
      await load();
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
      setMessage(`Dose ${response.doseMg} mg registrada na fase ${response.phase}.`);
      setDoseMg('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dose');
    }
  }

  async function submitSideEffect() {
    setError(null);
    try {
      const response = await createSideEffectLog(session, {
        symptom,
        severity,
        note: symptomNote || undefined,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await trackMobileEvent(session, {
        event: 'side_effect_flagged',
        screen: 'journey',
        status: 'ok',
        metadata: {
          severity,
        },
      });
      setMessage(`Sintoma ${response.symptom.toLowerCase()} registrado com revisão ${response.status}.`);
      setSymptomNote('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar sintoma');
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
      await trackMobileEvent(session, {
        event: 'sleep_synced',
        screen: 'journey',
        status: 'ok',
        metadata: {
          provider: response.provider,
        },
      });
      setMessage(`Sono sincronizado com score ${response.sleepSnapshot?.score ?? 'N/A'}. ${response.coachingTip}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar sono');
    }
  }

  const latestWeight = journey?.weightLogs[0];
  const latestDose = journey?.doseLogs[0];
  const latestSideEffect = journey?.sideEffectLogs[0];

  return (
    <ScreenShell
      eyebrow="GLP-1"
      title="Jornada executiva"
      summary="Peso, dose, sintomas, refill e sono ficam no mesmo plano de operação para reduzir atrito e manter a consistência da semana."
      support="Puxe para atualizar depois de registrar novos eventos. O card de refill responde aos últimos sinais da jornada."
      refreshing={loading}
      onRefresh={() => void load()}
    >
      {loading && !journey ? (
        <SectionCard eyebrow="Sincronizando" title="Lendo sua jornada">
          <ActivityIndicator color={colors.brand} />
        </SectionCard>
      ) : null}

      <HeroCard
        eyebrow="GLP-1 + sono + sintomas"
        title="O que move sua semana está aqui"
        summary={
          journey?.refill
            ? journey.refill.nextStep
            : 'Sem refill ativo agora. Priorize rotina, registros curtos e identificação precoce de sinais de atrito.'
        }
        badge={
          journey?.refill ? (
            <ClinicalStatusBadge label={journey.refill.status} tone="attention" />
          ) : (
            <ClinicalStatusBadge label="Ritmo normal" tone="good" />
          )
        }
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <MetricPill label="Adesão" value={formatAdherence(journey?.adherenceScore)} caption="Score longitudinal do protocolo" tone="brand" />
          <MetricPill label="Tendência" value={formatTrend(latestWeight ? (journey?.insights.some((item) => item.source === 'weight' && item.tone === 'good') ? 'down' : 'stable') : 'unknown')} caption="Leitura resumida da direção atual" />
          <MetricPill label="Última dose" value={latestDose ? `${latestDose.doseMg} mg` : 'N/A'} caption={latestDose?.phase || 'Sem dose recente'} tone="accent" />
          <MetricPill label="Sono" value={journey?.latestSleep?.score != null ? `${journey.latestSleep.score}/100` : 'N/A'} caption={journey?.latestSleep ? `${journey.latestSleep.durationHours ?? 0}h` : 'Sem sync'} tone="warning" />
        </View>
      </HeroCard>

      {journey ? (
        <SectionCard eyebrow="Leitura assistiva" title="Insights de execução">
          {journey.insights.map((insight) => (
            <InsightCard
              key={insight.id}
              tone={insight.tone === 'good' ? 'celebration' : insight.tone === 'focus' ? 'clinical' : 'warning'}
              title={insight.title}
              body={insight.body}
            />
          ))}
          {journey.refill ? (
            <ActionTile
              eyebrow="Refill ativo"
              title={`${journey.refill.medication} · ${journey.refill.status}`}
              description={`${journey.refill.nextStep} ETA operacional ${journey.refill.etaHours}h.`}
              href="/refill-request"
              tone="accent"
              caption="Ver ou reforçar pedido"
            />
          ) : (
            <ActionTile
              eyebrow="Refill"
              title="Abrir pedido preventivo"
              description="Quando o reabastecimento entra cedo, a operação fica silenciosa e a rotina não quebra."
              href="/refill-request"
              caption="Solicitar refill"
            />
          )}
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Peso longitudinal" title="Registrar pesagem">
        <TextField label="Peso (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" />
        <TextField label="Circunferência abdominal (cm)" value={circumferenceCm} onChangeText={setCircumferenceCm} keyboardType="decimal-pad" />
        <TextField label="Nota clínica" value={note} onChangeText={setNote} multiline placeholder="Fome, adesão, sintomas, observações." />
        <PrimaryButton label="Salvar peso" onPress={() => void submitWeight()} disabled={!weightKg} />
      </SectionCard>

      <SectionCard eyebrow="Dose e titulação" title="Registrar aplicação GLP-1">
        <TextField label="Dose (mg)" value={doseMg} onChangeText={setDoseMg} keyboardType="decimal-pad" />
        <TextField label="Fase" value={phase} onChangeText={setPhase} placeholder="Titulação, manutenção, ajuste" />
        <PrimaryButton label="Salvar dose" onPress={() => void submitDose()} disabled={!doseMg || !phase.trim()} />
      </SectionCard>

      <SectionCard eyebrow="Sintomas + recovery" title="Registrar sinais e sincronizar sono" tone="muted">
        <TextField label="Sintoma principal" value={symptom} onChangeText={setSymptom} placeholder="Náusea, refluxo, constipação..." />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {(['low', 'medium', 'high'] as const).map((level) => (
            <PrimaryButton
              key={level}
              label={level === 'low' ? 'Leve' : level === 'medium' ? 'Moderado' : 'Alto'}
              onPress={() => setSeverity(level)}
              tone={severity === level ? 'accent' : 'ghost'}
            />
          ))}
        </View>
        <TextField label="Observação clínica" value={symptomNote} onChangeText={setSymptomNote} multiline placeholder="Duração, gatilhos, intensidade, correlação com dose." />
        <PrimaryButton label="Registrar sintoma" onPress={() => void submitSideEffect()} disabled={!symptom.trim()} tone="accent" />
        <PrimaryButton
          label="Sincronizar snapshot de sono"
          detail="HealthKit e Health Connect entram no binário final; o contrato e o coaching já estão ativos."
          onPress={() => void syncSleepDemo()}
          tone="ghost"
        />
      </SectionCard>

      {journey ? (
        <SectionCard eyebrow="Histórico recente" title="Últimos eventos lançados">
          {latestWeight ? (
            <TimelineRow
              title={`Peso ${latestWeight.weightKg} kg`}
              subtitle={latestWeight.note || 'Registro longitudinal salvo no motor GLP-1.'}
              meta={formatDateTimeLabel(latestWeight.occurredAt)}
              tone="success"
            />
          ) : null}
          {latestDose ? (
            <TimelineRow
              title={`Dose ${latestDose.doseMg} mg · ${latestDose.phase}`}
              subtitle={`Adesão ${latestDose.adherence}. ${latestDose.note || 'Sem observação adicional.'}`}
              meta={formatDateTimeLabel(latestDose.occurredAt)}
            />
          ) : null}
          {latestSideEffect ? (
            <TimelineRow
              title={`${latestSideEffect.symptom} · ${latestSideEffect.severity}`}
              subtitle={latestSideEffect.note || 'Sintoma lançado para monitoramento e revisão.'}
              meta={formatDateTimeLabel(latestSideEffect.occurredAt)}
              tone="warning"
            />
          ) : null}
          {journey.latestSleep ? (
            <TimelineRow
              title={`Sono ${journey.latestSleep.score ?? 'N/A'}/100`}
              subtitle={`${journey.latestSleep.durationHours ?? 0}h registradas em ${journey.latestSleep.provider}.`}
              meta={formatDateLabel(journey.latestSleep.recordedAt)}
              tone="success"
            />
          ) : null}
        </SectionCard>
      ) : null}

      {message ? (
        <SectionCard eyebrow="Atualização" title="Evento salvo" tone="muted">
          <Text selectable style={{ color: colors.success, fontSize: typography.body, lineHeight: 22 }}>
            {message}
          </Text>
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível concluir a ação">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
