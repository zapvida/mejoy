// src/types/html2pdf.d.ts
declare module 'html2pdf.js' {
  // você pode colocar tipos mais específicos se quiser,
  // mas `any` resolve para começar sem erros:
  const html2pdf: any;
  export default html2pdf;
}