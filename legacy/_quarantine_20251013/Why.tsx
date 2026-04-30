'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiEye } from 'react-icons/fi';

interface WhyProps {
  data: {
    title: string;
    subtitle: string;
    mission: string[];
    vision: string[];
  };
}

export default function Why({ data }: WhyProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-zinc-900 relative overflow-hidden" id="why">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-[72rem] px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight" style={{ textWrap: 'balance' }}>
            {data.title}
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            {data.subtitle}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Missão */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-6"
          >
            <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-zinc-700 hover:ring-emerald-500/30 transition-all duration-300 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl flex items-center justify-center">
                  <FiTarget className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Nossa Missão</h3>
              </div>
              <ul className="space-y-4">
                {data.mission.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-zinc-300 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Visão */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-12 md:col-span-6"
          >
            <div className="bg-zinc-800/40 backdrop-blur-sm rounded-2xl p-8 ring-1 ring-zinc-700 hover:ring-emerald-500/30 transition-all duration-300 h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl flex items-center justify-center">
                  <FiEye className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Nossa Visão</h3>
              </div>
              <ul className="space-y-4">
                {data.vision.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-zinc-300 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}