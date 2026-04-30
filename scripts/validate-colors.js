#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating color system consistency...\n');

// Cores permitidas
const ALLOWED_COLORS = [
  'brand', 'background', 'foreground', 'muted', 'border', 'input', 'ring',
  'primary', 'accent', 'success', 'destructive', 'white', 'black',
  '#000000', '#ffffff', '#00C853', 'white', 'black'
];

// Cores proibidas (exceto em contexto de erro/risco)
const FORBIDDEN_COLORS = [
  'rose', 'pink', 'fuchsia', 'purple', 'violet', 'indigo', 'blue', 'sky', 'cyan',
  'teal', 'emerald', 'lime', 'yellow', 'amber', 'orange', 'red', 'stone', 'zinc',
  'neutral', 'slate', 'gray', 'grey'
];

// Padrões proibidos (excluindo branco/preto)
const FORBIDDEN_PATTERNS = [
  /(bg|text|border|from|to|via)-(rose|pink|fuchsia)-\d{2,3}/g,
  /from-(rose|pink|fuchsia)-\d{2,3}/g,
  /to-(rose|pink|fuchsia)-\d{2,3}/g,
  /#[fF][0-9a-fA-F]{5}(?![0-9a-fA-F])/g, // HEX rosa (não branco)
  /#[eE][0-9a-fA-F]{5}(?![0-9a-fA-F])/g, // HEX rosa claro (não branco)
];

// Cores permitidas (branco/preto/brand + cores específicas necessárias)
const ALLOWED_HEX = [
  '#000000', '#ffffff', '#fff', '#000', '#00C853',
  '#F9FAFB', // Cinza muito claro para componentes admin
  '#F59E0B'  // Âmbar para warnings (necessário)
];

function validateBrandConsistency() {
  console.log('🎨 Checking brand color consistency...');
  
  const brandFiles = [
    'src/theme/palette.ts',
    'src/theme/mobile.ts',
    'scripts/brand-color.json',
    'src/styles/globals.css'
  ];
  
  let allConsistent = true;
  
  brandFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Verificar se contém #00C853 ou HSL equivalente
    if (content.includes('#00C853') || content.includes('158 100% 40%')) {
      console.log(`✅ ${file}: Brand color consistent`);
    } else if (content.includes('#00D084') || content.includes('158 100% 41%')) {
      console.log(`❌ ${file}: Brand color inconsistent (still using old values)`);
      allConsistent = false;
    } else {
      console.log(`⚠️  ${file}: No brand color found`);
    }
  });
  
  return allConsistent;
}

function validateForbiddenColors() {
  console.log('\n🚫 Checking for forbidden colors...');
  
  const files = findFiles('src', ['.tsx', '.ts', '.jsx', '.js']);
  let violations = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    FORBIDDEN_PATTERNS.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // Verificar se não é contexto de erro/risco
          const lines = content.split('\n');
          const lineIndex = content.substring(0, content.indexOf(match)).split('\n').length;
          const line = lines[lineIndex - 1] || '';
          
          // Verificar se é cor permitida (branco/preto/brand)
          if (ALLOWED_HEX.some(allowed => match.toLowerCase().includes(allowed.toLowerCase()))) {
            return; // Pular cores permitidas
          }
          
          if (!line.match(/danger|error|critical|risk|status|high.*risk|alert.*danger/i)) {
            console.log(`❌ ${file}:${lineIndex} - ${match}`);
            violations++;
          }
        });
      }
    });
  });
  
  if (violations === 0) {
    console.log('✅ No forbidden colors found');
    return true;
  } else {
    console.log(`❌ Found ${violations} violations`);
    return false;
  }
}

function validateAuroraBackground() {
  console.log('\n🌌 Checking aurora background implementation...');
  
  const globalsCss = fs.readFileSync('src/styles/globals.css', 'utf8');
  
  if (globalsCss.includes('.bg-aurora-dark')) {
    console.log('✅ Aurora background class defined');
  } else {
    console.log('❌ Aurora background class not found');
    return false;
  }
  
  const loggedLayout = fs.readFileSync('src/components/layout/LoggedLayout.tsx', 'utf8');
  const mobileLayout = fs.readFileSync('src/components/layout/MobileLayout.tsx', 'utf8');
  
  if (loggedLayout.includes('bg-aurora-dark') && mobileLayout.includes('bg-aurora-dark')) {
    console.log('✅ Aurora background applied to layouts');
    return true;
  } else {
    console.log('❌ Aurora background not applied to layouts');
    return false;
  }
}

function validateBuild() {
  console.log('\n🔨 Testing build...');
  
  try {
    // Usar gtimeout no macOS ou timeout no Linux
    const timeoutCmd = process.platform === 'darwin' ? 'gtimeout' : 'timeout';
    execSync(`${timeoutCmd} 60 npm run build`, { stdio: 'pipe' });
    console.log('✅ Build successful');
    return true;
  } catch (error) {
    // Se timeout não disponível, tentar build normal
    if (error.message.includes('timeout') || error.message.includes('gtimeout')) {
      try {
        execSync('npm run build', { stdio: 'pipe' });
        console.log('✅ Build successful');
        return true;
      } catch (buildError) {
        console.log('❌ Build failed');
        return false;
      }
    }
    console.log('❌ Build failed');
    console.log(error.stdout?.toString() || error.message);
    return false;
  }
}

function findFiles(dir, extensions) {
  const files = [];
  
  function walkDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          walkDir(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }
  
  walkDir(dir);
  return files;
}

function main() {
  const results = {
    brandConsistency: validateBrandConsistency(),
    noForbiddenColors: validateForbiddenColors(),
    auroraBackground: validateAuroraBackground(),
    buildSuccess: validateBuild()
  };
  
  console.log('\n📊 Validation Results:');
  console.log(`🎨 Brand Consistency: ${results.brandConsistency ? '✅' : '❌'}`);
  console.log(`🚫 No Forbidden Colors: ${results.noForbiddenColors ? '✅' : '❌'}`);
  console.log(`🌌 Aurora Background: ${results.auroraBackground ? '✅' : '❌'}`);
  console.log(`🔨 Build Success: ${results.buildSuccess ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(Boolean);
  
  if (allPassed) {
    console.log('\n🎉 All validations passed! Color system is ready.');
    process.exit(0);
  } else {
    console.log('\n❌ Some validations failed. Please fix the issues above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateBrandConsistency, validateForbiddenColors, validateAuroraBackground, validateBuild };
