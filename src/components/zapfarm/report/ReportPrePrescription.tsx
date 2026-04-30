import type { ReportViewModel } from '@/lib/report/derive';
import { calcularPosologiaTirzepatida } from '@/lib/emagrecimento/posologia';
import { isAutoPosologiaEnabled, isDemoModeEnabled } from '@/lib/emagrecimento/config';
import { RefinedCard } from '@/components/ui/RefinedCard';

interface Props {
  vm: ReportViewModel;
}

export function ReportPrePrescription({ vm }: Props) {
  const answers = (vm as any).answers || {};
  const classification = (vm as any).classification as 'candidato_glp1' | 'nao_indicado' | 'contraindicado' | undefined;
  
  // Se não for candidato, não mostrar pré-prescrição
  if (classification !== 'candidato_glp1') {
    return null;
  }
  
  const preferenciaPrincipioAtivo = answers.preferencia_principio_ativo || 'nao_sei';
  const autoPosologiaEnabled = isAutoPosologiaEnabled();
  const demoMode = isDemoModeEnabled();
  
  // Se não tem preferência por tirzepatida, mostrar versão genérica
  if (preferenciaPrincipioAtivo !== 'tirzepatida') {
    return (
      <RefinedCard variant="elevated" padding="lg" rounded="xl" className="shadow-xl">
        <div className="border-b border-zinc-200 pb-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 tracking-tight">
            📋 Plano de Tratamento Sugerido
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Plano medicamentoso a ser definido com o médico após avaliação completa
          </p>
        </div>
        <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-blue-50 border-blue-200">
          <p className="text-base text-foreground leading-relaxed">
            Com base no seu perfil, você é candidato a tratamento com medicações injetáveis para emagrecimento (agonistas de GLP-1). 
            O médico endocrinologista da equipe irá avaliar seu caso completo e definir qual medicação e esquema de tratamento 
            são mais adequados para você, considerando seus exames, histórico e objetivos.
          </p>
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="mt-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm font-semibold text-yellow-800">
              ⚠️ Após confirmar sua compra, um médico entrará em contato para definir o plano de tratamento personalizado.
            </p>
          </RefinedCard>
        </RefinedCard>
      </RefinedCard>
    );
  }
  
  // Se auto-posologia desabilitada, não mostrar componente detalhado
  if (!autoPosologiaEnabled) {
    return null;
  }
  
  // Calcular IMC
  const altura = parseFloat(answers.altura) || vm.basics.heightCm;
  const peso = parseFloat(answers.peso) || vm.basics.weightKg;
  let imc: number | null = null;
  if (altura && peso && altura > 0) {
    const alturaM = altura / 100;
    imc = Math.round((peso / (alturaM * alturaM)) * 10) / 10;
  } else if (vm.basics.bmi) {
    imc = vm.basics.bmi;
  }
  
  // Extrair comorbidades
  const comorbidades = Array.isArray(answers.comorbidades) 
    ? answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  // Calcular posologia
  const idade = vm.basics.age;
  let posologia;
  try {
    posologia = calcularPosologiaTirzepatida(imc || 30, comorbidades, idade);
  } catch (error) {
    console.warn('[ReportPrePrescription] Erro ao calcular posologia:', error);
    return null;
  }
  
  return (
    <RefinedCard variant="elevated" padding="lg" rounded="xl" className="shadow-xl">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 leading-tight tracking-tight">
              📋 Pré-Prescrição Automatizada
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">
              Tirzepatida – Rascunho • Esquema de tratamento planejado (programa de 6 meses)
            </p>
          </div>
          <div className="flex flex-col gap-2 flex-shrink-0">
            {demoMode && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 rounded-lg px-4 py-2 shadow-sm hover-glow transition-smooth">
                <p className="text-xs sm:text-sm font-semibold text-blue-800 flex items-center gap-1.5">
                  <span className="text-base">🎯</span> Modo Demonstração
                </p>
              </div>
            )}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg px-4 py-2 shadow-sm hover-glow transition-smooth">
              <p className="text-xs sm:text-sm font-semibold text-yellow-900 flex items-center gap-1.5">
                <span className="text-base">⚠️</span> A validar pelo médico após pagamento
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informações do Paciente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Paciente</p>
          <p className="text-lg font-bold text-gray-900">{vm.basics.name || 'Paciente'}</p>
        </RefinedCard>
        <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <p className="text-xs font-medium text-purple-600 mb-2 uppercase tracking-wide">IMC</p>
          <p className="text-lg font-bold text-purple-900">
            {imc?.toFixed(1) || '—'} {vm.basics.bmiCategory ? <span className="text-sm font-normal text-purple-700">({vm.basics.bmiCategory})</span> : ''}
          </p>
        </RefinedCard>
      </div>
      
      {/* Prescrição */}
      <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-purple-50 via-purple-50 to-orange-50 border-2 border-purple-200 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">💊</span> 
          <span>Medicação</span>
        </h3>
        
        <div className="space-y-5">
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-purple-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Princípio Ativo</p>
            <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Tirzepatida
            </p>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-purple-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Apresentação</p>
            <p className="text-base font-bold text-gray-900">
              {posologia.apresentacao} em pó para reconstituição
            </p>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-purple-100">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Dose Inicial</p>
            <p className="text-lg font-bold text-gray-900">
              {posologia.doseInicialMg}mg semanalmente
            </p>
            <p className="text-sm text-gray-600 mt-1">
              ({posologia.volumeInicialMl}mL após diluição)
            </p>
          </RefinedCard>
        </div>
      </RefinedCard>
      
      {/* Esquema de Titulação */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span>📅</span> Esquema de Titulação (6 meses)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Semanas 1-4</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">
              {posologia.titulacao[0].doseMg}mg
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {posologia.titulacao[0].volumeMl}mL/semana
            </p>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <p className="text-xs font-medium text-purple-600">Fase: Início</p>
            </div>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Semanas 5-8</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">
              {posologia.titulacao[4].doseMg}mg
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {posologia.titulacao[4].volumeMl}mL/semana
            </p>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <p className="text-xs font-medium text-purple-600">Fase: Titulação</p>
            </div>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Semanas 9-12</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">
              {posologia.titulacao[8].doseMg}mg
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {posologia.titulacao[8].volumeMl}mL/semana
            </p>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <p className="text-xs font-medium text-purple-600">Fase: Manutenção Inicial</p>
            </div>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Semanas 13-24</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">
              {posologia.titulacao[12].doseMg}mg
            </p>
            <p className="text-sm font-medium text-gray-700 mb-2">
              {posologia.titulacao[12].volumeMl}mL/semana
            </p>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <p className="text-xs font-medium text-purple-600">Fase: Manutenção</p>
            </div>
          </RefinedCard>
        </div>
      </div>
      
      {/* Preparo e Aplicação */}
      <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🔬</span> 
          <span>Preparo e Aplicação</span>
        </h3>
        
        <div className="space-y-3 text-sm sm:text-base text-gray-700">
          <p className="font-semibold">Diluição:</p>
          <p>{posologia.orientacoesDilucao}</p>
          
          <p className="font-semibold mt-4">Aplicação:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Subcutânea, 1x por semana, sempre no mesmo dia da semana</li>
            <li>Rotacionar locais de aplicação (abdome, coxa ou braço)</li>
            <li>Usar agulha apropriada (4-6mm, 31-32G)</li>
            <li>Usar imediatamente após reconstituição</li>
          </ul>
        </div>
      </RefinedCard>
      
      {/* Resultados Esperados */}
      <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🎯</span> 
          <span>Resultados Esperados</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">3 meses</p>
            <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {posologia.resultadosEsperados.tresMeses}
            </p>
          </RefinedCard>
          
          <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">6 meses</p>
            <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {posologia.resultadosEsperados.seisMeses}
            </p>
          </RefinedCard>
        </div>
      </RefinedCard>
      
      {/* Orientações Importantes */}
      <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">📌</span> 
          <span>Orientações Importantes</span>
        </h3>
        
        <ul className="space-y-3 text-sm sm:text-base text-gray-700">
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-orange-100">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
              <span className="font-medium">Monitorar peso semanalmente (mesmo horário, mesma balança)</span>
            </li>
          </RefinedCard>
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-orange-100">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
              <span className="font-medium">Medir circunferência abdominal mensalmente</span>
            </li>
          </RefinedCard>
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-orange-100">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
              <span className="font-medium">Comunicar ao médico qualquer efeito colateral persistente</span>
            </li>
          </RefinedCard>
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-orange-100">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
              <span className="font-medium">Não interromper tratamento sem orientação médica</span>
            </li>
          </RefinedCard>
          <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/60 backdrop-blur-sm border-orange-100">
            <li className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg mt-0.5 flex-shrink-0">✓</span>
              <span className="font-medium">Manter acompanhamento médico e nutricional regular</span>
            </li>
          </RefinedCard>
        </ul>
      </RefinedCard>
      
      {/* Aviso de Validação Médica */}
      <RefinedCard variant="subtle" padding="lg" rounded="lg" className="bg-gradient-to-br from-red-50 via-red-50 to-orange-50 border-2 border-red-400 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="text-3xl sm:text-4xl flex-shrink-0 animate-bounce-subtle">⚠️</div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-4 leading-tight">
              Aviso Importante - Validação Médica Obrigatória
            </h3>
            <div className="space-y-4">
              <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-white/80 backdrop-blur-sm border-2 border-red-200">
                <p className="text-sm sm:text-base text-red-900 leading-relaxed font-semibold mb-2">
                  <strong>Este quadro é um rascunho automatizado.</strong>
                </p>
                <p className="text-sm sm:text-base text-red-800 leading-relaxed">
                  A prescrição final (com conferência de dose, exames e interações) será definida exclusivamente por um médico após o pagamento.
                </p>
              </RefinedCard>
              
              <p className="text-sm sm:text-base text-red-800 leading-relaxed">
                Esta pré-prescrição é um <strong className="text-red-900">RASCUNHO</strong> gerado pela IA da Me Joy com base nas suas respostas. 
                Ela será <strong className="text-red-900">SEMPRE revisada, validada e ajustada</strong> por um médico endocrinologista da equipe 
                após a confirmação do pagamento, antes de qualquer prescrição oficial. O médico pode confirmar, ajustar 
                ou modificar este plano conforme sua avaliação individual completa.
              </p>
              
              <RefinedCard variant="subtle" padding="md" rounded="lg" className="bg-red-100/50 border-red-300">
                <p className="text-sm sm:text-base text-red-900 font-bold">
                  ⚖️ Todo uso de medicação é feito somente após avaliação individual e prescrição médica, seguindo as normas da ANVISA.
                </p>
              </RefinedCard>
              
              <p className="text-sm sm:text-base text-red-800 leading-relaxed">
                📱 Após confirmar sua compra, um médico da equipe entrará em contato via WhatsApp para validar este plano antes de qualquer prescrição final.
              </p>
            </div>
          </div>
        </div>
      </RefinedCard>
    </RefinedCard>
    );
  }

