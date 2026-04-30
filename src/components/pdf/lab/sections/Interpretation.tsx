// src/components/pdf/lab/sections/Interpretation.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  title: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  bullet: { marginLeft: 8, marginBottom: 2 },
});

export const Interpretation: React.FC<{ interpretations: string[] }> = ({ interpretations }) => (
  <View>
    <Text style={styles.title}>Interpretação (profissional)</Text>
    {interpretations.map((entry, index) => (
      <Text key={index} style={styles.bullet}>
        • {entry}
      </Text>
    ))}
  </View>
);
