// 🔥 /src/utils/pdfTriagemGeral.ts

import html2pdf from 'html2pdf.js';

interface RelatorioTriagem {
  nome: string;
  imc: number;
  riscoCardiovascular: string;
  insightsGerais: string[];
  setores: Record<string, string[]>;
  conteudoPremium: string;
}

/**
 * Gera PDF da triagem geral em alta qualidade e estrutura premium.
 * @param dados Objeto com dados processados da triagem
 * @returns Blob do PDF gerado
 */
export async function gerarPdfTriagemGeral(dados: RelatorioTriagem) {
  const container = document.createElement('div');
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.fontFamily = 'Segoe UI, Roboto, sans-serif';
  container.style.color = '#000000';
  container.style.background = '#fff';

  const setoresHtml = Object.entries(dados.setores)
    .map(
      ([setor, insights]) => `
      <h3 style="color:#000000; margin-top:24px;">🧩 Setor: ${setor}</h3>
      <ul style="padding-left:20px;">
        ${insights.map((item) => `<li style="margin-bottom:4px;">${item}</li>`).join('')}
      </ul>
    `
    )
    .join('');

  container.innerHTML = `
    <h1 style="text-align: center; color: #00D084; font-size: 24px;">Relatório Premium de Saúde Individualizada</h1>
    
    <p><strong>👤 Nome:</strong> ${dados.nome}</p>
    <p><strong>📏 IMC:</strong> ${dados.imc}</p>
    <p><strong>❤️ Risco Cardiovascular:</strong> ${dados.riscoCardiovascular}</p>

    <h2 style="color:#00D084; margin-top:32px;">🔎 Insights Gerais</h2>
    <ul style="padding-left:20px;">
      ${dados.insightsGerais.map((i) => `<li style="margin-bottom:4px;">${i}</li>`).join('')}
    </ul>

    ${setoresHtml}

    <h2 style="color:#00D084; margin-top:32px;">📘 Conteúdo Premium Detalhado</h2>
    <pre style="white-space: pre-wrap; line-height:1.5; font-size:14px; color:#000000;">${dados.conteudoPremium}</pre>
  `;

  const opt = {
    margin: 10,
    filename: `relatorio-saude-${dados.nome.replace(/\s/g, '_').toLowerCase()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  return html2pdf().from(container).set(opt).outputPdf('blob');
}