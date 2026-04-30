#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Auditing colors in the project...\n');

// Cores proibidas (exceto brand, background, foreground, muted, border)
const forbiddenColorPatterns = [
  // Paletas Tailwind proibidas
  /(bg|text|border|from|to|via)-(rose|pink|fuchsia|purple|violet|indigo|blue|sky|cyan|teal|emerald|lime|yellow|amber|orange|red|stone|zinc|neutral|slate|gray|grey)-\d{2,3}/g,
  
  // HEX colors proibidos (exceto branco e preto)
  /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/g,
  
  // RGB/HSL literais proibidos
  /rgb\([^)]+\)/g,
  /hsl\([^)]+\)/g,
  
  // Cores específicas proibidas
  /(bg|text|border)-(red|blue|purple|indigo|pink|yellow|orange|cyan|teal|emerald|lime|amber|rose|fuchsia|violet|sky|stone|zinc|neutral|slate|gray|grey)/g
];

// Cores permitidas
const allowedPatterns = [
  /brand-\d{2,3}/,
  /background/,
  /foreground/,
  /muted/,
  /border/,
  /input/,
  /ring/,
  /primary/,
  /success/,
  /destructive/,
  /#000000/,
  /#ffffff/,
  /#fff/,
  /#000/,
  /#00D084/, // Verde Alloe permitido
  /white/,
  /black/
];

function isAllowedColor(match) {
  return allowedPatterns.some(pattern => pattern.test(match));
}

function auditFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    forbiddenColorPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (!isAllowedColor(match)) {
            const lines = content.split('\n');
            const lineNumber = content.substring(0, content.indexOf(match)).split('\n').length;
            issues.push({
              match,
              line: lineNumber,
              file: filePath
            });
          }
        });
      }
    });
    
    return issues;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return [];
  }
}

function findFiles() {
  const extensions = ['.tsx', '.ts', '.jsx', '.js', '.css'];
  const files = [];
  
  function walkDir(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, etc.
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }
  
  walkDir('./src');
  return files;
}

function main() {
  const files = findFiles();
  let totalIssues = 0;
  const allIssues = [];
  
  console.log(`📁 Found ${files.length} files to audit\n`);
  
  files.forEach(file => {
    const issues = auditFile(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      allIssues.push(...issues);
      
      console.log(`❌ ${file}:`);
      issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.match}`);
      });
      console.log('');
    }
  });
  
  if (totalIssues === 0) {
    console.log('✅ No forbidden colors found! All colors are compliant with the PB + Brand palette.');
  } else {
    console.log(`\n🚨 Found ${totalIssues} forbidden color usage(s) across ${allIssues.length} files.`);
    console.log('\n📋 Summary of forbidden patterns:');
    
    const patternCounts = {};
    allIssues.forEach(issue => {
      const pattern = issue.match;
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });
    
    Object.entries(patternCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([pattern, count]) => {
        console.log(`   ${pattern}: ${count} occurrences`);
      });
    
    console.log('\n💡 To fix these issues:');
    console.log('   1. Replace forbidden colors with brand tokens (brand-500, brand-600, etc.)');
    console.log('   2. Use background, foreground, muted, border for neutral colors');
    console.log('   3. Only use #000000, #ffffff, white, black for pure black/white');
    
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { auditFile, findFiles, forbiddenColorPatterns, allowedPatterns };