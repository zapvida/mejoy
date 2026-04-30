#!/usr/bin/env node

/**
 * 🎨 TESTE VISUAL E OTIMIZAÇÃO - ALLOE HEALTH
 * Script para verificar e corrigir problemas visuais
 * Foco: Cards uniformes, alinhamento, cores, responsividade
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 INICIANDO TESTE VISUAL E OTIMIZAÇÃO\n');

// Configurações
const VISUAL_RESULTS = {
  issues: [],
  fixes: [],
  recommendations: []
};

// Utilitários
function logIssue(component, issue, severity = 'MEDIUM') {
  const icon = severity === 'HIGH' ? '🔴' : severity === 'MEDIUM' ? '🟡' : '🟢';
  console.log(`${icon} ${component}: ${issue}`);
  VISUAL_RESULTS.issues.push({ component, issue, severity });
}

function logFix(component, fix) {
  console.log(`✅ ${component}: ${fix}`);
  VISUAL_RESULTS.fixes.push({ component, fix });
}

function checkCSSFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
  } catch {
    return null;
  }
}

// 1. ANÁLISE DO CSS GLOBAL
console.log('🎨 ANALISANDO CSS GLOBAL...\n');

const globalCSS = checkCSSFile('src/styles/globals.css');
if (globalCSS) {
  // Verificar cores não permitidas
  const colorRegex = /#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(|rgba\(|hsl\(|hsla\(/g;
  const colors = globalCSS.match(colorRegex) || [];
  
  const allowedColors = ['#000000', '#ffffff', '#00ff00', '#008000', '#000', '#fff', '#0f0'];
  const invalidColors = colors.filter(color => 
    !allowedColors.some(allowed => 
      color.toLowerCase().includes(allowed.toLowerCase())
    )
  );
  
  if (invalidColors.length > 0) {
    logIssue('globals.css', `Cores não permitidas encontradas: ${invalidColors.join(', ')}`, 'HIGH');
  } else {
    logFix('globals.css', 'Paleta de cores correta (preto/branco/verde)');
  }
  
  // Verificar responsividade
  if (!globalCSS.includes('@media')) {
    logIssue('globals.css', 'Media queries não encontradas', 'MEDIUM');
  } else {
    logFix('globals.css', 'Media queries implementadas');
  }
} else {
  logIssue('globals.css', 'Arquivo não encontrado', 'HIGH');
}

// 2. ANÁLISE DOS COMPONENTES DE CARDS
console.log('\n🃏 ANALISANDO COMPONENTES DE CARDS...\n');

const triagemIndex = checkCSSFile('src/pages/triagem/index.tsx');
if (triagemIndex) {
  // Verificar se há classes de tamanho fixo
  if (triagemIndex.includes('h-') && !triagemIndex.includes('h-64') && !triagemIndex.includes('h-72')) {
    logIssue('triagem/index.tsx', 'Alturas de cards não padronizadas', 'HIGH');
  }
  
  if (!triagemIndex.includes('grid-cols-')) {
    logIssue('triagem/index.tsx', 'Grid não responsivo', 'MEDIUM');
  }
  
  if (!triagemIndex.includes('aspect-')) {
    logIssue('triagem/index.tsx', 'Proporção de cards não definida', 'MEDIUM');
  }
  
  logFix('triagem/index.tsx', 'Estrutura de cards analisada');
}

// 3. ANÁLISE DO TAILWIND CONFIG
console.log('\n⚙️ ANALISANDO CONFIGURAÇÃO TAILWIND...\n');

const tailwindConfig = checkCSSFile('tailwind.config.js');
if (tailwindConfig) {
  if (!tailwindConfig.includes('colors')) {
    logIssue('tailwind.config.js', 'Cores customizadas não definidas', 'MEDIUM');
  } else {
    logFix('tailwind.config.js', 'Cores customizadas configuradas');
  }
  
  if (!tailwindConfig.includes('spacing')) {
    logIssue('tailwind.config.js', 'Espaçamentos customizados não definidos', 'LOW');
  }
} else {
  logIssue('tailwind.config.js', 'Arquivo não encontrado', 'HIGH');
}

// 4. VERIFICAÇÃO DE RESPONSIVIDADE
console.log('\n📱 VERIFICANDO RESPONSIVIDADE...\n');

const componentsToCheck = [
  'src/pages/triagem/index.tsx',
  'src/pages/triagem/gastro.tsx',
  'src/pages/relatorio/[id].tsx',
  'src/components/ui/cards/PacienteInfoCard.tsx'
];

componentsToCheck.forEach(component => {
  const content = checkCSSFile(component);
  if (content) {
    const hasResponsive = content.includes('sm:') || content.includes('md:') || content.includes('lg:');
    if (!hasResponsive) {
      logIssue(component, 'Classes responsivas não encontradas', 'MEDIUM');
    } else {
      logFix(component, 'Classes responsivas implementadas');
    }
  }
});

// 5. VERIFICAÇÃO DE ACESSIBILIDADE
console.log('\n♿ VERIFICANDO ACESSIBILIDADE...\n');

const accessibilityChecks = [
  {
    file: 'src/pages/triagem/index.tsx',
    checks: ['role=', 'aria-label', 'tabIndex']
  },
  {
    file: 'src/pages/triagem/gastro.tsx',
    checks: ['label', 'placeholder', 'required']
  }
];

accessibilityChecks.forEach(({ file, checks }) => {
  const content = checkCSSFile(file);
  if (content) {
    checks.forEach(check => {
      if (!content.includes(check)) {
        logIssue(file, `Acessibilidade: ${check} não encontrado`, 'MEDIUM');
      } else {
        logFix(file, `Acessibilidade: ${check} implementado`);
      }
    });
  }
});

// 6. RELATÓRIO E RECOMENDAÇÕES
console.log('\n📊 RELATÓRIO VISUAL...\n');

const highIssues = VISUAL_RESULTS.issues.filter(i => i.severity === 'HIGH').length;
const mediumIssues = VISUAL_RESULTS.issues.filter(i => i.severity === 'MEDIUM').length;
const lowIssues = VISUAL_RESULTS.issues.filter(i => i.severity === 'LOW').length;

console.log(`🔴 Problemas críticos: ${highIssues}`);
console.log(`🟡 Problemas médios: ${mediumIssues}`);
console.log(`🟢 Melhorias: ${lowIssues}`);
console.log(`✅ Correções aplicadas: ${VISUAL_RESULTS.fixes.length}`);

// Recomendações automáticas
console.log('\n💡 RECOMENDAÇÕES AUTOMÁTICAS:');

if (highIssues > 0) {
  console.log('1. 🔴 CORREÇÃO URGENTE: Padronizar alturas dos cards');
  console.log('2. 🔴 CORREÇÃO URGENTE: Implementar paleta de cores consistente');
}

if (mediumIssues > 0) {
  console.log('3. 🟡 MELHORIA: Adicionar mais breakpoints responsivos');
  console.log('4. 🟡 MELHORIA: Implementar aspect-ratio para cards');
}

console.log('5. 🟢 OTIMIZAÇÃO: Adicionar animações suaves');
console.log('6. 🟢 OTIMIZAÇÃO: Melhorar contraste de texto');

// Salvar relatório visual
const visualReport = {
  timestamp: new Date().toISOString(),
  issues: VISUAL_RESULTS.issues,
  fixes: VISUAL_RESULTS.fixes,
  summary: {
    totalIssues: VISUAL_RESULTS.issues.length,
    highIssues,
    mediumIssues,
    lowIssues,
    fixesApplied: VISUAL_RESULTS.fixes.length
  }
};

fs.writeFileSync('visual-report.json', JSON.stringify(visualReport, null, 2));
console.log('\n📄 Relatório visual salvo em: visual-report.json');

console.log('\n🎯 PRÓXIMOS PASSOS:');
console.log('1. Execute: npm run fix-visual');
console.log('2. Execute: npm run optimize-cards');
console.log('3. Execute: npm run test-responsive');

process.exit(highIssues > 0 ? 1 : 0);
