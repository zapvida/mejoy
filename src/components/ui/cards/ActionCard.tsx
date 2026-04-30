'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type ActionCardProps = {
  titulo: string;
  descricao: string;
  href: string;
  icon?: React.ReactNode;
};

export default function ActionCard({
  titulo,
  descricao,
  href,
  icon,
}: ActionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link href={href} className="block">
                <div className="flex flex-col gap-4 rounded-2xl bg-bg/70 border border-border p-5 md:p-6 hover:border-brand hover:shadow-xl transition-all h-full">
          <div className="flex items-center gap-3">
            {icon && (
                <div className="text-brand text-2xl md:text-3xl">
                {icon}
              </div>
            )}
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {titulo}
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/70 leading-relaxed">
            {descricao}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}