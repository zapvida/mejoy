"use client";

import { motion } from "framer-motion";
import { Download, Smartphone, TrendingUp, CheckCircle } from "lucide-react";
import { useState } from "react";

import { trackCTAClick } from "@/lib/ga4";

type AppDownloadCTAsProps = {
  className?: string;
};

const APP_FEATURES = [
  {
    icon: "📱",
    title: "Relatório Completo",
    description: "Acesse seu relatório personalizado a qualquer momento"
  },
  {
    icon: "🔔",
    title: "Notificações Inteligentes",
    description: "Lembretes personalizados para seus hábitos de saúde"
  },
  {
    icon: "📊",
    title: "Acompanhamento",
    description: "Monitore seu progresso com métricas em tempo real"
  },
  {
    icon: "🎯",
    title: "Metas Personalizadas",
    description: "Objetivos adaptados ao seu perfil e objetivos"
  }
];

const APP_STORES = [
  {
    id: "app_store_ios",
    name: "App Store",
    platform: "iOS",
    icon: "🍎",
    href: "#", // Placeholder - será configurado posteriormente
    description: "Disponível para iPhone e iPad"
  },
  {
    id: "app_store_android", 
    name: "Google Play",
    platform: "Android",
    icon: "🤖",
    href: "#", // Placeholder - será configurado posteriormente
    description: "Disponível para smartphones Android"
  }
];

export function AppDownloadCTAs({ className }: AppDownloadCTAsProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const handleStoreClick = (storeId: string) => {
    setSelectedStore(storeId);
    trackCTAClick?.(storeId, "app_download_final");
    
    // Simular abertura da store (placeholder)
    setTimeout(() => {
      setSelectedStore(null);
    }, 2000);
  };

  return (
    <section 
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 p-6 backdrop-blur-xl ${className}`}
      aria-label="Download do aplicativo nativo"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-balance">
              Leve sua saúde para o próximo nível
            </h2>
          </div>
          <p className="text-white/80 text-pretty max-w-2xl mx-auto">
            Baixe nosso app nativo e tenha acesso a instruções personalizadas, 
            notificações inteligentes e acompanhamento completo do seu progresso.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {APP_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center space-y-2"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-white text-sm text-balance">
                {feature.title}
              </h3>
              <p className="text-white/70 text-xs text-pretty">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Highlight */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="font-semibold text-white text-balance">
              Performance Máxima em Saúde
            </h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Relatórios sempre atualizados</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Lembretes personalizados</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Acompanhamento de metas</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>Notificações inteligentes</span>
            </div>
          </div>
        </div>

        {/* Download Buttons */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2 text-balance">
              Baixe agora e comece sua jornada
            </h3>
            <p className="text-white/70 text-sm text-pretty">
              Disponível para iOS e Android
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
            {APP_STORES.map((store) => (
              <motion.button
                key={store.id}
                onClick={() => handleStoreClick(store.id)}
                disabled={selectedStore === store.id}
                className={`
                  group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 
                  transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  ${selectedStore === store.id ? 'bg-emerald-500/20 border-emerald-400/40' : ''}
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{store.icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-white text-sm">
                      {store.name}
                    </div>
                    <div className="text-xs text-white/70">
                      {store.description}
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                </div>

                {/* Loading State */}
                {selectedStore === store.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center"
                  >
                    <div className="flex items-center gap-2 text-emerald-200 text-sm font-medium">
                      <div className="w-4 h-4 border-2 border-emerald-200 border-t-transparent rounded-full animate-spin"></div>
                      Redirecionando...
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <div className="text-center">
            <p className="text-white/60 text-xs">
              🚀 Em breve disponível nas principais app stores
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
