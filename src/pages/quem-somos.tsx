import Head from 'next/head';
import Image from 'next/image';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

export default function QuemSomos() {
  return (
    <>
      <Head>
        <title>Quem Somos | MeJoy</title>
        <meta name="description" content="Conheça a equipe do MeJoy - Médicos, engenheiros e cientistas dedicados à revolução da saúde." />
      </Head>
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <section className="flex flex-col-reverse lg:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
                Quem Somos
              </h1>
              <div className="space-y-6 text-base md:text-lg text-muted-foreground">
                <p>
                  O <span className="text-brand font-bold">MeJoy</span> nasceu com a missão de revolucionar a saúde, trazendo a medicina preditiva, preventiva e de precisão para a vida de milhares de pessoas.
                </p>
                <p>
                  Somos uma plataforma de saúde digital que combina <span className="font-semibold text-white">inteligência artificial</span>, análise de dados, ciência médica e atendimento humano. Nosso propósito é democratizar o acesso à informação de saúde, permitindo que qualquer pessoa compreenda seu corpo, seu metabolismo e seus riscos de maneira clara, científica e personalizada.
                </p>
                <p>
                  Nossa equipe é formada por <span className="text-brand font-semibold">médicos, engenheiros, cientistas de dados e desenvolvedores</span>, apaixonados por transformar a saúde mundial.
                </p>
                <p>
                  Acreditamos que <span className="font-bold text-white">prevenir é o melhor caminho</span>. Por isso, usamos tecnologia de ponta para identificar riscos, gerar planos personalizados e conectar você a profissionais de saúde de forma rápida, eficiente e segura.
                </p>
                <p>
                  Nosso compromisso é com a sua saúde, sua longevidade e sua qualidade de vida.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <Image
                src="/images/familia.png"
                alt="Equipe MeJoy"
                width={600}
                height={450}
                className="rounded-xl shadow-green-lg mx-auto"
              />
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </>
  );
}