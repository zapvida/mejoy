// src/components/pdf/lab/sections/Instructions.tsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import React from "react";

type InstructionsProps = {
  data: { title: string; items: string[] };
  suggested: { name: string; when: string; prep?: string }[];
};

const styles = StyleSheet.create({
  title: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  bullet: { marginLeft: 8, marginBottom: 2 },
  heading: { marginTop: 8, fontWeight: 700 },
  tableRow: { flexDirection: "row", marginBottom: 2 },
  columnExam: { width: "45%" },
  columnWhen: { width: "35%" },
  columnPrep: { width: "20%" },
  headText: { fontWeight: 700, fontSize: 10 },
  bodyText: { fontSize: 9.5 },
});

export const Instructions: React.FC<InstructionsProps> = ({ data, suggested }) => (
  <View>
    <Text style={styles.title}>{data.title}</Text>
    {data.items.map((item, index) => (
      <Text key={index} style={styles.bullet}>
        • {item}
      </Text>
    ))}
    <Text style={styles.heading}>Exames sugeridos</Text>
    <View style={styles.tableRow}>
      <Text style={[styles.columnExam, styles.headText]}>Exame</Text>
      <Text style={[styles.columnWhen, styles.headText]}>Quando considerar</Text>
      <Text style={[styles.columnPrep, styles.headText]}>Preparo</Text>
    </View>
    {suggested.map((exam, index) => (
      <View key={`${exam.name}-${index}`} style={styles.tableRow}>
        <Text style={[styles.columnExam, styles.bodyText]}>{exam.name}</Text>
        <Text style={[styles.columnWhen, styles.bodyText]}>{exam.when}</Text>
        <Text style={[styles.columnPrep, styles.bodyText]}>{exam.prep ?? "—"}</Text>
      </View>
    ))}
  </View>
);
