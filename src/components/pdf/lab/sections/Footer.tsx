// src/components/pdf/lab/sections/Footer.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 6,
    fontSize: 8,
    color: "#6B7280",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export const Footer: React.FC = () => (
  <View style={styles.root}>
    <View style={styles.row}>
      <Text>Me Joy • Laudo informativo (não substitui consulta presencial)</Text>
      <Text>www.zapfarm.com.br</Text>
    </View>
  </View>
);
