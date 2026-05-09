import React from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';

export function AppScreen({
  eyebrow,
  title,
  summary,
  support,
  refreshing,
  onRefresh,
  children,
  heroAside,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  support?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
  heroAside?: React.ReactNode;
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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          overflow: 'hidden',
          borderRadius: radii.xl,
          borderCurve: 'continuous',
          backgroundColor: colors.ink,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.05)',
          padding: spacing.xxl,
          gap: spacing.lg,
          boxShadow: shadows.elevation3,
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -34,
            right: -22,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 138, 61, 0.12)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -54,
            left: -16,
            width: 132,
            height: 132,
            borderRadius: 999,
            backgroundColor: 'rgba(221, 239, 231, 0.08)',
          }}
        />
        <View style={{ gap: spacing.sm }}>
          <Text
            selectable
            style={{
              color: '#D8F0E4',
              fontSize: typography.micro,
              fontWeight: '700',
              letterSpacing: 0.8,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </Text>
          <View style={{ gap: spacing.md }}>
            <Text
              selectable
              style={{
                color: colors.white,
                fontSize: typography.display,
                fontWeight: '700',
                lineHeight: 40,
              }}
            >
              {title}
            </Text>
            <Text
              selectable
              style={{
                color: '#D8E7E0',
                fontSize: typography.body,
                lineHeight: 24,
              }}
            >
              {summary}
            </Text>
          </View>
        </View>
        {heroAside}
        {support ? (
          <View
            style={{
              borderRadius: radii.md,
              borderCurve: 'continuous',
              backgroundColor: 'rgba(255,255,255,0.06)',
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            }}
          >
            <Text
              selectable
              style={{
                color: '#C2D8CE',
                fontSize: typography.caption,
                lineHeight: 20,
              }}
            >
              {support}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={{ gap: spacing.lg }}>{children}</View>
    </ScrollView>
  );
}
