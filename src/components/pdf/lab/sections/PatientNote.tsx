// src/components/pdf/lab/sections/PatientNote.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: "#A7F3D0",
    backgroundColor: "#ECFDF5",
    borderRadius: 4,
    padding: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: "#065F46",
  },
});

export const PatientNote: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.box}>
    <Text style={styles.title}>Nota ao paciente</Text>
    <Text style={styles.body}>{text}</Text>
  </View>
);
