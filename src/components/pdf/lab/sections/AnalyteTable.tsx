// src/components/pdf/lab/sections/AnalyteTable.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

import type { LabPanel } from "@/lib/pdf/lab/types";

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 2,
  },
  dataRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingVertical: 4,
  },
  colName: { width: "40%" },
  colResult: { width: "18%" },
  colRef: { width: "22%" },
  colUnit: { width: "10%" },
  colFlag: { width: "10%", textAlign: "center" },
  headText: { fontSize: 9, color: "#6B7280" },
  bodyText: { fontSize: 10 },
  comment: { fontSize: 8, color: "#6B7280", marginTop: 2 },
});

const flagSymbol = (flag: "L" | "N" | "H"): string => {
  if (flag === "L") return "▼";
  if (flag === "H") return "▲";
  return "•";
};

const referenceText = (low?: number, high?: number, unit?: string): string => {
  if (low == null && high == null) return unit ? `— ${unit}` : "—";
  const range = `${low != null ? low : ""}${low != null || high != null ? "–" : ""}${high != null ? high : ""}`;
  return unit ? `${range} ${unit}`.trim() : range;
};

export const AnalyteTable: React.FC<{ panel: LabPanel }> = ({ panel }) => (
  <View>
    <Text style={styles.title}>{panel.panel}</Text>
    <View style={styles.headerRow}>
      <Text style={[styles.colName, styles.headText]}>Exame</Text>
      <Text style={[styles.colResult, styles.headText]}>Resultado</Text>
      <Text style={[styles.colRef, styles.headText]}>Ref.</Text>
      <Text style={[styles.colUnit, styles.headText]}>Un.</Text>
      <Text style={[styles.colFlag, styles.headText]}>Flag</Text>
    </View>
    {panel.items.map((item) => (
      <View key={item.code} style={styles.dataRow}>
        <View style={styles.colName}>
          <Text style={styles.bodyText}>{item.name}</Text>
          {item.comment && <Text style={styles.comment}>{item.comment}</Text>}
        </View>
        <Text style={[styles.colResult, styles.bodyText]}>{item.value}</Text>
        <Text style={[styles.colRef, styles.bodyText]}>
          {referenceText(item.ref.low, item.ref.high, item.ref.unit)}
        </Text>
        <Text style={[styles.colUnit, styles.bodyText]}>{item.unit ?? ""}</Text>
        <Text style={[styles.colFlag, styles.bodyText]}>{flagSymbol(item.flag)}</Text>
      </View>
    ))}
  </View>
);
