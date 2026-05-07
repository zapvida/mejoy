import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text } from 'react-native';

import type { ClinicalShareBundleResponse } from '@mejoy/api-contracts/mobile';
import { colors, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { createShareBundle } from '@/lib/api';
import { formatDateTimeLabel } from '@/lib/formatters';

export default function ShareBundleRoute() {
  const session = useSession();
  const [note, setNote] = React.useState('');
  const [expiresInHours, setExpiresInHours] = React.useState('72');
  const [result, setResult] = React.useState<ClinicalShareBundleResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleShareBundle() {
    setError(null);
    setLoading(true);
    try {
      const response = await createShareBundle(session, {
        note,
        expiresInHours: Number(expiresInHours),
        includeSleep: true,
        includeSymptoms: true,
      });
      setResult(response);
      await Haptics.selectionAsync();
      await trackMobileEvent(session, {
        event: 'bundle_shared',
        screen: 'share-bundle',
        status: 'ok',
        metadata: {
          expiresInHours: Number(expiresInHours),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar pacote');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Bundle clínico"
      title="Pacote seguro para médico externo"
      summary="O share bundle é a primeira interface médica do v1: um link expirável que organiza resumo, peso, sono, relatórios e documentos sem pedir portal dedicado."
    >
      <NativeModalSheet
        eyebrow="Compartilhamento seguro"
        title="Gerar link expirável"
        summary="Adicione um contexto curto para o médico e defina a janela de expiração. O payload nasce com resumo clínico e dados recentes do paciente."
      >
        <TextField label="Nota para o médico" value={note} onChangeText={setNote} multiline placeholder="Contexto clínico que deve acompanhar o bundle." />
        <TextField label="Expira em horas" value={expiresInHours} onChangeText={setExpiresInHours} keyboardType="numeric" />
        <PrimaryButton
          label={loading ? 'Gerando...' : 'Gerar pacote'}
          onPress={() => void handleShareBundle()}
          disabled={loading || !expiresInHours.trim()}
        />
      </NativeModalSheet>

      {error ? (
        <SectionCard eyebrow="Falha" title="Bundle não criado">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      {result ? (
        <SectionCard eyebrow="Bundle criado" title="Pronto para compartilhar" tone="muted">
          <ClinicalStatusBadge label={`Expira ${formatDateTimeLabel(result.expiresAt)}`} tone="attention" />
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
            ID {result.id}
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
            {result.bundle.summary}
          </Text>
          <Text selectable style={{ color: colors.brandStrong, fontSize: typography.body, lineHeight: 22 }}>
            {result.shareUrl}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
