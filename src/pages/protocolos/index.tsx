import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useMemo } from 'react';

import MobileTabBar from '@/components/mobile/MobileTabBar';
import MobileTopBar from '@/components/mobile/MobileTopBar';
import { formularios } from '@/forms';
import { track } from '@/lib/analytics';
import { ZAPFARM_PRODUCTS } from '@/config/zapfarm/products';
import { getSearchSuggestions } from '@/lib/search/intelligent-search';

// Lista dos 10 protocolos específicos do lançamento
const PROTOCOLOS_SLUGS = [
  'emagrecimento',
  'calvicie',
  'sono',
  'ansiedade',
  'intestino',
  'figado',
  'libido-masculina',
  'menopausa',
  'articulacoes',
  'imunidade',
] as const;

interface ProtocoloCard {
  slug: string;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  descricaoDetalhada?: string;
  icon?: string;
  duracao?: string;
  rating?: number;
  participantes?: number;
  tags?: string[];
  categoria?: string;
  isFree: boolean;
  colors?: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

export default function ProtocolosIndex() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Criar lista de protocolos combinando dados de produtos e formulários
  const protocolos: ProtocoloCard[] = useMemo(() => {
    return PROTOCOLOS_SLUGS.map(slug => {
      const product = ZAPFARM_PRODUCTS[slug];
      const form = formularios[slug as keyof typeof formularios];
      
      if (!product || !form) {
        // Fallback caso não encontre - com cores padrão
        const fallbackColors = {
          primary: 'purple',
          secondary: 'orange',
          gradient: 'from-purple-700 via-purple-600 to-orange-600',
        };
        return {
          slug,
          titulo: slug,
          descricao: 'Protocolo de saúde personalizado',
          isFree: true,
          colors: fallbackColors,
        };
      }

      return {
        slug,
        titulo: form.titulo || product.displayName,
        subtitulo: form.subtitulo || product.shortDescription,
        descricao: form.descricao || product.shortDescription,
        descricaoDetalhada: form.descricaoDetalhada || product.description,
        icon: form.icon || '💊',
        duracao: form.duracao || '2-3 min',
        rating: form.rating || 4.7,
        participantes: form.participantes || 0,
        tags: form.tags || [],
        categoria: form.categoria || product.category,
        isFree: form.isFree !== undefined ? form.isFree : true,
        colors: product.colors,
      };
    });
  }, []);

