import { Text, View } from 'react-native';

import type { RitualTrack } from '@mejoy/api-contracts/mobile';
import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';
import { PrimaryButton } from '@/components/primary-button';

export function RitualCard({
  track,
  recommended,
  loading,
  onComplete,
}: {
  track: RitualTrack;
  recommended?: boolean;
  loading?: boolean;
  onComplete: () => void;
}) {
  return (
    <View
      style={{
        gap: spacing.md,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        boxShadow: shadows.soft,
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.sm }}>
          <Text
            selectable
            style={{
              color: track.accent,
              fontSize: typography.micro,
              fontWeight: '700',
              letterSpacing: 0.7,
              textTransform: 'uppercase',
            }}
          >
            {track.category}
          </Text>
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.section, fontWeight: '700', lineHeight: 28 }}>
            {track.title}
          </Text>
          <Text selectable style={{ color: colors.text, fontSize: typography.body, lineHeight: 22 }}>
            {track.subtitle}
          </Text>
        </View>
        {recommended ? <ClinicalStatusBadge label="Sugerido agora" tone="good" /> : null}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <ClinicalStatusBadge label={`${track.durationMinutes} min`} tone="low" />
        <ClinicalStatusBadge label={track.recommendedFor} tone="attention" />
      </View>
      <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption, lineHeight: 20 }}>
        {track.benefit}
      </Text>
      <PrimaryButton
        label={loading ? 'Registrando...' : 'Concluir ritual'}
        onPress={onComplete}
        disabled={loading}
        tone="accent"
      />
    </View>
  );
}
