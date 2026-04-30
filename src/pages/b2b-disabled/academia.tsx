'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiActivity } from 'react-icons/fi';

import Particulas from '@/components/landing/Particles';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/buttons';


export default function Home() {
  const router = useRouter();
  const handleTriagem = () => router.push('/triagem');
  // removido pois não está em uso


  const etapas = [
    { icon: '🩺', title: 'Inicie sua triagem', desc: 'Avalie diversos aspectos da sua saúde com testes rápidos validados cientificamente.' },
    { icon: '⏱️', title: 'Responda em menos de 5 minutos', desc: 'Rápido, prático e inteligente.' },
    { icon: '📄', title: 'Veja seu diagnóstico', desc: 'Relatório completo com sua saúde atual e projeções futuras.' },
    { icon: '📈', title: 'Descubra como melhorar', desc: 'Recomendações baseadas em evidências científicas.' },
    { icon: '🔗', title: 'Compartilhe com seus médicos', desc: 'Use como histórico clínico.' },
    { icon: '👨‍⚕️', title: 'Consulte um médico', desc: 'Fale com um medico em até 5 minutos, com base no seu relatório.' },
  ];

  return (
    <>
      <Head>
        <title>Me Joy - Triagem de Saúde com IA</title>
        <meta name="description" content="Descubra como está sua saúde em minutos com inteligência artificial. 100% gratuito e baseado em ciência." />
        <meta property="og:title" content="Me Joy - Descubra Sua Saúde" />
        <meta property="og:description" content="Triagem gratuita com relatório personalizado. Baseado em ciência, com IA." />
        <meta property="og:image" content="https://www.mejoy.com.br/logosmejoy/logomejoy.png" />
        <link rel="icon" href="/logosmejoy/faviconmejoy.png" />
      </Head>
      <main className="min-h-screen bg-bg text-fg">
        <Navbar />
        <Particulas />
        <div className="relative z-10">
          {/* Hero */}
          <section className="pt-28 sm:pt-32 pb-0 px-4 sm:px-6 lg:px-8 min-h-[90vh]">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-10">
                <div className="text-center lg:text-left space-y-4 px-2 sm:px-8">
                  <>
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                      className="text-4xl md:text-6xl font-extrabold mb-6">
                      Sua academia transforma corpos. O Me Joy transforma vidas.
                    </motion.h1>
                    <h2 className="text-xl font-bold text-white/90 mb-4">
                      Ofereça um check-up digital aos seus alunos e leve a saúde para outro nível.
                    </h2>
                    <p className="text-lg text-white/70 mb-2">
                      Avaliação de saúde com IA que identifica riscos, otimiza treinos e potencializa resultados.
                    </p>
                    <p className="text-lg text-white/70 mb-4">
                      Ideal para academias que querem entregar mais valor e fidelizar seus alunos.
                    </p>
                  </>
                  <Button
                    onClick={handleTriagem}
                    className="w-full sm:w-auto mt-8 hover:scale-105 transition duration-300 relative overflow-hidden border-2 border-brand shadow-xl hover:shadow-purple-500/50"
                  >
                    <span className="absolute inset-0 bg-brand/10 blur-md opacity-70 animate-pulse rounded-full"></span>
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <FiActivity className="text-lg" />
                      Fazer Triagem Gratuita Agora
                    </span>
                  </Button>
                </div>
                <div className="flex justify-center items-center w-full lg:w-auto">
                  <div className="mb-4 rounded-xl overflow-hidden shadow-lg w-full max-w-[380px] sm:max-w-[480px] lg:max-w-[500px] xl:max-w-[540px] 2xl:max-w-[580px] aspect-video">
                    <video
                      src="/videos/einstein.mp4"
                      autoPlay
                      muted
                      playsInline
                      loop
                      controls={false}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Como Funciona */}
          <section className="pt-12 sm:pt-16 container-center">
            <h2 className="text-3xl font-bold mb-10 text-center">Como funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {etapas.map((item, idx) => (
                <motion.div key={item.title} className="card-premium text-center hover:scale-105 transition duration-300"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Para Academias */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg border border-border text-fg rounded-xl shadow-lg mt-16">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">🏋️‍♂️ Para academias que cuidam de verdade</h2>
              <p className="text-white/80 text-lg">
                Ofereça aos seus alunos uma triagem gratuita com relatório completo de saúde e performance. 
                Uma nova forma de engajar, reter e transformar vidas com sua academia.
              </p>
              <p className="text-white/70 text-base">
                Aumente a percepção de valor e demonstre cuidado real com a saúde dos seus alunos.
              </p>
              <a
                href="https://wa.me/5547999009923?text=contratar%20zapfarm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand hover:bg-brand text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 mt-4"
              >
                💬 Fale com nosso time Agora
              </a>
            </div>
          </section>

                    {/* Missão / Visão / Valores */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-md mt-10">
            <div className="max-w-7xl mx-auto text-center space-y-12">
              <h2 className="text-3xl md:text-4xl font-bold">💡 Por que o Me Joy foi criado?</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-bg border border-border p-6 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-semibold mb-3">🎯 Nossa Missão</h3>
                  <p className="leading-relaxed">
                    Ajudar você a entender sua saúde de forma completa e humana, conectando sintomas, hábitos e riscos — sem precisar passar por mil médicos ou exames.
                  </p>
                </div>

                <div className="bg-bg border border-border p-6 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-semibold mb-3">🚀 Nossa Visão</h3>
                  <p className="leading-relaxed">
                    Levar saúde preditiva e preventiva baseada em ciência e inteligência artificial a milhões de pessoas no mundo todo, transformando vidas com informação clara e acolhedora.
                  </p>
                </div>

                <div className="bg-bg border border-border p-6 rounded-2xl shadow-lg">
                  <h3 className="text-2xl font-semibold mb-3">💎 O Que Valorizamos</h3>
                  <ul className="list-disc list-inside text-left space-y-2">
                    <li>Clareza e acolhimento no cuidado</li>
                    <li>Ciência aplicada à vida real</li>
                    <li>Segurança, privacidade e ética</li>
                    <li>Inovação com responsabilidade</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Depoimentos */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-md">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              <h2 className="text-3xl font-bold mb-8">💬 O que as pessoas estão dizendo?</h2>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto text-lg">
                Mais de 5.000 pessoas já fizeram a triagem gratuita. Veja como isso transformou a forma como elas entendem a própria saúde:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { nome: 'Carla, 32 anos', texto: '“Nunca tive uma visão tão clara sobre minha saúde. Mudou minha vida!”' },
                  { nome: 'João, 45 anos', texto: '“Em poucos minutos entendi coisas que médicos nunca me explicaram.”' },
                  { nome: 'Ana, 28 anos', texto: '“Fiz o teste no almoço e comecei a mudar minha rotina no mesmo dia.”' },
                  { nome: 'José, 61 anos', texto: '“Fiquei impressionado com a clareza do relatório. Levei para meu médico e agilizou meu tratamento.”' },
                ].map((d, i) => (
                  <div key={i} className="bg-white/10 p-6 rounded-xl shadow-md">
                    <p className="italic text-white/90">{d.texto}</p>
                    <p className="mt-4 font-semibold text-white/70">— {d.nome}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Autoridade e Confiança */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-md">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">🔬 Autoridade e Confiança</h2>
              <p className="text-white/80 mb-8 text-lg max-w-3xl mx-auto">
                O Me Joy utiliza apenas informações validadas pelas maiores referências da medicina mundial: OMS, Harvard Medical School, Cochrane, CDC, entre outras. Tudo para garantir recomendações confiáveis, seguras e baseadas em ciência.
              </p>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    { src: '/images/oms.jpg', alt: 'OMS' },
                    { src: '/images/cochrane.jpg', alt: 'Cochrane' },
                    { src: '/images/harvard.png', alt: 'Harvard' },
                    { src: '/images/scielo.png', alt: 'Scielo' },
                    { src: '/images/cms.png', alt: 'CMS' },
                  ].map(({ src, alt }) => (
                    <Image
                      key={alt}
                      src={src}
                      alt={alt}
                      width={100}
                      height={60}
                      unoptimized
                    />
                  ))}
                </div>
                {/* 
                <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
                  <Image src="/logos/who.png" alt="WHO" width={80} height={80} className="object-contain" />
                  <Image src="/logos/cochrane.png" alt="Cochrane" width={80} height={80} className="object-contain" />
                  <Image src="/logos/harvard.png" alt="Harvard" width={80} height={80} className="object-contain" />
                  <Image src="/logos/scielo.png" alt="Scielo" width={80} height={80} className="object-contain" />
                  <Image src="/logos/cms.png" alt="CMS" width={80} height={80} className="object-contain" />
                </div>
                */}
              </div>
            </div>
          </section>

          {/* Garantia & Gatilhos Mentais */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 bg-black/30 backdrop-blur-md">
            <div className="max-w-5xl mx-auto text-center space-y-10">
              <h2 className="text-3xl font-bold text-brand">🔒 Garantia de Confiança Total</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                A triagem é gratuita, rápida e 100% segura. Seus dados são protegidos e criptografados, e você pode usar o relatório como quiser.
              </p>
              <p className="text-white/70 text-base">
                Seu relatório é gerado imediatamente após a conclusão. Comece já!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90">
                {[
                  { t: '⚡ Comece em 1 Minuto', d: 'Sem cadastro complicado. Só responder e descobrir o que está acontecendo com sua saúde.' },
                  { t: '🔐 Proteção de Dados', d: 'Seguimos a LGPD e usamos criptografia para manter sua privacidade sempre segura.' },
                  { t: '🌟 Personalização', d: 'Você recebe um relatório feito sob medida com base nas suas respostas.' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">{item.t}</h3>
                    <p>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-14 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-md">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <h2 className="text-3xl font-bold mb-6">❓ Perguntas Frequentes</h2>
              <div className="space-y-6 text-left text-white/90">
                {[
                  ['🆓 É realmente gratuito?', 'Sim, a triagem é 100% gratuita e sem compromisso. Queremos que você conheça seu estado de saúde de forma acessível.'],
                  ['🔐 Meus dados estão seguros?', 'Sim, utilizamos criptografia avançada e seguimos a LGPD para garantir sua privacidade e segurança.'],
                  ['⏱️ Quanto tempo demora?', 'Em media, apenas 5 minutos. É rápido, simples e direto ao ponto.'],
                  ['🩻 Posso usar o relatório em consultas médicas?', 'Sim, seu relatório é perfeito para levar ao médico e agilizar sua consulta.'],
                ].map(([title, desc], i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-lg mb-1">{title}</h3>
                    <p>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Botão Flutuante WhatsApp */}
          <a
            href="https://zapvida.com/doctors/plantao"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-brand hover:bg-brand text-white rounded-full p-4 shadow-lg animate-pulse transition duration-300"
            title="Fale com nosso time agora"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.76 11.76 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.96L0 24l6.22-1.63A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.2-3.48-8.52ZM12 22c-1.7 0-3.36-.44-4.82-1.27l-.34-.2-3.68.97.99-3.58-.22-.36A9.93 9.93 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10Zm5.17-7.6c-.28-.14-1.65-.82-1.9-.91-.25-.1-.43-.14-.61.14-.18.28-.7.91-.86 1.1-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41a8.4 8.4 0 0 1-1.54-1.91c-.16-.27-.02-.42.12-.55.12-.12.27-.3.4-.46.13-.15.17-.26.26-.44.09-.18.04-.34-.02-.48-.07-.14-.61-1.47-.84-2-.22-.52-.45-.45-.61-.46h-.52c-.18 0-.48.07-.74.34-.25.28-.98.96-.98 2.34s1.01 2.72 1.15 2.91c.14.18 1.99 3.05 4.83 4.28.67.29 1.19.46 1.6.58.67.21 1.28.18 1.76.11.54-.08 1.65-.67 1.88-1.32.23-.64.23-1.18.16-1.32-.06-.13-.25-.2-.53-.34Z"/>
            </svg>
          </a>

          {/* CTA Final */}
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/10 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">✅ Entenda sua saúde agora</h2>
              <p className="text-white/80 text-lg">
                Rápido, gratuito e baseado em evidência científica. Receba seu relatório em minutos.
              </p>
              <Button onClick={handleTriagem} className="w-full sm:w-auto mt-4 text-lg">
                Fazer Minha Triagem Gratuita
              </Button>
            </div>
          </section>

          <div className="w-full flex justify-center mt-20 px-4">
            <Image
              src="/logosmejoy/logomejoy.png"
              alt="Logo Me Joy Animada"
              width={240}
              height={240}
              className="object-contain animate-pulse"
              priority
            />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}