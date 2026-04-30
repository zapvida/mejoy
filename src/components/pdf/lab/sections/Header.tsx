// src/components/pdf/lab/sections/Header.tsx
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  root: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 8 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 80, height: 20, objectFit: 'contain' },
  title: { fontSize: 12, fontWeight: 700 },
  qr: { width: 64, height: 64, borderWidth: 1, borderColor: '#E5E7EB' },
});

export const Header: React.FC<{ title: string; qrDataUri?: string }> = ({ title, qrDataUri }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <Image style={styles.logo} src={`${baseUrl}/logo-dark.png`} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {qrDataUri ? <Image style={styles.qr} src={qrDataUri} /> : <View style={styles.qr} />}
    </View>
  );
};
