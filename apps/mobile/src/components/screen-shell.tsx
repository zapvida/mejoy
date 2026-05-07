import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

export function ScreenShell({
  eyebrow = 'MeJoy Native',
  title = 'Jornada clínica em uma interface só',
  summary,
  support,
  refreshing,
  onRefresh,
  children,
}: {
  eyebrow?: string;
  title?: string;
  summary: string;
  support?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.brand} />
        ) : undefined
      }
      contentContainerStyle={{
        padding: spacing.xl,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          overflow: 'hidden',
          backgroundColor: colors.ink,
          borderRadius: radii.xl,
          borderCurve: 'continuous',
          padding: spacing.xxl,
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -26,
            right: -26,
            width: 148,
            height: 148,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 138, 61, 0.12)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -36,
            left: -18,
            width: 118,
            height: 118,
            borderRadius: 999,
            backgroundColor: 'rgba(232, 243, 237, 0.08)',
          }}
        />
        <Text selectable style={{ color: '#DAF5E7', fontSize: typography.micro, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {eyebrow}
        </Text>
        <Text selectable style={{ color: colors.white, fontSize: typography.title, fontWeight: '700', lineHeight: 33 }}>
          {title}
        </Text>
        <Text selectable style={{ color: '#D9E7E2', fontSize: typography.body, lineHeight: 22 }}>
          {summary}
        </Text>
        {support ? (
          <Text selectable style={{ color: '#BFD5CA', fontSize: typography.caption, lineHeight: 20 }}>
            {support}
          </Text>
        ) : null}
      </View>
      {children}
    </ScrollView>
  );
}
