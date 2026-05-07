import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { createExamDocument } from '@/lib/api';
import { useSession } from '@/context/session-context';

export default function ExamUploadRoute() {
  const session = useSession();
  const [fileName, setFileName] = React.useState('checkup-laboratorial.pdf');
  const [mimeType, setMimeType] = React.useState('application/pdf');
  const [summaryText, setSummaryText] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    try {
      const response = await createExamDocument(session, {
        fileName,
        mimeType,
        summaryText,
      });
      setMessage(`${response.fileName} registrado com status ${response.status}. ${response.reviewHint}`);
      await Haptics.selectionAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar documento');
    }
  }

  return (
    <ScreenShell summary="Hub inicial de exames e documentos. O contrato já aceita binário/base64; a primeira UI entrega cadastro e fila de OCR segura.">
      <SectionCard eyebrow="Documento clínico" title="Registrar exame">
        <TextField label="Nome do arquivo" value={fileName} onChangeText={setFileName} />
        <TextField label="MIME type" value={mimeType} onChangeText={setMimeType} />
        <TextField label="Resumo textual" value={summaryText} onChangeText={setSummaryText} multiline placeholder="Hemograma, glicemia, TSH, perfil lipídico..." />
        <PrimaryButton label="Registrar documento" onPress={() => void handleSubmit()} disabled={!fileName.trim() || !mimeType.trim()} />
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
