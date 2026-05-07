import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Text, View } from 'react-native';

import type { MealAnalysisResponse } from '@mejoy/api-contracts/mobile';
import { colors, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { MetricPill } from '@/components/metric-pill';
import { NativeModalSheet } from '@/components/native-modal-sheet';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { useSession } from '@/context/session-context';
import { trackMobileEvent } from '@/lib/analytics';
import { analyzeMeal } from '@/lib/api';

export default function MealAnalysisRoute() {
  const session = useSession();
  const [description, setDescription] = React.useState('');
  const [menuText, setMenuText] = React.useState('');
  const [imageBase64, setImageBase64] = React.useState<string | undefined>();
  const [assetName, setAssetName] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<MealAnalysisResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function pickFromLibrary() {
    const selection = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (selection.canceled) return;

    const asset = selection.assets[0];
    setImageBase64(asset.base64 || undefined);
    setAssetName(asset.fileName || 'imagem-selecionada.jpg');
    await Haptics.selectionAsync();
  }

  async function pickFromCamera() {
    const capture = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (capture.canceled) return;

    const asset = capture.assets[0];
    setImageBase64(asset.base64 || undefined);
    setAssetName(asset.fileName || 'captura-meal-ai.jpg');
    await Haptics.selectionAsync();
  }

  async function handleAnalyze() {
    setError(null);
    setLoading(true);
    try {
      const response = await analyzeMeal(session, { description, menuText, imageBase64 });
      setResult(response);
      await Haptics.selectionAsync();
      await trackMobileEvent(session, {
        event: 'meal_analyzed',
        screen: 'meal-analysis',
        status: 'ok',
        metadata: {
          source: response.source,
          riskLevel: response.riskLevel,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar refeição');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Meal AI"
      title="Leitura de prato e cardápio"
      summary="A IA fica embutida no fluxo: você descreve, fotografa ou cola o menu e o app devolve risco, macros e a melhor escolha dentro da sua jornada."
    >
      <NativeModalSheet
        eyebrow="Entrada multimodal"
        title="Texto, menu ou imagem"
        summary="A câmera e a galeria já podem alimentar o contrato do Meal AI. Em produção, o mesmo ponto recebe OCR e visão computacional do pipeline final."
      >
        <TextField
          label="Descrição rápida"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Ex.: frango grelhado, arroz, batata frita e refrigerante."
        />
        <TextField
          label="Texto do menu"
          value={menuText}
          onChangeText={setMenuText}
          multiline
          placeholder="Cole aqui o cardápio do restaurante, se quiser."
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <PrimaryButton label="Abrir galeria" onPress={() => void pickFromLibrary()} tone="ghost" />
          <PrimaryButton label="Usar câmera" onPress={() => void pickFromCamera()} tone="ghost" />
        </View>
        {assetName ? (
          <ClinicalStatusBadge label={`Imagem pronta: ${assetName}`} tone="good" />
        ) : null}
        <PrimaryButton
          label={loading ? 'Analisando...' : 'Analisar refeição'}
          onPress={() => void handleAnalyze()}
          disabled={loading || (!description.trim() && !menuText.trim() && !imageBase64)}
        />
      </NativeModalSheet>

      {error ? (
        <SectionCard eyebrow="Falha" title="Análise indisponível">
          <Text selectable style={{ color: colors.danger, fontSize: typography.body, lineHeight: 22 }}>
            {error}
          </Text>
        </SectionCard>
      ) : null}

      {result ? (
        <SectionCard eyebrow={result.source} title="Saída estruturada">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
            <MetricPill label="Calorias" value={`${result.caloriesEstimate} kcal`} tone="brand" />
            <MetricPill label="Proteína" value={`${result.proteinGrams} g`} />
            <MetricPill label="Carbo" value={`${result.carbsGrams} g`} tone="accent" />
            <MetricPill label="Fibra" value={`${result.fiberGrams} g`} tone="warning" />
          </View>
          <ClinicalStatusBadge label={`Risco ${result.riskLevel}`} tone={result.riskLevel === 'high' ? 'high' : result.riskLevel === 'moderate' ? 'attention' : 'good'} />
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
            Melhor escolha agora
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
            {result.bestChoice}
          </Text>
          {result.flags.map((flag) => (
            <Text selectable key={flag} style={{ color: colors.warning, fontSize: typography.caption, lineHeight: 19 }}>
              • {flag}
            </Text>
          ))}
          <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 20 }}>
            {result.disclaimer}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
