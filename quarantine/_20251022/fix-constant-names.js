#!/usr/bin/env node

// scripts/fix-constant-names.js
// Corrige nomes de constantes com hífens

import fs from 'fs';
import path from 'path';

console.log('🔧 Corrigindo nomes de constantes...');

const formsDir = path.join(process.cwd(), 'src/forms');

// Mapeamento de slugs para nomes de constantes válidos
const constantNames = {
  'diabetes-metabolismo': 'perguntasDiabetesMetabolismo',
  'dor-cronica': 'perguntasDorCronica',
  'cardiovascular': 'perguntasCardiovascular',
  'respiratoria': 'perguntasRespiratoria',
  'hepatica': 'perguntasHepatica',
  'prostata': 'perguntasProstata',
  'tireoide': 'perguntasTireoide',
  'auditiva': 'perguntasAuditiva',
  'alergias': 'perguntasAlergias',
  'sexual': 'perguntasSexual',
  'bucal': 'perguntasBucal',
  'crianca': 'perguntasCrianca',
  'trabalhador': 'perguntasTrabalhador',
  'longevidade': 'perguntasLongevidade',
  'vitalidade': 'perguntasVitalidade',
  'microbioma': 'perguntasMicrobioma',
  'micronutrientes': 'perguntasMicronutrientes',
  'biohacking': 'perguntasBiohacking'
};

// Corrigir cada arquivo
for (const [slug, constantName] of Object.entries(constantNames)) {
  const filePath = path.join(formsDir, `${slug}.ts`);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir nome da constante
    const oldPattern = new RegExp(`export const perguntas${slug.replace(/-/g, '')}: Step\\[\\]`, 'g');
    content = content.replace(oldPattern, `export const ${constantName}: Step[]`);
    
    fs.writeFileSync(filePath, content);
    console.log(`📝 Corrigindo: ${slug} -> ${constantName}`);
  }
}

console.log('✅ Nomes de constantes corrigidos!');
