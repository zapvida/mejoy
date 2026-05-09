import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@mejoy/design-tokens';

export function SymptomSelector({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <Pressable
            key={option}
            onPress={() => {
              if (isSelected) {
                onChange(selected.filter((item) => item !== option));
                return;
              }
              onChange([...selected, option]);
            }}
            style={{
              borderRadius: radii.pill,
              borderCurve: 'continuous',
              backgroundColor: isSelected ? colors.brandSoft : colors.card,
              borderWidth: 1,
              borderColor: isSelected ? colors.brandSoft : colors.border,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
            }}
          >
            <Text selectable style={{ color: isSelected ? colors.brandStrong : colors.textStrong, fontSize: typography.caption, fontWeight: '700' }}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
