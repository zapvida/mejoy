#!/usr/bin/env node
// scripts/fix-lint-errors.js
// Script para corrigir erros de linting comuns

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

// Padrões de correção
const fixes = [
  // Remover parâmetros não utilizados em funções
  {
    pattern: /function (\w+)\([^)]*?(\w+)[^)]*?\): [^{]*{/g,
    replacement: (match, funcName, param) => {
      // Se o parâmetro não é usado no corpo da função, removê-lo
      return match.replace(new RegExp(`\\b${param}\\b`, 'g'), '_');
    }
  },
  // Adicionar underscore para parâmetros não utilizados
  {
    pattern: /(\w+): [^,)]+/g,
    replacement: (match, param) => {
      if (param.startsWith('_')) return match;
      return match.replace(param, `_${param}`);
    }
  }
];

async function fixLintErrors() {
  console.log('🔧 Corrigindo erros de linting...');
  
  // Buscar arquivos de configuração das triagens
  const configFiles = await glob('src/features/triage/configs/*.ts');
  
  for (const file of configFiles) {
    console.log(`📝 Corrigindo ${file}`);
    
    let content = readFileSync(file, 'utf8');
    
    // Aplicar correções específicas
    content = content.replace(/function generateDetailedAnalysis\(answers: Record<string, any>\): string {/g, 
      'function generateDetailedAnalysis(_answers: Record<string, any>): string {');
    
    content = content.replace(/function generateRiskAssessment\(answers: Record<string, any>, riskLevel: string\): string {/g, 
      'function generateRiskAssessment(_answers: Record<string, any>, riskLevel: string): string {');
    
    content = content.replace(/function generatePillars\(slug: string\): string\[\] {/g, 
      'function generatePillars(_slug: string): string[] {');
    
    content = content.replace(/function generateQuickWins\(answers: Record<string, any>, slug: string\): string\[\] {/g, 
      'function generateQuickWins(answers: Record<string, any>, _slug: string): string[] {');
    
    content = content.replace(/function generateWeeklyGoal\(slug: string\): string {/g, 
      'function generateWeeklyGoal(_slug: string): string {');
    
    content = content.replace(/function generateAlertSignals\(answers: Record<string, any>, slug: string\): string\[\] {/g, 
      'function generateAlertSignals(answers: Record<string, any>, _slug: string): string[] {');
    
    content = content.replace(/function generatePreventiveExams\(slug: string, age: number, sex: string\): any\[\] {/g, 
      'function generatePreventiveExams(slug: string, age: number, _sex: string): any[] {');
    
    content = content.replace(/function generateGrocery\(slug: string\): any\[\] {/g, 
      'function generateGrocery(_slug: string): any[] {');
    
    content = content.replace(/function generateTimeline\(slug: string\): any\[\] {/g, 
      'function generateTimeline(_slug: string): any[] {');
    
    writeFileSync(file, content);
  }
  
  console.log('✅ Correções aplicadas!');
}

fixLintErrors().catch(console.error);
