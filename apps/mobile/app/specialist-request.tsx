import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { HeroCard } from '@/components/hero-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { requestSpecialistChannel } from '@/lib/api';

const SPECIALTIES = [
  { id: 'endocrino', label: 'Endócrino' },
  { id: 'nutrologia', label: 'Nutrologia' },
  { id: 'psicologia', label: 'Psicologia' },
  { id: 'nutricao', label: 'Nutrição' },
  { id: 'clinica-geral', label: 'Clínica geral' },
] as const;

export default function SpecialistRequestRoute() {
  const session = useSession();
  const [specialty, setSpecialty] = React.useState<(typeof SPECIALTIES)[number]['id']>('nutrologia');
  const [reason, setReason] = React.useState('Quero uma leitura mais personalizada do meu momento clínico.');
  const [goals, setGoals] = React.useState('Melhorar energia; proteger massa magra; organizar checkup');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await requestSpecialistChannel(session, {
        specialty,
        reason,
        goals: goals
          .split(';')
          .map((item) => item.trim())
          .filter(Boolean),
      });
      await trackMobileEvent(session, {
        event: 'specialist_request_submitted',
        screen: 'specialist-request',
        status: 'ok',
        metadata: {
          specialty,
        },
      });
      setMessage(`Pedido enviado para ${response.specialty}. SLA inicial: ${response.slaHours}h. ${response.nextStep}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao solicitar canal premium');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Canal premium"
      title="Pedir ativação com especialista"
      summary="No lançamento, o app não vende conversa médica livre dentro da loja. Ele organiza o pedido e deixa a ativação sob governança da equipe."
      support="A IA ajuda a estruturar contexto e objetivos, mas a decisão final de conduta sempre fica com o profissional humano."
    >
      <HeroCard
        eyebrow="Pedido governado"
        title="Formulação, nutrologia ou revisão clínica precisam de humano"
        summary="Esta tela existe para o paciente pedir uma linha mais profunda de cuidado sem transformar o app em promessa clínica imprudente."
      />

      <SectionCard eyebrow="Especialidade" title="Quem deve revisar seu caso primeiro">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {SPECIALTIES.map((item) => (
            <PrimaryButton
              key={item.id}
              label={item.label}
              onPress={() => setSpecialty(item.id)}
              tone={specialty === item.id ? 'accent' : 'ghost'}
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard eyebrow="Contexto" title="Explique o momento atual">
        <TextField label="Razão do pedido" value={reason} onChangeText={setReason} multiline />
        <TextField
          label="Objetivos clínicos"
          value={goals}
          onChangeText={setGoals}
          multiline
          placeholder="Separe por ponto e vírgula"
        />
        <PrimaryButton label="Enviar pedido" onPress={() => void submit()} disabled={loading || !reason.trim()} />
      </SectionCard>

      {message ? (
        <SectionCard eyebrow="Pedido enviado" title="A equipe recebeu sua solicitação" tone="muted">
          <ClinicalStatusBadge label="Na fila de revisão" tone="good" />
          <Text selectable style={{ color: colors.success, fontSize: typography.body, lineHeight: 22 }}>
            {message}
          </Text>
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível enviar o pedido">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
