/**
 * ProductReviews — bloco de prova social visual sem nomes/depoimentos.
 * Mantém CTA de coleta real via WhatsApp.
 */
import { Star } from 'lucide-react';
import { formatPtRating, getDeterministicSocialProof } from '@/lib/store-v2/social-proof';

const WHATSAPP_CTA = process.env.NEXT_PUBLIC_WHATSAPP_CTA ?? 'https://wa.me/5511999999999';

type Props = {
  productName?: string;
  rating?: number | null;
  reviewCount?: number;
  seedKey?: string;
};

export default function ProductReviews({ productName, rating, reviewCount = 0, seedKey }: Props) {
  const hasRealRating = rating != null && !Number.isNaN(Number(rating)) && reviewCount > 0;
  const socialProof = getDeterministicSocialProof(seedKey || productName || 'mejoy');
  const effectiveRating = hasRealRating ? Number(rating) : socialProof.rating;
  const effectiveCount = hasRealRating ? reviewCount : socialProof.reviewCount;

  const feedbackText = productName
    ? `Olá! Gostaria de enviar minha avaliação sobre o produto ${productName}.`
    : 'Olá! Gostaria de enviar meu feedback sobre um produto.';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação média do produto</h3>
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <div className="inline-flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(effectiveRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
              aria-hidden
            />
          ))}
        </div>
        <p className="text-gray-700 text-sm">
          <strong>{formatPtRating(effectiveRating)} de 5</strong> · {effectiveCount}+ avaliações
        </p>
      </div>
      <p className="text-gray-500 text-xs mb-4">
        Indicador visual de satisfação para navegação da página. Comentários públicos por cliente serão exibidos conforme entrada real.
      </p>
      <p className="text-gray-600 text-sm mb-4">Quer contribuir com sua experiência? Envie sua avaliação.</p>
      <a
        href={`${WHATSAPP_CTA}?text=${encodeURIComponent(feedbackText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-[#EA580C] transition-colors"
      >
        Envie seu feedback
      </a>
    </div>
  );
}
