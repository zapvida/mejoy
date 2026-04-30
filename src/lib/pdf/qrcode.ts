// src/lib/pdf/qrcode.ts
// Geração de QR codes para PDFs (server-safe)

export function qrcodeDataUrl(payload: string): string {
  // Server-safe: usar Buffer em vez de btoa
  const base64 = Buffer.from(payload, 'utf8').toString('base64');
  return `data:image/png;base64,${base64}`;
}

export function generateQRCodeData(reportId: string, baseUrl: string = 'https://www.zapfarm.com.br'): string {
  const url = `${baseUrl}/relatorio/${reportId}`;
  return qrcodeDataUrl(url);
}