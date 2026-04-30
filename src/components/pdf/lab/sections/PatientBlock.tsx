// src/components/pdf/lab/sections/PatientBlock.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

import { normalizeBMI } from "@/lib/health/bmi";

type PatientBlockProps = {
  patient: { firstName: string; sex: "M" | "F" | "O"; age: number; bmi?: number };
  meta: { createdAtISO: string; triageSlug: string; hasRedFlags: boolean; score: number };
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  label: {
    color: "#6B7280",
  },
  valueBold: {
    fontWeight: 700,
  },
  flag: {
    color: "#DC2626",
    fontWeight: 700,
  },
});

const sexMap: Record<"M" | "F" | "O", string> = {
  M: "Masculino",
  F: "Feminino",
  O: "Outro",
};

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export const PatientBlock: React.FC<PatientBlockProps> = ({ patient, meta }) => {
  const bmiText = normalizeBMI(patient.bmi)?.bmi.toFixed(1) ?? "—";
  const triageLabel = meta.triageSlug?.toUpperCase() || "—";
  const riskFlag = meta.hasRedFlags ? "Red flags identificadas" : "Sem red flags";

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text>
          <Text style={styles.label}>Paciente: </Text>
          <Text style={styles.valueBold}>{patient.firstName}</Text>
        </Text>
        <Text>
          <Text style={styles.label}>Sexo: </Text>
          {sexMap[patient.sex]}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>
          <Text style={styles.label}>Idade: </Text>
          {patient.age ? `${patient.age} anos` : "—"}
        </Text>
        <Text>
          <Text style={styles.label}>IMC: </Text>
          {bmiText}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>
          <Text style={styles.label}>Triagem: </Text>
          {triageLabel}
        </Text>
        <Text>
          <Text style={styles.label}>Gerado em: </Text>
          {formatDateTime(meta.createdAtISO)}
        </Text>
      </View>
      <View style={styles.row}>
        <Text>
          <Text style={styles.label}>Score atual: </Text>
          <Text style={styles.valueBold}>{meta.score}</Text>
        </Text>
        <Text style={meta.hasRedFlags ? styles.flag : styles.label}>{riskFlag}</Text>
      </View>
    </View>
  );
};
