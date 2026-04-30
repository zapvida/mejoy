export type SocialProof = {
  rating: number;
  reviewCount: number;
};

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return Math.abs(hash >>> 0);
}

export function getDeterministicSocialProof(seedKey: string): SocialProof {
  const seed = hashSeed(seedKey || 'mejoy-social-proof');
  const ratingRaw = 4.6 + (seed % 35) / 100; // 4.60 - 4.94
  const rating = Number(Math.min(4.9, ratingRaw).toFixed(1));
  const reviewCount = 200 + (seed % 451); // 200 - 650
  return { rating, reviewCount };
}

export function formatPtRating(value: number): string {
  return Number(value).toFixed(1).replace('.', ',');
}
