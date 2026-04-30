'use client';

import { normalizeBMI } from '@/lib/health/bmi';
import type { ReportViewModel } from '@/lib/report/derive';
import { RefinedCard } from '@/components/ui/RefinedCard';

interface Props {
  vm: ReportViewModel;
}

interface ParsedAIContent {
  quadroHoje?: string;
  porQueImporta?: string;
  fisiopatologia?: string;
  tratamentoMedicamentoso?: string;
  proximosPassos?: string;
}

/**
 * Parseia o markdown da IA em 5 blocos estruturados
 * Procura por headings (##, ###) ou marcadores específicos
 */
function parseAIMarkdown(markdown: string | null | undefined): ParsedAIContent | null {
  if (!markdown) return null;
  
  const content: ParsedAIContent = {};
  
  // Normalizar quebras de linha
  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Tentar encontrar blocos por headings ou marcadores
  // Padrões possíveis:
  // 1) "Seu quadro hoje" ou "1) Seu quadro hoje" ou "## Seu quadro hoje"
  // 2) "Por que isso importa" ou "2) Por que isso importa" ou "## Por que isso importa"
  // 3) "Entenda o que acontece" ou "3) Entenda o que acontece" ou "## Entenda o que acontece"
  // 4) "Indicação de tratamento" ou "4) Indicação de tratamento" ou "## Indicação de tratamento"
  // 5) "Próximos passos" ou "5) Próximos passos" ou "## Próximos passos"
  
  const patterns = [
    {
      key: 'quadroHoje' as const,
      regex: /(?:^|\n)(?:#{1,3}\s*)?(?:1[.)]?\s*)?(?:Seu\s+quadro\s+hoje|Quadro\s+hoje)[\s\S]*?(?=(?:^|\n)(?:#{1,3}\s*)?(?:2[.)]?\s*)?(?:Por\s+que|Classificação|Orientações|Pré-prescrição|Próximos)|$)/i
    },
    {
      key: 'porQueImporta' as const,
      regex: /(?:^|\n)(?:#{1,3}\s*)?(?:2[.)]?\s*)?(?:Por\s+que\s+isso\s+importa|Classificação\s+de\s+indicação|Por\s+que\s+importa)[\s\S]*?(?=(?:^|\n)(?:#{1,3}\s*)?(?:3[.)]?\s*)?(?:Entenda|Orientações|Pré-prescrição|Próximos)|$)/i
    },
    {
      key: 'fisiopatologia' as const,
      regex: /(?:^|\n)(?:#{1,3}\s*)?(?:3[.)]?\s*)?(?:Entenda\s+o\s+que\s+acontece|Orientações\s+de\s+promoção|Fisiopatologia)[\s\S]*?(?=(?:^|\n)(?:#{1,3}\s*)?(?:4[.)]?\s*)?(?:Indicação|Pré-prescrição|Tratamento|Próximos)|$)/i
    },
    {
      key: 'tratamentoMedicamentoso' as const,
      regex: /(?:^|\n)(?:#{1,3}\s*)?(?:4[.)]?\s*)?(?:Indicação\s+de\s+tratamento|Pré-prescrição\s+medicamentosa|Tratamento\s+medicamentoso)[\s\S]*?(?=(?:^|\n)(?:#{1,3}\s*)?(?:5[.)]?\s*)?(?:Próximos\s+passos|$)|$)/i
    },
    {
      key: 'proximosPassos' as const,
      regex: /(?:^|\n)(?:#{1,3}\s*)?(?:5[.)]?\s*)?(?:Próximos\s+passos|Próximos)[\s\S]*?$/i
    }
  ];
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern.regex);
    if (match) {
      // Limpar o texto: remover headings, números, e espaços extras
      let text = match[0]
        .replace(/^#{1,3}\s*/gm, '') // Remove headings markdown
        .replace(/^\d+[.)]\s*/gm, '') // Remove numeração
        .replace(/^(?:Seu\s+quadro\s+hoje|Por\s+que\s+isso\s+importa|Entenda\s+o\s+que\s+acontece|Indicação\s+de\s+tratamento|Próximos\s+passos)[:\s]*/i, '') // Remove títulos
        .trim();
      
      // Se ainda tem conteúdo significativo (mais de 50 caracteres)
      if (text.length > 50) {
        content[pattern.key] = text;
      }
    }
  }
  
  // Se encontrou pelo menos 2 blocos, considera válido
  const foundBlocks = Object.keys(content).length;
  return foundBlocks >= 2 ? content : null;
}

export function ReportAnalysisEmagrecimento({ vm }: Props) {
  const bmi = normalizeBMI(vm.basics.bmi, vm.basics.age);
  const bmiValue = bmi?.bmi ?? null;
  const bmiClass = bmi?.classification ?? 'Não calculado';
  
  // Extrair dados do vm
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined;
  const comorbidades = Array.isArray(answers.comorbidades)
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  const idadeFaixa = answers.idade_faixa || 'não informado';
  
  // Parsear conteúdo da IA se disponível
  const aiContent = parseAIMarkdown(vm.aiMarkdown);
  const hasValidAIContent = aiContent !== null;
  
  // Função helper para gerar texto sobre riscos por perfil
  const getRiskExplanation = () => {
    const ageText = idadeFaixa !== 'não informado' ? `Na sua faixa de idade (${idadeFaixa}),` : 'Para pessoas na sua situação,';
    const comorbidadesText = comorbidades.length > 0 
      ? `com ${comorbidades.join(' e ')},` 
      : '';
    
    return `${ageText} ${comorbidadesText} o excesso de peso aumenta de forma importante o risco de problemas como diabetes tipo 2, pressão alta, doenças cardiovasculares e apneia do sono. Mas não se preocupe: mudanças graduais e acompanhamento médico podem reduzir bastante esse risco.`;
  };
  
  // Função helper para explicação de fisiopatologia
  const getPhysiologyExplanation = () => {
    return `A obesidade é uma doença crônica complexa que envolve desequilíbrios hormonais. Nosso corpo produz hormônios que controlam a fome (como a grelina) e a saciedade (como a leptina e o GLP-1). Quando esses hormônios estão desregulados, pode ser mais difícil controlar o apetite e o peso, mesmo com força de vontade. Por isso, não é apenas uma questão de "comer menos" - é um problema médico que precisa de abordagem multidisciplinar, incluindo alimentação equilibrada, atividade física, sono adequado e, quando indicado, acompanhamento médico com possíveis medicações.`;
  };
  
  // Função helper para indicação de tratamento medicamentoso
  const getMedicationIndication = () => {
    if (!classification) return null;
    
    if (classification === 'contraindicado') {
      const reasons = [];
      if (answers.gestacao === 'sim' || answers.gestacao === 'planejando') {
        reasons.push('gestação');
      }
      const contraindicacoes = Array.isArray(answers.contraindicacoes_glp1)
        ? answers.contraindicacoes_glp1.filter((c: string) => c !== 'nenhuma')
        : [];
      if (contraindicacoes.length > 0) {
        reasons.push(...contraindicacoes);
      }
      
      return {
        title: 'Indicação de tratamento medicamentoso para você',
        content: `Com base na sua avaliação, não há indicação segura para uso de medicações injetáveis como agonistas de GLP-1 no momento atual${reasons.length > 0 ? ` devido a ${reasons.join(' e ')}` : ''}. O foco será em abordagens não medicamentosas seguras, incluindo mudanças na alimentação, atividade física adaptada e acompanhamento médico regular. É importante consultar um médico para avaliar alternativas adequadas ao seu caso específico.`
      };
    }
    
    if (classification === 'candidato_glp1') {
      return {
        title: 'Indicação de tratamento medicamentoso para você',
        content: `Com base no seu IMC e nas comorbidades identificadas, você pode ser candidato a medicações injetáveis como agonistas de GLP-1 ou GLP-1/GIP (como semaglutida ou tirzepatida). Essas medicações podem ajudar na perda de peso quando usadas com acompanhamento médico adequado e associadas a mudanças no estilo de vida. É importante entender que a decisão final sobre qual medicação usar, se usar, e como usar, sempre será tomada em consulta com um médico endocrinologista, que avaliará seu caso individualmente.`
      };
    }
    
    if (classification === 'nao_indicado') {
      return {
        title: 'Indicação de tratamento medicamentoso para você',
        content: `Com base no seu quadro atual, o foco principal será em mudanças de estilo de vida, hábitos saudáveis e acompanhamento médico regular. Não há indicação para uso de medicações injetáveis para obesidade neste momento. Isso não significa que você não pode melhorar sua saúde - pelo contrário, mudanças graduais e sustentáveis podem trazer grandes benefícios. Se seu IMC aumentar ou surgirem comorbidades no futuro, podemos reavaliar a indicação de tratamento medicamentoso em consulta médica.`
      };
    }
    
    return null;
  };

  return (
    <RefinedCard variant="default" padding="lg" rounded="xl" className="shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">Análise Personalizada</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Entenda seu quadro e as opções de tratamento</p>
      </div>

      <div className="space-y-6">
        {/* BLOCO 1: Seu quadro hoje */}
        <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-r from-brand-50 to-purple-50/50 border-brand-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📊</span> 1. Seu quadro hoje
          </h3>
          {hasValidAIContent && aiContent?.quadroHoje ? (
            <div 
              className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: aiContent.quadroHoje.replace(/\n/g, '<br />') }} 
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Atualmente, seu IMC de <strong>{bmiValue?.toFixed(1) || '—'}</strong> indica que você está classificado como <strong>{bmiClass.toLowerCase()}</strong>. 
              Isso significa que seu peso está acima do ideal e pode trazer riscos à saúde se não for tratado adequadamente. 
              Com o acompanhamento médico correto e mudanças no estilo de vida, é possível melhorar significativamente sua saúde e qualidade de vida.
            </p>
          )}
        </RefinedCard>

        {/* BLOCO 2: Por que isso importa para você */}
        <RefinedCard variant="default" padding="lg" rounded="lg">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>❤️</span> 2. Por que isso importa para você
          </h3>
          {hasValidAIContent && aiContent?.porQueImporta ? (
            <div 
              className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: aiContent.porQueImporta.replace(/\n/g, '<br />') }} 
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {getRiskExplanation()}
            </p>
          )}
        </RefinedCard>

        {/* BLOCO 3: Entenda o que acontece no seu corpo */}
        <RefinedCard variant="default" padding="lg" rounded="lg">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>🔬</span> 3. Entenda o que acontece no seu corpo
          </h3>
          {hasValidAIContent && aiContent?.fisiopatologia ? (
            <div 
              className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: aiContent.fisiopatologia.replace(/\n/g, '<br />') }} 
            />
          ) : (
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {getPhysiologyExplanation()}
            </p>
          )}
        </RefinedCard>

        {/* BLOCO 4: Indicação de tratamento medicamentoso */}
        {(getMedicationIndication() || (hasValidAIContent && aiContent?.tratamentoMedicamentoso)) && (
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-r from-blue-50 to-purple-50/50 border-blue-200">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>💊</span> 4. {getMedicationIndication()?.title || 'Indicação de tratamento medicamentoso para você'}
            </h3>
            {hasValidAIContent && aiContent?.tratamentoMedicamentoso ? (
              <div 
                className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none mb-3"
                dangerouslySetInnerHTML={{ __html: aiContent.tratamentoMedicamentoso.replace(/\n/g, '<br />') }} 
              />
            ) : getMedicationIndication() ? (
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                {getMedicationIndication()!.content}
              </p>
            ) : null}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                <strong>Importante:</strong> As condutas medicamentosas aqui descritas são um rascunho gerado com apoio de IA e não substituem a decisão final do médico. 
                Todo uso de medicação é feito somente após avaliação individual e prescrição médica, seguindo as normas da ANVISA.
              </p>
            </div>
          </RefinedCard>
        )}

        {/* BLOCO 5: Próximos passos */}
        <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-r from-green-50 to-blue-50/50 border-green-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>🚀</span> 5. Próximos passos
          </h3>
          {hasValidAIContent && aiContent?.proximosPassos ? (
            <div 
              className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: aiContent.proximosPassos.replace(/\n/g, '<br />') }} 
            />
          ) : (
            <>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                Agora que você entende melhor seu quadro, o próximo passo é criar um plano de ação personalizado. 
                Isso inclui mudanças graduais na alimentação, aumento da atividade física (se possível), melhora da qualidade do sono e, quando indicado, 
                acompanhamento médico para avaliar a possibilidade de tratamento medicamentoso. 
                Lembre-se: pequenas mudanças sustentáveis têm grande impacto ao longo do tempo.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Você encontrará um plano de ações práticas na próxima seção, com checklists que você pode seguir dia a dia.
              </p>
            </>
          )}
        </RefinedCard>
      </div>
    </RefinedCard>
  );
}

