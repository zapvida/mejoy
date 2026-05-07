import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { createExamDocument } from '@/lib/api';

export default function ExamUploadRoute() {
  const session = useSession();
  const [fileName, setFileName] = React.useState('checkup-laboratorial.pdf');
  const [mimeType, setMimeType] = React.useState('application/pdf');
  const [base64Content, setBase64Content] = React.useState<string | undefined>();
  const [summaryText, setSummaryText] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handlePickDocument() {
    const selection = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: false,
      base64: true,
    });

    if (selection.canceled) return;

    const asset = selection.assets[0];
    setFileName(asset.name);
    setMimeType(asset.mimeType || 'application/octet-stream');
    setBase64Content(asset.base64 || undefined);
    await Haptics.selectionAsync();
  }

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      const response = await createExamDocument(session, {
        fileName,
        mimeType,
        base64Content,
        summaryText,
      });
      setMessage(`${response.fileName} registrado com status ${response.status}. ${response.reviewHint}`);
      await Haptics.selectionAsync();
      await trackMobileEvent(session, {
        event: 'exam_uploaded',
        screen: 'exam-upload',
        status: 'ok',
        metadata: {
          mimeType,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar documento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Exames"
      title="Hub documental do paciente"
      summary="Este fluxo já aceita picker nativo, fila segura de upload e o payload necessário para OCR, revisão e timeline clínica."
    >
      <NativeModalSheet
        eyebrow="Documento clínico"
        title="Adicionar exame ou anexo"
        summary="Escolha um PDF, imagem ou arquivo médico. O app organiza o item para análise posterior e deixa o médico externo receber tudo no bundle."
      >
        <PrimaryButton label="Escolher arquivo" onPress={() => void handlePickDocument()} tone="ghost" />
        <TextField label="Nome do arquivo" value={fileName} onChangeText={setFileName} />
        <TextField label="MIME type" value={mimeType} onChangeText={setMimeType} />
        <TextField
          label="Resumo textual"
          value={summaryText}
          onChangeText={setSummaryText}
          multiline
          placeholder="Hemograma, glicemia, TSH, perfil lipídico..."
        />
        {base64Content ? <ClinicalStatusBadge label="Arquivo anexado ao payload" tone="good" /> : null}
        <PrimaryButton
          label={loading ? 'Registrando...' : 'Registrar documento'}
          onPress={() => void handleSubmit()}
          disabled={loading || !fileName.trim() || !mimeType.trim()}
        />
      </NativeModalSheet>

      {message ? (
        <SectionCard eyebrow="Atualização" title="Documento recebido" tone="muted">
          <Text selectable style={{ color: colors.success, fontSize: typography.body, lineHeight: 22 }}>
            {message}
          </Text>
        </SectionCard>
      ) : null}

      {error ? (
        <SectionCard eyebrow="Falha" title="Não foi possível registrar o documento">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
