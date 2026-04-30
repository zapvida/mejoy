import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductCardData } from '@/lib/store-v2/catalog';

interface Section {
  objectiveSlug: string;
  objectiveName: string;
  products: ProductCardData[];
}

interface ObjectiveSectionsProps {
  sections: Section[];
}

export default function ObjectiveSections({ sections }: ObjectiveSectionsProps) {
  return (
    <div className="space-y-16">
      {sections.map((section) => (
        <section key={section.objectiveSlug}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{section.objectiveName}</h2>
            <Link
              href={`/c/${section.objectiveSlug}`}
              className="inline-flex items-center gap-2 text-brand font-medium hover:text-brand-600 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {section.products.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                shortName={p.shortName}
                shortBenefit={p.shortBenefit}
                homeBenefitStyle
                priceCents={p.priceCents}
                compareAtCents={p.compareAtCents}
                image={p.image}
                badges={p.badges}
                rating={p.rating}
                formDisplay={p.formDisplay}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
