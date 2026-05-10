import { EMAGRECIMENTO_PROTOCOL_ASSETS } from "@/lib/emagrecimento-lp-assets";

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
  science: {
    evidenceLevel: "forte" | "moderada" | "emergente";
    reviewedAt: string;
    clinicalOwner: string;
    visibility: "patient-safe" | "doctor-only";
    sourceLine: string;
    scienceSummary: string;
  };
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
    imageSrc: EMAGRECIMENTO_PROTOCOL_ASSETS.emagrecimentoHero,
    imageAlt: "Paciente em jornada de emagrecimento",
    supported: true,
    science: {
      evidenceLevel: "forte",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "WHO, CFM, SBEM e sociedades de risco cardiometabolico.",
      scienceSummary:
        "Baseado em manejo clinico de obesidade, adesao, risco cardiometabolico e mudanca de estilo de vida com revisao humana.",
    },
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
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "Dermatologia clinica, sociedades de cabelo e revisao medica.",
      scienceSummary:
        "Entrada guiada para sinais de alopecia, inflamacao, rotina capilar e necessidade de investigacao medica.",
    },
  },
  {
    slug: "sono",
    title: "Sono",
    tagline: "Dormir melhor para recuperar energia, foco e metabolismo.",
    summary:
      "Fluxo para higiene do sono, triagem de risco e plano prático para restaurar rotina e recuperação.",
    badge: "Alta recorrência",
    category: "Recuperação",
    imageSrc: EMAGRECIMENTO_PROTOCOL_ASSETS.journeyAcompanhamento,
    imageAlt: "Paciente em descanso e recuperação",
    supported: true,
    science: {
      evidenceLevel: "forte",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "WHO, higiene do sono, medicina do estilo de vida e revisao clinica.",
      scienceSummary:
        "Triagem estruturada para sono, rotina, risco de apneia e impacto em energia, humor e metabolismo.",
    },
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
    science: {
      evidenceLevel: "forte",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "WHO mental health at work, psiquiatria e psicologia baseadas em evidencia.",
      scienceSummary:
        "Organiza sintomas, impacto funcional e proxima melhor acao com suporte clinico responsavel e sem promessas vazias.",
    },
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
    imageSrc: EMAGRECIMENTO_PROTOCOL_ASSETS.metabolicHabits,
    imageAlt: "Imagem editorial sobre hábitos e microbiota",
    supported: true,
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "Gastroenterologia clinica, dieta, fibra e revisao medica.",
      scienceSummary:
        "Roteiro para sintomas digestivos recorrentes, habitos e sinais que mudam a necessidade de consulta e exame.",
    },
  },
  {
    slug: "figado",
    title: "Fígado",
    tagline: "Suporte para esteatose, enzimas alteradas e risco metabólico.",
    summary:
      "Leitura inicial para quem precisa organizar peso, glicemia, lipídios e exames no mesmo contexto.",
    badge: "Metabolismo integral",
    category: "Hepatometabólico",
    imageSrc: EMAGRECIMENTO_PROTOCOL_ASSETS.metabolicResults,
    imageAlt: "Imagem editorial sobre saúde metabólica",
    supported: true,
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "Hepatologia, obesidade, glicemia, lipideos e revisao clinica.",
      scienceSummary:
        "Ajuda a conectar esteatose, peso, glicemia e laboratorio no mesmo raciocinio clinico longitudinal.",
    },
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
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "Endocrinologia, medicina do sono e saude do homem.",
      scienceSummary:
        "Avalia energia, peso, desejo, sono e estresse antes de qualquer promessa comercial ou hormonal.",
    },
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
    science: {
      evidenceLevel: "forte",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "FEBRASGO, climatério, sono, metabolismo e revisao clinica.",
      scienceSummary:
        "Entrada estruturada para sintomas do climatério com leitura conjunta de sono, humor, peso e composicao corporal.",
    },
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
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "Ortopedia, reabilitacao, carga mecanica e revisao medica.",
      scienceSummary:
        "Ajuda a diferenciar dor, mobilidade, carga corporal e sinais que pedem avaliacao medica mais rapida.",
    },
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
    science: {
      evidenceLevel: "moderada",
      reviewedAt: "2026-05-09",
      clinicalOwner: "Time clinico TecMed",
      visibility: "patient-safe",
      sourceLine: "WHO healthy diet, sono, recuperacao e revisao clinica.",
      scienceSummary:
        "Mapeia sono, rotina, estresse e base metabolica antes de sugerir qualquer caminho de suporte.",
    },
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
