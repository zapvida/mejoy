// ✅ Hero Section - Versão de Produção Finalizada
// Meta tags para futura integração no <Head> do Next.js:
// <meta name="description" content="Plataforma de triagem médica inteligente com IA em tempo real.">
// <meta property="og:title" content="Teodoc - Sua Saúde com Inteligência Artificial" />

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <motion.section
      aria-label="Seção principal da Teodoc"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative flex flex-col items-center justify-center text-center min-h-[90vh] px-6 py-24 bg-[url('/images/hero-bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-brand to-brand bg-clip-text text-transparent drop-shadow-lg">
          Teodoc: Inteligência Médica em Tempo Real
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 drop-shadow-md">
          Triagens médicas automáticas, relatórios personalizados e suporte imediato com inteligência artificial.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/triagem"
            className="bg-brand hover:bg-brand transition px-8 py-4 rounded-full font-semibold text-white text-lg shadow-xl"
          >
            Iniciar Triagem Agora
          </Link>
          <Link
            href="/relatorio"
            className="border border-white/30 hover:bg-white/10 transition px-8 py-4 rounded-full font-semibold text-white text-lg shadow-xl"
          >
            Acessar Relatórios
          </Link>
        </div>
      </div>
    </motion.section>
  )
}