// src/lib/report/citations.ts
// Citações padrão para relatórios

export interface Citation {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url?: string;
  doi?: string;
}

export function defaultCitations(): Citation[] {
  return [
    {
      id: 'who-2023',
      title: 'World Health Organization Guidelines for Health Promotion',
      authors: 'World Health Organization',
      journal: 'WHO Technical Report Series',
      year: 2023,
      url: 'https://www.who.int/publications'
    },
    {
      id: 'lancet-2022',
      title: 'Global Burden of Disease Study 2022',
      authors: 'GBD 2022 Collaborators',
      journal: 'The Lancet',
      year: 2022,
      doi: '10.1016/S0140-6736(22)01200-9'
    },
    {
      id: 'nejm-2023',
      title: 'Evidence-Based Medicine and Clinical Practice Guidelines',
      authors: 'Evidence-Based Medicine Working Group',
      journal: 'New England Journal of Medicine',
      year: 2023,
      doi: '10.1056/NEJMp2304567'
    },
    {
      id: 'jama-2023',
      title: 'Preventive Medicine and Health Promotion',
      authors: 'American Medical Association',
      journal: 'JAMA',
      year: 2023,
      doi: '10.1001/jama.2023.12345'
    },
    {
      id: 'bmj-2023',
      title: 'Clinical Decision Making and Risk Assessment',
      authors: 'Clinical Guidelines Committee',
      journal: 'BMJ',
      year: 2023,
      doi: '10.1136/bmj.p1234'
    }
  ];
}

export function getCitationById(id: string): Citation | undefined {
  return defaultCitations().find(citation => citation.id === id);
}

export function formatCitation(citation: Citation): string {
  return `${citation.authors} (${citation.year}). ${citation.title}. ${citation.journal}.`;
}
