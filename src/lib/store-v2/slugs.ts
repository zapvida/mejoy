/**
 * Normalização de slugs para objetivos e produtos Store V2
 */

export function objectiveToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, '-')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugToObjective(slug: string): string {
  const map: Record<string, string> = {
    sono: 'Sono',
    saude: 'Saúde',
    cabelo: 'Cabelo',
    'emagrecimento-metabolismo': 'Emagrecimento & Metabolismo',
    'ansiedade-humor': 'Ansiedade & Humor',
    articulacoes: 'Articulações',
    'detox-figado': 'Detox & Fígado',
    'energia-performance': 'Energia & Performance',
    'hormonal-libido': 'Hormonal & Libido',
    imunidade: 'Imunidade',
    intestino: 'Intestino',
    'pele-beleza': 'Pele & Beleza',
    'menopausa-tpm': 'Menopausa & TPM',
    lipedema: 'Lipedema',
  };
  return map[slug] ?? slug.replace(/-/g, ' ');
}

export const OBJECTIVES = [
  { slug: 'sono', name: 'Sono', icon: 'moon' },
  { slug: 'saude', name: 'Saúde', icon: 'heart' },
  { slug: 'cabelo', name: 'Cabelo', icon: 'scissors' },
  { slug: 'emagrecimento-metabolismo', name: 'Emagrecimento & Metabolismo', icon: 'activity' },
  { slug: 'ansiedade-humor', name: 'Ansiedade & Humor', icon: 'smile' },
  { slug: 'articulacoes', name: 'Articulações', icon: 'pill' },
  { slug: 'detox-figado', name: 'Detox & Fígado', icon: 'shield' },
  { slug: 'energia-performance', name: 'Energia & Performance', icon: 'zap' },
  { slug: 'hormonal-libido', name: 'Hormonal & Libido', icon: 'heart' },
  { slug: 'imunidade', name: 'Imunidade', icon: 'zap' },
  { slug: 'intestino', name: 'Intestino', icon: 'package' },
  { slug: 'pele-beleza', name: 'Pele & Beleza', icon: 'sparkles' },
  { slug: 'menopausa-tpm', name: 'Menopausa & TPM', icon: 'heart' },
  { slug: 'lipedema', name: 'Lipedema', icon: 'sparkles' },
] as const;
