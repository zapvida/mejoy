'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'O que exatamente entregamos?',
    answer: 'Um relatório em PDF personalizado para cada pessoa, com orientações claras e sua marca. Você pode enviar por WhatsApp ou e-mail.',
  },
  {
    question: 'Preciso de equipe técnica?',
    answer: 'Não. Você personaliza logo, cores e domínio, escolhe seus CTAs e começa em minutos. Sem necessidade de equipe técnica.',
  },
  {
    question: 'Como vejo resultados?',
    answer: 'Acompanhamos volume, conclusão, origem (UTM) e conversão por CTA no painel de métricas. Dashboards exportáveis e em tempo real.',
  },
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim. Sem fidelidade. O histórico de relatórios pode ser exportado antes do cancelamento.',
  },
  {
    question: 'Dá para mensurar campanhas?',
    answer: 'Sim. Dashboards com UTM, exportáveis, por CTA. Volume, conclusão, origem e conversão por CTA.',
  },
  {
    question: 'Integra com WhatsApp/CRM?',
    answer: 'Sim. Integrações nativas e via webhook. WhatsApp/E-mail e conectores para notificações e funis.',
  },
  {
    question: 'Posso começar pequeno?',
    answer: 'Sim. Comece com 1 campanha e evolua sem risco. Há plano inicial com upgrade simples.',
  },
  {
    question: 'Como funciona domínio próprio e wildcard?',
    answer: 'Configure um CNAME apontando para nossa infraestrutura. Suportamos subdomínios ilimitados (ex: triagem.suaclinica.com.br).',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // JSON-LD Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
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
  }, []);

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
          {faqs.map((faq, index) => (
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
                <span>{faq.question}</span>
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
                {faq.answer}
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
