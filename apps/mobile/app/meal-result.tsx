import { Text } from 'react-native';

import { colors, typography } from '@mejoy/design-tokens';
import { AppScreen } from '@/components/app-screen';
import { MealResultCard } from '@/components/meal-result-card';
import { PremiumCard } from '@/components/premium-card';
import { SectionTitle } from '@/components/section-title';
import { StatusBadge } from '@/components/status-badge';

export default function MealResultRoute() {
  return (
    <AppScreen
      eyebrow="Resultado da refeição"
      title="Boa escolha para hoje, com uma troca simples ainda melhor"
      summary="A leitura do prato mostra macros, impacto metabólico e a próxima microdecisão em linguagem que qualquer pessoa entende."
      support="Essa orientação não substitui avaliação médica ou nutricional."
      heroAside={<StatusBadge label="qualidade boa" tone="dark" />}
    >
      <MealResultCard
        quality="equilíbrio bom"
        insight="Boa base de proteína e volume suficiente para gerar saciedade. O ponto de atenção é reduzir gordura pesada se a náusea estiver mais sensível hoje."
        recommendation="Sugestão prática: manter a proteína, reforçar legumes e priorizar água antes da próxima refeição."
      />

      <PremiumCard tone="muted">
        <SectionTitle eyebrow="Impacto no plano" title="O prato ajuda mais quando conversa com seus sinais do dia" />
        <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 23 }}>
          Se o check-in mostrou náusea, fome instável ou sono ruim, o app adapta a explicação e sugere uma escolha mais leve, proteica e simples de digerir.
        </Text>
      </PremiumCard>
    </AppScreen>
  );
}
