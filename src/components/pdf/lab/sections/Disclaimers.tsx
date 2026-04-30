// src/components/pdf/lab/sections/Disclaimers.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  title: { fontSize: 10, fontWeight: 700, marginBottom: 4 },
  bullet: { marginLeft: 6, marginBottom: 2, fontSize: 9, color: "#6B7280" },
});

export const Disclaimers: React.FC<{ items: string[] }> = ({ items }) => (
  <View>
    <Text style={styles.title}>Observações</Text>
    {items.map((item, index) => (
      <Text key={index} style={styles.bullet}>
        • {item}
      </Text>
    ))}
  </View>
);
