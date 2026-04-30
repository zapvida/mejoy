export interface LPACContent {
  hero: {
    title: string;
    subtitle: string;
    bullets: string[];
    cta: string;
    cta_microcopy: string;
    trustline: string;
  };
  steps: {
    title: string;
    items: Array<{
      title: string;
      desc: string;
    }>;
  };
  benefits: {
    title: string;
    cards: Array<{
      title: string;
      desc: string;
    }>;
  };
  why: {
    title: string;
    subtitle: string;
    mission: string[];
    vision: string[];
  };
  social: {
    title: string;
    subtitle: string;
    quotes: string[];
  };
  authority: {
    title: string;
    desc: string;
  };
  security: {
    title: string;
    lead: string;
  };
  faq: Array<{
    q: string;
    a: string;
  }>;
  cta_final: {
    title: string;
    subtitle: string;
    cta: string;
  };
  footer: {
    value: string;
    disclaimer: string;
  };
  anchors: string[];
}
