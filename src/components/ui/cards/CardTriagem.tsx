'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type CardTriagemProps = {
  titulo: string;
  descricao: string;
  href: string;
};

export default function CardTriagem({ titulo, descricao, href }: CardTriagemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="w-full"
    >
      <Link href={href} className="block">
        <div
          className="bg-black/70 hover:bg-black/80 backdrop-blur-md border border-white/10 
          rounded-3xl shadow-xl hover:shadow-2xl p-5 md:p-6 cursor-pointer 
          flex flex-col gap-4 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl md:text-4xl">🩺</div>
            <h2 className="text-xl md:text-2xl font-bold text-brand">
              {titulo}
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/80 leading-relaxed">
            {descricao}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}