  // Busca inteligente com sugestões
  useEffect(() => {
    if (searchTerm.trim()) {
      const suggestions = getSearchSuggestions(searchTerm);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Busca inteligente nos protocolos
  const filteredProtocolos = useMemo(() => {
    if (!searchTerm.trim()) return protocolos;
    
    const searchLower = searchTerm.toLowerCase();
    return protocolos.filter(proto => {
      const searchableText = [
        proto.titulo,
        proto.subtitulo,
        proto.descricao,
        proto.descricaoDetalhada,
        ...(proto.tags || []),
        proto.categoria,
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchLower);
    });
  }, [protocolos, searchTerm]);

  const handleProtocoloClick = (slug: string) => {
    track('protocolo_start', { protocolo: slug });
    router.push(`/triagem/${slug}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim() && searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // Cores dos cards baseadas nos produtos - sempre vibrantes
  // Mapeamento específico para cada protocolo (cores vibrantes e únicas)
  const PROTOCOL_COLORS: Record<string, string> = {
    'emagrecimento': 'bg-gradient-to-br from-purple-700 via-purple-600 to-orange-600',
    'calvicie': 'bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600',
    'sono': 'bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600',
    'ansiedade': 'bg-gradient-to-br from-green-700 via-green-600 to-teal-600',
    'intestino': 'bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-600',
    'figado': 'bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600',
    'libido-masculina': 'bg-gradient-to-br from-red-700 via-red-600 to-rose-600',
    'menopausa': 'bg-gradient-to-br from-pink-700 via-pink-600 to-rose-600',
    'articulacoes': 'bg-gradient-to-br from-slate-700 via-slate-600 to-gray-600',
    'imunidade': 'bg-gradient-to-br from-cyan-700 via-cyan-600 to-blue-600',
  };

  const getCardColor = (slug: string, colors?: { gradient: string }, index: number = 0): string => {
    // Primeiro, tenta usar a cor específica do produto (se existir e for válida)
    if (colors?.gradient && colors.gradient.trim()) {
      // O gradient já vem como 'from-X via-Y to-Z', só precisa adicionar bg-gradient-to-br
      return `bg-gradient-to-br ${colors.gradient}`;
    }
    
    // Se tem cor específica para o protocolo no mapeamento, usa ela (prioridade)
    if (PROTOCOL_COLORS[slug]) {
      return PROTOCOL_COLORS[slug];
    }
    
    // Fallback final com cores vibrantes (não deve chegar aqui, mas garante)
    const fallbackColors = [
      'bg-gradient-to-br from-purple-600 to-orange-500',
      'bg-gradient-to-br from-indigo-600 to-blue-500',
      'bg-gradient-to-br from-blue-600 to-cyan-500',
      'bg-gradient-to-br from-green-600 to-emerald-500',
      'bg-gradient-to-br from-pink-600 to-rose-500',
      'bg-gradient-to-br from-yellow-600 to-orange-500',
      'bg-gradient-to-br from-teal-600 to-green-500',
      'bg-gradient-to-br from-red-600 to-pink-500',
      'bg-gradient-to-br from-violet-600 to-purple-500',
      'bg-gradient-to-br from-amber-600 to-yellow-500',
    ];
    
    return fallbackColors[index % fallbackColors.length];
  };

  return (
    <>
      <Head>
        <title>Protocolos de Saúde | MeJoy</title>
        <meta name="description" content="Escolha seu protocolo de saúde personalizado com acompanhamento médico especializado" />
      </Head>

      <MobileTopBar title="Protocolos" />
      <MobileTabBar />

      <main
        className="min-h-screen bg-white pb-[calc(64px+env(safe-area-inset-bottom))] pt-20 text-gray-900 md:pb-0 md:pt-0"
        data-testid="page-protocolos"
      >
        {/* Navigation Bar - Desktop Only */}
        <div className="hidden px-4 py-3 md:block">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Início</span>
                <span className="sm:hidden">Voltar</span>
              </button>
              
              <div className="text-gray-700 text-sm">
                <span className="text-gray-500">Acesso:</span>
                <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                  Gratuito
                </span>
              </div>
            </div>
        </div>

        {/* Header Enriquecido */}
        <div className="px-4 pb-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Protocolos de Saúde
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-4">
              Escolha seu protocolo personalizado com produtos manipulados e suplementos selecionados por médicos. 
              Check-up gratuito para avaliar sua elegibilidade.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>1-3 min</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>4.8 avaliação</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>+15k usuários</span>
              </div>
            </div>
          </div>
        </div>

        {/* Busca Compacta */}
        <div className="px-4 pb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar protocolos..."
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                aria-label="Buscar protocolos"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Sugestões de Busca */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                  >
                    <span className="text-sm font-medium">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid de Protocolos - Mobile First */}
        <div className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredProtocolos.map((protocolo, index) => {
                const cardColor = getCardColor(protocolo.slug, protocolo.colors, index);
                
                return (
                  <motion.div
                    key={protocolo.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className={`${cardColor} rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-[200px] sm:h-[220px] lg:h-[240px] relative overflow-hidden group text-white border-2 border-white/20 shadow-lg`}
                      onClick={() => handleProtocoloClick(protocolo.slug)}
                      data-testid={`protocolo-card-${protocolo.slug}`}
                    >
                      {/* Efeito de brilho encrustrado */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none rounded-2xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl"></div>
                      
                      {/* Borda interna encrustrada */}
                      <div className="absolute inset-1 border border-white/30 rounded-xl pointer-events-none"></div>
                      
                      {/* Header Compacto */}
                      <div className="flex items-start justify-between mb-2 relative z-10">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="text-lg sm:text-xl drop-shadow-lg flex-shrink-0">
                            {protocolo.icon || '💊'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-lg line-clamp-1">
                              {protocolo.titulo}
                            </h3>
                            {protocolo.subtitulo && (
                              <p className="text-xs text-white/90 line-clamp-1 font-medium">
                                {protocolo.subtitulo}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Badge Compacto */}
                        <div className="flex-shrink-0 ml-1">
                          {protocolo.isFree ? (
                            <span className="bg-white/25 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold border border-white/40 shadow-lg">
                              🔓
                            </span>
                          ) : (
                            <span className="bg-white/25 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold border border-white/40 shadow-lg">
                              🔒
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informações de Metadados Compactas */}
                      <div className="flex items-center gap-2 mb-2 relative z-10 text-xs text-white/80">
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{protocolo.duracao || '2-3 min'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{protocolo.rating || '4.7'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{protocolo.participantes ? `${protocolo.participantes}+` : '1k+'}</span>
                        </div>
                      </div>

                      {/* Tags Compactas */}
                      {protocolo.tags && protocolo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 relative z-10">
                          {protocolo.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="bg-white/25 backdrop-blur-sm text-white/95 px-2 py-0.5 rounded-full text-xs font-semibold border border-white/40 shadow-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Descrição Compacta */}
                      <div className="flex-1 mb-3 relative z-10 min-h-0">
                        <p className="text-white/90 leading-tight text-xs line-clamp-2">
                          {protocolo.descricaoDetalhada || protocolo.descricao || 'Check-up gratuito para avaliar sua elegibilidade.'}
                        </p>
                      </div>

                      {/* Footer com Botão Compacto */}
                      <div className="flex items-center justify-end relative z-10 mt-auto pt-2">
                        <button
                          className="bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white font-bold py-1.5 px-3 rounded-lg transition-all duration-300 border border-white/40 hover:border-white/60 text-xs flex items-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.15)] transform hover:scale-105"
                          data-testid={`btn-protocolo-start-${protocolo.slug}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProtocoloClick(protocolo.slug);
                          }}
                        >
                          <span className="text-xs">▶️</span>
                          <span>Iniciar</span>
                          <span className="text-xs">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Seção de Segurança Moderna */}
        <div className="px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg" aria-hidden="true">🛡️</span>
                <h3 className="text-sm font-semibold text-gray-900">100% Seguro e Confidencial</h3>
              </div>
              <p className="text-center text-gray-600 text-xs max-w-2xl mx-auto">
                Seus dados são protegidos com criptografia de ponta a ponta. 
                Todas as informações são mantidas em total confidencialidade.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
