// Script de teste para validação da classificação GLP-1 em emagrecimento
// Executar com: npx tsx scripts/test-emagrecimento-classification.ts

interface TestCase {
  name: string;
  answers: Record<string, any>;
  expectedClassification: 'contraindicado' | 'candidato_glp1' | 'nao_indicado';
  description: string;
}

function calculateIMC(peso: number, altura: number): number {
  const alturaM = altura / 100;
  return Math.round((peso / (alturaM * alturaM)) * 10) / 10;
}

function classifyGLP1(
  imc: number | null,
  comorbidades: string[],
  contraindicacoes: string[],
  gestacao: boolean
): 'contraindicado' | 'candidato_glp1' | 'nao_indicado' {
  const temContraindicacao = contraindicacoes.length > 0 || gestacao;
  
  if (temContraindicacao) {
    return 'contraindicado';
  }
  
  if (imc && (imc >= 30 || (imc >= 27 && comorbidades.length > 0))) {
    return 'candidato_glp1';
  }
  
  return 'nao_indicado';
}

const testCases: TestCase[] = [
  {
    name: 'Caso A - Candidato a GLP-1',
    description: 'IMC ≥32, com comorbidades, sem contraindicações',
    answers: {
      altura: 170,
      peso: 95,
      comorbidades: ['diabetes_tipo_2', 'hipertensao'],
      contraindicacoes_glp1: ['nenhuma'],
      gestacao: 'nao',
      impacto_vida: 'muito',
      objetivo_principal: 'ambos',
      preferencia_principio_ativo: 'tirzepatida'
    },
    expectedClassification: 'candidato_glp1'
  },
  {
    name: 'Caso B - Não indicado',
    description: 'IMC 24-26, sem comorbidades, sem contraindicações',
    answers: {
      altura: 170,
      peso: 75,
      comorbidades: ['nenhuma'],
      contraindicacoes_glp1: ['nenhuma'],
      gestacao: 'nao',
      impacto_vida: 'pouco',
      objetivo_principal: 'perder_peso',
      preferencia_principio_ativo: 'nao_sei'
    },
    expectedClassification: 'nao_indicado'
  },
  {
    name: 'Caso C - Contraindicado (Pancreatite)',
    description: 'IMC 30, com comorbidades, mas com pancreatite',
    answers: {
      altura: 170,
      peso: 87,
      comorbidades: ['diabetes_tipo_2'],
      contraindicacoes_glp1: ['pancreatite'],
      gestacao: 'nao',
      impacto_vida: 'moderado',
      objetivo_principal: 'melhorar_saude_metabolica',
      preferencia_principio_ativo: 'semaglutida'
    },
    expectedClassification: 'contraindicado'
  },
  {
    name: 'Caso D - Contraindicado (Gestação)',
    description: 'IMC 30, mas gestante',
    answers: {
      altura: 165,
      peso: 82,
      comorbidades: ['hipertensao'],
      contraindicacoes_glp1: ['nenhuma'],
      gestacao: 'sim',
      impacto_vida: 'muito',
      objetivo_principal: 'perder_peso',
      preferencia_principio_ativo: 'nao_sei'
    },
    expectedClassification: 'contraindicado'
  },
  {
    name: 'Caso E - Candidato (IMC 27 + Comorbidade)',
    description: 'IMC 27 com comorbidade, sem contraindicações',
    answers: {
      altura: 170,
      peso: 78,
      comorbidades: ['pre_diabetes'],
      contraindicacoes_glp1: ['nenhuma'],
      gestacao: 'nao',
      impacto_vida: 'moderado',
      objetivo_principal: 'melhorar_saude_metabolica',
      preferencia_principio_ativo: 'semaglutida'
    },
    expectedClassification: 'candidato_glp1'
  }
];

console.log('🧪 TESTES DE CLASSIFICAÇÃO GLP-1 - EMAGRECIMENTO\n');
console.log('='.repeat(80));

let passed = 0;
let failed = 0;

for (const testCase of testCases) {
  console.log(`\n📋 ${testCase.name}`);
  console.log(`   Descrição: ${testCase.description}`);
  
  const altura = testCase.answers.altura;
  const peso = testCase.answers.peso;
  const imc = calculateIMC(peso, altura);
  
  const comorbidades = Array.isArray(testCase.answers.comorbidades)
    ? testCase.answers.comorbidades.filter((c: string) => c !== 'nenhuma')
    : [];
  
  const contraindicacoes = Array.isArray(testCase.answers.contraindicacoes_glp1)
    ? testCase.answers.contraindicacoes_glp1.filter((c: string) => c !== 'nenhuma')
    : [];
  
  const gestacao = testCase.answers.gestacao === 'sim' || testCase.answers.gestacao === 'planejando';
  
  const classification = classifyGLP1(imc, comorbidades, contraindicacoes, gestacao);
  
  console.log(`   IMC: ${imc} kg/m²`);
  console.log(`   Comorbidades: ${comorbidades.length > 0 ? comorbidades.join(', ') : 'Nenhuma'}`);
  console.log(`   Contraindicações: ${contraindicacoes.length > 0 ? contraindicacoes.join(', ') : 'Nenhuma'}`);
  console.log(`   Gestação: ${gestacao ? 'Sim' : 'Não'}`);
  console.log(`   Classificação esperada: ${testCase.expectedClassification}`);
  console.log(`   Classificação obtida: ${classification}`);
  
  if (classification === testCase.expectedClassification) {
    console.log(`   ✅ PASSOU`);
    passed++;
  } else {
    console.log(`   ❌ FALHOU`);
    failed++;
  }
}

console.log('\n' + '='.repeat(80));
console.log(`\n📊 RESULTADO FINAL:`);
console.log(`   ✅ Passou: ${passed}/${testCases.length}`);
console.log(`   ❌ Falhou: ${failed}/${testCases.length}`);

if (failed === 0) {
  console.log(`\n🎉 Todos os testes passaram!`);
  process.exit(0);
} else {
  console.log(`\n⚠️  Alguns testes falharam. Revise a lógica de classificação.`);
  process.exit(1);
}

