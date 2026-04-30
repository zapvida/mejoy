'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import Seo from '@/components/Seo';
import Navbar from '@/components/layout/Navbar';
import HeroB2C from '@/components/home/HeroB2C';
import ProductsSection from '@/components/home/ProductsSection';
import BenefitsB2C from '@/components/home/BenefitsB2C';
import StepsB2C from '@/components/home/StepsB2C';
import CasesB2C from '@/components/home/CasesB2C';
import ResourcesB2C from '@/components/home/ResourcesB2C';
import FAQB2C from '@/components/home/FAQB2C';
import FooterB2C from '@/components/home/FooterB2C';
import StickyBarB2C from '@/components/home/StickyBarB2C';
import { Loading } from '@/components/ui/feedback';
import { faqJsonLd, orgJsonLd, websiteJsonLd, SITE } from '@/lib/seo';

// FAQ adaptado para e-commerce
const faqData = [
  {
    q: 'O que exatamente estou comprando na Me Joy?',
    a: 'Você está comprando protocolos de saúde prontos, formados por combinações de produtos pensados para um objetivo específico (como emagrecimento, sono, intestino, imunidade, cabelos, etc.). Em cada página explicamos o que inclui, como usar e quais são os cuidados.',
  },
  {
    q: 'Preciso de receita médica para comprar?',
    a: 'Trabalhamos apenas com produtos e protocolos que não exigem receita médica. Ainda assim, recomendamos sempre manter acompanhamento com seu médico, principalmente se você usa medicamentos contínuos ou tem doenças crônicas.',
  },
  {
    q: 'Vocês enviam para todo o Brasil?',
    a: 'Sim, enviamos para grande parte do Brasil por transportadoras e Correios. O prazo e o valor do frete aparecem na etapa de checkout, de acordo com o seu CEP.',
  },
  {
    q: 'Quem é o responsável técnico pelos protocolos?',
    a: 'Os protocolos são desenhados e revisados por médico com experiência em medicina integrativa e nutrologia, em conjunto com profissionais de farmácia parceiros. Todas as recomendações respeitam os limites de suplementos e produtos sem prescrição.',
  },
  {
    q: 'Posso usar os protocolos junto com meus remédios atuais?',
    a: 'Muitos protocolos podem ser usados em conjunto com tratamentos já em andamento, mas isso precisa ser avaliado caso a caso. Se você usa medicamentos contínuos, gestante ou lactante, fale com seu médico ou agende uma consulta online pelo ZapVida antes de iniciar.',
  },
  {
    q: 'E se eu não me adaptar ao protocolo?',
    a: 'Se surgir qualquer efeito indesejado, pare o uso e procure atendimento médico. Em caso de dúvidas sobre troca, readequação de protocolo ou suporte, nosso time atende pelo WhatsApp e por e-mail nos canais oficiais informados no site.',
  },
];

export default function RemediosPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Verifica se o usuário já está logado (tem session no cookie)
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      // Se já está logado, redireciona para o dashboard
      router.push('/dashboard');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  const faqSchema = faqJsonLd(faqData.map(item => ({
    question: item.q,
    answer: item.a
  })));

  return (
    <>
      <Seo
        title="Protocolos de Saúde com Curadoria Médica | Emagrecimento, Sono, Cabelos e Mais | Me Joy"
        description="Compre protocolos de saúde prontos com produtos manipulados e suplementos selecionados por médicos. Emagrecimento, sono, cabelos, intestino, fígado, imunidade, libido, menopausa, articulações e ansiedade. Entrega em todo Brasil. Check-up gratuito."
        path="/remedios"
        keywords={[
          'protocolos de saúde',
          'produtos manipulados',
          'suplementos médicos',
          'emagrecimento',
          'tratamento online',
          'medicina integrativa',
          'saúde preventiva',
          'check-up gratuito',
          'produtos farmacêuticos',
          'protocolo médico'
        ]}
        ogImage={`${process.env.NEXT_PUBLIC_BASE_URL || SITE.baseUrl}/og-default.png`}
        jsonLd={[
          orgJsonLd(),
          websiteJsonLd(),
          {
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            "name": "Me Joy",
            "description": "Protocolos de saúde prontos com produtos manipulados e suplementos selecionados por médicos especialistas. Tratamentos personalizados para emagrecimento, sono, cabelos, intestino, fígado, imunidade, libido, menopausa, articulações e ansiedade.",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || SITE.baseUrl}/remedios`,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "BRL",
              "lowPrice": "139",
              "highPrice": "5898",
              "offerCount": "10"
            }
          },
          faqSchema
        ]}
      />
      
      <Head>
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
        <link rel="canonical" href="https://zapfarm.com.br/remedios" />
      </Head>

      {isCheckingAuth ? (
        <div className="min-h-screen bg-aurora-light flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <main
          data-lpac="vibrant"
          className="relative min-h-screen bg-bg pb-safe"
        >
          <Navbar />

          {/* Seções na ordem otimizada - mantendo layout original */}
          <HeroB2C />
          <ProductsSection />
          <BenefitsB2C />
          <StepsB2C />
          <CasesB2C />
          <ResourcesB2C />
          <FAQB2C items={faqData} />
          <FooterB2C />

          {/* Sticky CTA Mobile - apenas mobile */}
          <StickyBarB2C />
        </main>
      )}
    </>
  );
}

