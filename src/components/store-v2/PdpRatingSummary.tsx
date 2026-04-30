'use client';

import { Star } from 'lucide-react';
import { formatPtRating, getDeterministicSocialProof } from '@/lib/store-v2/social-proof';

interface PdpRatingSummaryProps {
  rating?: number | null;
  reviewCount?: number;
  productName?: string;
  seedKey?: string;
}

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999';

export default function PdpRatingSummary({ rating, reviewCount = 0, productName, seedKey }: PdpRatingSummaryProps) {
  const hasRating = rating != null && !Number.isNaN(Number(rating)) && reviewCount > 0;
  const socialProof = getDeterministicSocialProof(seedKey || productName || 'mejoy');
  const effectiveRating = hasRating ? Number(rating) : socialProof.rating;
  const effectiveCount = hasRating ? reviewCount : socialProof.reviewCount;

  const feedbackText = productName
    ? `Olá! Gostaria de enviar minha avaliação sobre o produto ${productName}.`
    : 'Olá! Gostaria de enviar meu feedback sobre um produto.';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 text-sm min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 flex-1">
        <div
          className="inline-flex items-center gap-1 shrink-0"
          role="group"
          aria-label={`Avaliação média visual: ${effectiveRating.toFixed(1)} de 5 com ${effectiveCount} avaliações`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(effectiveRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              aria-hidden
            />
          ))}
        </div>
        <span className="text-gray-700 min-w-0 truncate">
          <strong>{formatPtRating(effectiveRating)} de 5</strong> · {effectiveCount}+ avaliações
        </span>
      </div>
      <a
        href={`${WHATSAPP_CTA}?text=${encodeURIComponent(feedbackText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#F97316] hover:text-[#EA580C] underline underline-offset-2 transition-colors sm:ml-auto w-fit"
      >
        Envie sua avaliação
      </a>
    </div>
  );
}
