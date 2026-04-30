'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQB2CProps {
  items: FAQItem[];
}

export default function FAQB2C({ items }: FAQB2CProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // JSON-LD Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  useEffect(() => {
    // Injetar JSON-LD no head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    script.id = 'faq-schema';
    
    // Remover script anterior se existir
    const existing = document.getElementById('faq-schema');
    if (existing) existing.remove();
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById('faq-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [items]);

  return (
    <section id="faq" className="py-16 md:py-20 bg-muted/40">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center text-ink mb-8 md:mb-10 leading-tight text-balance"
        >
          Perguntas frequentes
        </motion.h2>

        <div className="space-y-3 md:space-y-4 mb-8">
          {items.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              open={openIndex === index}
              className="card-surface p-5 hover:shadow-lg transition-all duration-300"
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  toggle(index);
                }}
                className="text-ink font-bold cursor-pointer flex items-center justify-between list-none leading-relaxed"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[color:var(--brand-600)] transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </summary>
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: openIndex === index ? 1 : 0,
                  height: openIndex === index ? 'auto' : 0,
                }}
                transition={{ duration: 0.2 }}
                className="text-ink-muted mt-4 text-sm leading-relaxed overflow-hidden"
              >
                {faq.a}
              </motion.p>
            </motion.details>
          ))}
        </div>

        {/* Link LGPD */}
        <div className="text-center">
          <Link
            href="/politicas-lgpd"
            className="text-sm text-ink-muted hover:text-[color:var(--brand-600)] transition-colors underline"
          >
            Ver políticas LGPD
          </Link>
        </div>
      </div>
    </section>
  );
}

