import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, View } from 'react-native';

import { colors, spacing } from '@mejoy/design-tokens';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { TextField } from '@/components/text-field';
import { analyzeMeal } from '@/lib/api';
import { useSession } from '@/context/session-context';
import type { MealAnalysisResponse } from '@mejoy/api-contracts/mobile';

export default function MealAnalysisRoute() {
  const session = useSession();
  const [description, setDescription] = React.useState('');
  const [menuText, setMenuText] = React.useState('');
  const [result, setResult] = React.useState<MealAnalysisResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleAnalyze() {
    setError(null);
    try {
      const response = await analyzeMeal(session, { description, menuText });
      setResult(response);
      await Haptics.selectionAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao analisar refeição');
    }
  }

  return (
    <ScreenShell summary="Leitura assistiva de cardápio e refeição com contrato pronto para OCR + visão; a primeira entrega já devolve estimativa estruturada e guardrails clínicos.">
      <SectionCard eyebrow="Entrada" title="Descreva o prato ou o cardápio">
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
        <PrimaryButton label="Analisar refeição" onPress={() => void handleAnalyze()} disabled={!description.trim() && !menuText.trim()} />
      </SectionCard>

      {error ? (
        <View style={{ borderRadius: 18, borderCurve: 'continuous', backgroundColor: '#FFF1F1', padding: spacing.lg }}>
          <Text selectable style={{ color: colors.danger }}>{error}</Text>
        </View>
      ) : null}

      {result ? (
        <SectionCard eyebrow={result.source} title="Saída estruturada">
          <Text selectable style={{ color: colors.text }}>Calorias: {result.caloriesEstimate} kcal</Text>
          <Text selectable style={{ color: colors.text }}>Proteína: {result.proteinGrams} g</Text>
          <Text selectable style={{ color: colors.text }}>Carboidratos: {result.carbsGrams} g</Text>
          <Text selectable style={{ color: colors.text }}>Gorduras: {result.fatGrams} g</Text>
          <Text selectable style={{ color: colors.text }}>Fibra: {result.fiberGrams} g</Text>
          <Text selectable style={{ color: colors.text }}>Risco: {result.riskLevel}</Text>
          <Text selectable style={{ color: colors.textMuted, lineHeight: 22 }}>{result.bestChoice}</Text>
          {result.flags.map((flag) => (
            <Text selectable key={flag} style={{ color: colors.warning }}>
              • {flag}
            </Text>
          ))}
          <Text selectable style={{ color: colors.textMuted, lineHeight: 22 }}>
            {result.disclaimer}
          </Text>
        </SectionCard>
      ) : null}
    </ScreenShell>
  );
}
