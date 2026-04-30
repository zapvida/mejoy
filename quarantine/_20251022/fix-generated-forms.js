#!/usr/bin/env node

// scripts/fix-generated-forms.js
// Corrige erros de sintaxe nos formulários gerados

import fs from 'fs';
import path from 'path';

console.log('🔧 Corrigindo erros de sintaxe nos formulários gerados...');

const formsDir = path.join(process.cwd(), 'src/forms');
const configsDir = path.join(process.cwd(), 'src/features/triage/configs');

// Lista de arquivos gerados
const generatedFiles = [
  'cardiovascular.ts', 'diabetes-metabolismo.ts', 'dor-cronica.ts', 'coluna.ts',
  'respiratoria.ts', 'renal.ts', 'hepatica.ts', 'mulher.ts', 'prostata.ts',
  'tireoide.ts', 'mama.ts', 'ocular.ts', 'auditiva.ts', 'pele.ts', 'alergias.ts',
  'sexual.ts', 'idoso.ts', 'bucal.ts', 'crianca.ts', 'trabalhador.ts',
  'longevidade.ts', 'vitalidade.ts', 'microbioma.ts', 'micronutrientes.ts', 'biohacking.ts'
];

// Corrigir formulários
for (const file of generatedFiles) {
  const filePath = path.join(formsDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corrigir vírgula faltante após red flags
    content = content.replace(/( {2}}\n\n {2}\/\/ Histórico e fatores de risco)/g, '  },\n\n  // Histórico e fatores de risco');
    
    // Corrigir vírgula faltante após estilo de vida
    content = content.replace(/( {2}}\n\n {2}\/\/ Impacto e objetivos)/g, '  },\n\n  // Impacto e objetivos');
    
    // Corrigir vírgula faltante após objetivos
    content = content.replace(/( {2}}\n\n {2}\/\/ Consentimento)/g, '  },\n\n  // Consentimento');
    
    // Corrigir vírgula faltante após consentimento
    content = content.replace(/( {2}}\n];)/g, '  }\n];');
    
    fs.writeFileSync(filePath, content);
    console.log(`📝 Corrigindo formulário: ${file}`);
  }
}

// Corrigir configurações
for (const file of generatedFiles) {
  const filePath = path.join(configsDir, file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Corrigir imports que podem estar causando problemas
    content = content.replace(/import.*from.*ctas.*;/g, '');
    content = content.replace(/import.*from.*emojis.*;/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`📝 Corrigindo configuração: ${file}`);
  }
}

console.log('✅ Correções aplicadas!');
