// src/components/pdf/lab/LabReportPDF.tsx
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';
import React from 'react';


import { AnalyteTable } from './sections/AnalyteTable';
import { Disclaimers } from './sections/Disclaimers';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { Instructions } from './sections/Instructions';
import { Interpretation } from './sections/Interpretation';
import { PatientBlock } from './sections/PatientBlock';
import { PatientNote } from './sections/PatientNote';

import type { LabReportData } from '@/lib/pdf/lab/types';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36, paddingBottom: 40, paddingHorizontal: 36,
    fontFamily: 'Helvetica', backgroundColor: '#FFFFFF',
    fontSize: 10, lineHeight: 1.35,
  },
  section: { marginTop: 12 },
});

export const LabReportPDF: React.FC<{ data: LabReportData; qrDataUri?: string }> = ({ data, qrDataUri }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Header title="Laudo Estilo Laboratório — Gastrointestinal (GI)" {...(qrDataUri ? { qrDataUri } : {})} />
      <View style={styles.section}><PatientBlock patient={data.patient} meta={data.meta} /></View>
      {data.panels.map((p, idx) => (
        <View key={p.panel + idx} style={styles.section}>
          <AnalyteTable panel={p} />
        </View>
      ))}
      <View style={styles.section}><Interpretation interpretations={data.interpretations} /></View>
      <View style={styles.section}><PatientNote text={data.patientNote} /></View>
      <View style={styles.section}><Instructions data={data.instructions} suggested={data.suggestedExams} /></View>
      <View style={styles.section}><Disclaimers items={data.disclaimers} /></View>
      <Footer />
    </Page>
  </Document>
);
