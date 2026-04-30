// 🔥 /src/ai/prompt.ts (Versão Premium Finalizada e Otimizada com Anti-Alucinação)

import { getRedFlagsByType } from '../lib/redFlags';
import { getRandomReferences } from '../lib/referencesCatalog';

export function formatarRespostas(dados: Record<string, string | number>): string {
  return Object.entries(dados)
    .filter(([, valor]) => valor !== undefined && valor !== null && valor !== '')
    .map(([chave, valor]) => `• ${formatarCampo(chave)}: ${String(valor)}`)
    .join('\n');
}

function formatarCampo(campo: string): string {
  return campo
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Função para gerar referências dinâmicas por tipo de triagem
function gerarReferencias(tipoTriagem: string): string {
  const referencias = getRandomReferences(tipoTriagem, 3);
  const referenciasTexto = referencias.map(ref => `• ${ref.title} (${ref.source})`).join('\n');
  
  return `
🔬 Este relatório foi produzido com base nas mais recentes evidências científicas, utilizando fontes reconhecidas internacionalmente:

${referenciasTexto}

⚠️ Este conteúdo tem caráter educativo e motivacional, sendo complementar ao cuidado médico profissional. Sempre consulte um profissional de saúde antes de tomar decisões clínicas.
`;
}

// Função para gerar estrutura do relatório com red flags
function gerarEstruturaRelatorio(tipoTriagem: string): string {
  const redFlags = getRedFlagsByType(tipoTriagem);
  const highSeverityFlags = redFlags.filter(flag => flag.severity === 'high');
  
  let redFlagsSection = '';
  if (highSeverityFlags.length > 0) {
    redFlagsSection = `
🚨 SINAIS DE ALERTA - Procure atendimento médico imediatamente se apresentar:
${highSeverityFlags.map(flag => `• ${flag.description}`).join('\n')}
`;
  }
  
  return `
📊 Estrutura do Relatório:
${redFlagsSection}
1. 🧠 Análise Profunda da Sua Saúde Atual
2. 🔮 Predições Futuras Baseadas em IA e Dados Científicos
3. 🩺 Plano de Ação Prático, Individualizado e Seguro (campo: planoDeAcao)
4. 💊 Nutrientes, Vitaminas e Suplementos Recomendados (campo: vitaminasENutrientes)
5. 🧪 Sugestão de Exames Laboratoriais Personalizados (campo: examesCheckup)
6. ⏳ Linha do Tempo e Histórico de Saúde (campo: linhaDoTempo)
7. 📜 Recomendações Finais e Observações (campo: consideracoesFinais)
8. 👤 Dados Relevantes do Paciente (campo: informacoesPaciente)
`;
}

export const gerarPromptPersonalizado = (dados: Record<string, any>): string => {
  const respostas = formatarRespostas(dados);
  const tipoTriagem = dados.tipo || 'geral';
  const estruturaRelatorio = gerarEstruturaRelatorio(tipoTriagem);
  const referencias = gerarReferencias(tipoTriagem);
  
  return `
📄 *Relatório Premium de Saúde Integrativa e Preditiva*

✅ *Objetivo:* Entregar uma análise individualizada da sua saúde com base na sua triagem, com foco em promover autoconhecimento, prevenção de doenças e melhoria da qualidade de vida.

🧠 *Como este relatório é gerado:*
Baseado em suas respostas pessoais, idade, sexo, IMC, hábitos e sintomas, aplicamos algoritmos de IA treinados com diretrizes médicas e evidências científicas para gerar um relatório exclusivo.

🧬 *Sua Avaliação Pessoal:*
• Nome: ${dados.nome || 'Não informado'}
• Sexo: ${dados.sexo || 'Não informado'}
• Idade: ${dados.idade ? `${dados.idade} anos` : 'Não informada'}
• Objetivo Principal: ${dados.objetivo_saude || 'Não informado'}
• IMC: ${dados.imc ? `${dados.imc} kg/m²` : 'Não informado'}

${respostas ? `\n📋 *Respostas adicionais:* \n${respostas}` : ''}

${estruturaRelatorio}

🔧 Formato de Resposta Esperado (em JSON):
{
  "informacoesPaciente": "...",
  "planoDeAcao": "...",
  "vitaminasENutrientes": "...",
  "examesCheckup": "...",
  "linhaDoTempo": "...",
  "consideracoesFinais": "..."
}

📌 *Orientações Especiais para as Seções 4 e 5:*

• Na seção *4. 💊 Nutrientes, Vitaminas e Suplementos Recomendados*, liste detalhadamente micronutrientes essenciais adaptados ao paciente (como vitamina D para imunidade, ômega 3 para saúde cardiovascular, zinco para disposição física, magnésio para controle do estresse) dando exemplos práticos de alimentos e suplementos específicos.

• Na seção *5. 🧪 Sugestão de Exames Laboratoriais Personalizados*, forneça lista personalizada de exames laboratoriais com breve explicação prática da utilidade clínica (hemograma para anemia, perfil lipídico para risco cardiovascular, glicemia para risco de diabetes, TSH para avaliar função da tireoide).

${referencias}

💡 *Importante:* O conteúdo será claro, acolhedor e direto, como uma conversa cuidadosa com um médico humano que quer seu bem. Sempre com foco em ações práticas e sustentáveis.

🚨 *REGRAS ANTI-ALUCINAÇÃO:*
• Se faltarem dados para análise completa, responda "Dados insuficientes para análise completa"
• Use linguagem conservadora: "pode ajudar", "evidências sugerem", "geralmente"
• NÃO prometa cura, diagnóstico definitivo ou medicamentos específicos
• NÃO invente dados que não foram fornecidos
• Sempre recomende consulta médica para casos complexos

💬 *Mensagem Especial:*
Este relatório foi cuidadosamente elaborado pensando em você e na sua jornada única. Cada recomendação é adaptada à sua realidade, visando não apenas melhorar sua saúde, mas também inspirar mudanças reais e sustentáveis em sua vida. Estamos juntos nessa caminhada!
`.trim();
};

export const gerarPromptPreditiva = gerarPromptPersonalizado;

export const gerarPromptTriagem = (tipo: string, dados: Record<string, string>): string => gerarPromptPersonalizado({ ...dados, tipo });