// Import dinâmico para evitar problemas de build
let alloeContent: any = {};
let gastroOverlay: any = {};

try {
  alloeContent = require('../../content/pt-BR/zapfarm.json');
} catch (error) {
  console.warn('Arquivo de conteúdo não encontrado, usando fallback');
  alloeContent = {};
}

// BEGIN overlay: microcopy GI → gastrointestinal
try {
  gastroOverlay = require('../../content/pt-BR/overlays/gastro.json');
} catch (error) {
  console.warn('Overlay de microcopy não encontrado, usando conteúdo base');
  gastroOverlay = {};
}
// END overlay

type AnyObj = Record<string, any>;

// Feature flag para controle de rollout
const FF_COPY_OVERHAUL = process.env.NEXT_PUBLIC_COPY_OVERHAUL === '1';

// BEGIN overlay: merge condicional do overlay
function getMergedDict(): AnyObj {
  if (!FF_COPY_OVERHAUL) return alloeContent;
  
  // Merge simples e seguro do overlay
  const merged = { ...alloeContent };
  if (gastroOverlay.hotspots) {
    Object.assign(merged, gastroOverlay.hotspots);
  }
  return merged;
}

const dict = getMergedDict();
// END overlay

function get(obj: AnyObj, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (acc === undefined || acc === null) return undefined;
    
    // Suporte para arrays com índice
    if (key.includes('[') && key.includes(']')) {
      const arrayKey = key.split('[')[0];
      const index = parseInt(key.split('[')[1].split(']')[0]);
      return acc[arrayKey]?.[index];
    }
    
    return acc[key];
  }, obj);
}

export function t(path: string, vars?: Record<string, string | number>): string {
  // Se feature flag desativada, retorna string vazia para evitar quebras
  if (!FF_COPY_OVERHAUL) {
    return '';
  }

  try {
    const val = get(dict, path);
    let out = typeof val === 'string' ? val : (Array.isArray(val) ? val[0] : '');
    
    if (!out) return '';
    
    // Interpolação de variáveis {{var}}
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      }
    }
    
    return out;
  } catch (error) {
    console.warn(`Erro ao carregar tradução para "${path}":`, error);
    return '';
  }
}

// Helper para obter variantes A/B
export function tVariant(path: string, variantIndex: number = 0, vars?: Record<string, string | number>): string {
  const variantPath = `${path}_variants[${variantIndex}]`;
  return t(variantPath, vars) || t(path, vars);
}

// Helper para obter array de strings
export function tArray(path: string, vars?: Record<string, string | number>): string[] {
  try {
    const val = get(dict, path);
    if (Array.isArray(val)) {
      return val.map(item => {
        let str = typeof item === 'string' ? item : String(item);
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
          }
        }
        return str;
      });
    }
    return [];
  } catch (error) {
    console.warn(`Erro ao carregar array de tradução para "${path}":`, error);
    return [];
  }
}

// Helper para verificar se uma chave existe
export function tExists(path: string): boolean {
  try {
    const val = get(dict, path);
    return val !== undefined && val !== null;
  } catch {
    return false;
  }
}

export default t;
