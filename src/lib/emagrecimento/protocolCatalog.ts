export type SupportedProtocolSlug =
  | "emagrecimento"
  | "calvicie"
  | "sono"
  | "ansiedade"
  | "intestino"
  | "figado"
  | "libido-masculina"
  | "menopausa"
  | "articulacoes"
  | "imunidade";

export interface ProtocolExperienceMeta {
  slug: SupportedProtocolSlug;
  title: string;
  tagline: string;
  summary: string;
  badge: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  supported: boolean;
}

export const SUPPORTED_PROTOCOLS: ProtocolExperienceMeta[] = [
  {
    slug: "emagrecimento",
    title: "Emagrecimento",
    tagline: "Regulação metabólica com jornada clínica guiada.",
    summary:
      "Triagem, relatório, tratamento e acompanhamento focados em saciedade, risco cardiometabólico e adesão contínua.",
    badge: "Mais procurado",
    category: "Metabólico",
    imageSrc: "/images/emagrecimento/medvi/hero-main.webp",
    imageAlt: "Paciente em jornada de emagrecimento",
    supported: true,
  },
  {
    slug: "calvicie",
    title: "Calvície",
    tagline: "Leitura clínica para queda, rarefação e cuidado contínuo.",
    summary:
      "Entrada clara para investigar padrão de queda, montar protocolo e organizar manutenção orientada.",
    badge: "Cuidado progressivo",
    category: "Imagem e confiança",
    imageSrc: "/mejoyimagens/mejoy10.jpg",
    imageAlt: "Paciente em cuidado capilar",
    supported: true,
  },
  {
    slug: "sono",
    title: "Sono",
    tagline: "Dormir melhor para recuperar energia, foco e metabolismo.",
    summary:
      "Fluxo para higiene do sono, triagem de risco e plano prático para restaurar rotina e recuperação.",
    badge: "Alta recorrência",
    category: "Recuperação",
    imageSrc: "/images/emagrecimento/medvi/journey-acompanhamento.avif",
    imageAlt: "Paciente em descanso e recuperação",
    supported: true,
  },
  {
    slug: "ansiedade",
    title: "Ansiedade",
    tagline: "Cuidado orientado para reduzir ruído, impulsividade e desgaste.",
    summary:
      "Triagem estruturada para entender impacto emocional, comportamento e próximos passos com clareza.",
    badge: "Bem-estar mental",
    category: "Saúde emocional",
    imageSrc: "/mejoyimagens/mejoy11.jpg",
    imageAlt: "Paciente em momento de cuidado emocional",
    supported: true,
  },
  {
    slug: "intestino",
    title: "Intestino",
    tagline:
      "Ritmo intestinal, microbiota e sintomas digestivos no mesmo raciocínio.",
    summary:
      "Protocolo pensado para desconforto recorrente, hábitos, fibras e sinais que mudam a conduta.",
    badge: "Rotina digestiva",
    category: "Digestivo",
    imageSrc: "/images/emagrecimento/medvi/metabolism-habits.avif",
    imageAlt: "Imagem editorial sobre hábitos e microbiota",
    supported: true,
  },
  {
    slug: "figado",
    title: "Fígado",
    tagline: "Suporte para esteatose, enzimas alteradas e risco metabólico.",
    summary:
      "Leitura inicial para quem precisa organizar peso, glicemia, lipídios e exames no mesmo contexto.",
    badge: "Metabolismo integral",
    category: "Hepatometabólico",
    imageSrc: "/images/emagrecimento/medvi/metabolism-results.avif",
    imageAlt: "Imagem editorial sobre saúde metabólica",
    supported: true,
  },
  {
    slug: "libido-masculina",
    title: "Libido masculina",
    tagline:
      "Energia, desejo, composição corporal e eixo hormonal em uma mesma trilha.",
    summary:
      "Entrada clara para investigar rotina, estresse, sono, peso e possíveis fatores hormonais relacionados.",
    badge: "Performance e vitalidade",
    category: "Saúde do homem",
    imageSrc: "/mejoyimagens/mejoy12.jpg",
    imageAlt: "Paciente em contexto de performance e vitalidade",
    supported: true,
  },
  {
    slug: "menopausa",
    title: "Menopausa",
    tagline:
      "Sintomas, composição corporal e bem-estar com visão longitudinal.",
    summary:
      "Protocolo para organizar ondas de calor, sono, humor, peso e saúde metabólica com linguagem clara.",
    badge: "Saúde da mulher",
    category: "Hormonal",
    imageSrc: "/mejoyimagens/mejoy13.jpg",
    imageAlt: "Paciente em cuidado hormonal feminino",
    supported: true,
  },
  {
    slug: "articulacoes",
    title: "Articulações",
    tagline:
      "Dor, mobilidade e carga corporal tratados como parte da mesma equação.",
    summary:
      "Triagem para entender impacto funcional, movimento e fatores mecânicos que pedem cuidado individualizado.",
    badge: "Movimento sem atrito",
    category: "Mobilidade",
    imageSrc: "/mejoyimagens/mejoy14.jpg",
    imageAlt: "Paciente em mobilidade e recuperação articular",
    supported: true,
  },
  {
    slug: "imunidade",
    title: "Imunidade",
    tagline:
      "Recorrência de sintomas, rotina e base metabólica organizadas com critério.",
    summary:
      "Fluxo para mapear hábitos, sono, recuperação e fatores que afetam resistência e disposição.",
    badge: "Base preventiva",
    category: "Prevenção",
    imageSrc: "/mejoyimagens/mejoy17.jpg",
    imageAlt: "Paciente em contexto de prevenção e imunidade",
    supported: true,
  },
];

export function getSupportedProtocolBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return SUPPORTED_PROTOCOLS.find((item) => item.slug === slug) || null;
}

export function getRelatedProtocols(seedSlug?: string | null, limit = 4) {
  const defaultOrder: SupportedProtocolSlug[] = [
    "sono",
    "intestino",
    "ansiedade",
    "figado",
    "articulacoes",
    "imunidade",
    "menopausa",
    "libido-masculina",
    "calvicie",
  ];

  const maps: Partial<Record<SupportedProtocolSlug, SupportedProtocolSlug[]>> =
    {
      emagrecimento: ["sono", "intestino", "ansiedade", "figado"],
      sono: ["ansiedade", "emagrecimento", "intestino", "imunidade"],
      ansiedade: ["sono", "intestino", "emagrecimento", "imunidade"],
      intestino: ["emagrecimento", "figado", "sono", "ansiedade"],
      figado: ["emagrecimento", "intestino", "sono", "imunidade"],
      menopausa: ["emagrecimento", "sono", "articulacoes", "ansiedade"],
      "libido-masculina": ["emagrecimento", "sono", "ansiedade", "imunidade"],
      articulacoes: ["emagrecimento", "sono", "imunidade", "ansiedade"],
      imunidade: ["sono", "intestino", "emagrecimento", "ansiedade"],
      calvicie: ["sono", "ansiedade", "emagrecimento", "imunidade"],
    };

  const orderedSlugs =
    (seedSlug && maps[seedSlug as SupportedProtocolSlug]) || defaultOrder;

  return orderedSlugs
    .map((slug) => getSupportedProtocolBySlug(slug))
    .filter((item): item is ProtocolExperienceMeta => Boolean(item))
    .slice(0, limit);
}
