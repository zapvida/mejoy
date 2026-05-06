import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import MobileTabBar from '@/components/mobile/MobileTabBar';
import MobileTopBar from '@/components/mobile/MobileTopBar';
import { listaTriagens } from '@/forms';
import { track } from '@/lib/analytics';
import { intelligentSearch, getSearchSuggestions } from '@/lib/search/intelligent-search';

export default function TriagemIndex() {
  const router = useRouter();
  const [openPlan, setOpenPlan] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Verificar se tem acesso pago
  useEffect(() => {
    const checkPaidAccess = async () => {
      try {
        const response = await fetch('/api/user/access-status');
        if (response.ok) {
          const data = await response.json();
          setHasPaidAccess(data.hasAccess || false);
        }
      } catch (error) {
        console.warn('Erro ao verificar acesso:', error);
      }
    };
    
    checkPaidAccess();
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

  // Usar busca inteligente
  const searchResults = intelligentSearch(listaTriagens, searchTerm);
  const filteredTriagens = searchResults.map(result => result.triagem);

  const handleTriageClick = (slug: string, isFree: boolean) => {
    // Lógica simples: se é grátis OU tem acesso pago, libera
    if (isFree || hasPaidAccess) {
      track('triage_start', { mode: slug, is_free: isFree });
      router.push(`/triagem/${slug}`);
      return;
    }
    
    // Se não tem acesso pago, abre paywall
    setOpenPlan(true);
  };

  const handleCheckout = (type: 'assinatura' | 'presente') => {
    track('start_checkout', { 
      plan: type === 'assinatura' ? 'basic' : 'gift', 
      value: type === 'assinatura' ? 49 : 89, 
      currency: 'BRL' 
    });
    
    if (type === 'assinatura') {
      router.push('/assinatura');
    } else {
      router.push('/presente');
    }
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
    // Delay para permitir clique nas sugestões
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <>
      <Head>
        <title>Triagens | MeJoy</title>
        <meta name="description" content="Escolha sua triagem de saúde personalizada" />
      </Head>

      <MobileTopBar title="Triagens" />
      <MobileTabBar />

      <main
        className="min-h-screen bg-white pb-[calc(64px+env(safe-area-inset-bottom))] pt-20 text-gray-900 md:pb-0 md:pt-0"
        data-testid="page-triage"
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
                <span className="hidden sm:inline">Voltar ao Dashboard</span>
                <span className="sm:hidden">Voltar</span>
              </button>
              
              <div className="text-gray-700 text-sm">
                <span className="text-gray-500">Acesso:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  hasPaidAccess ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {hasPaidAccess ? 'Premium' : 'Gratuito'}
                </span>
              </div>
            </div>
        </div>

        {/* Header Enriquecido */}
        <div className="px-4 pb-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Triagens clínicas inteligentes
            </h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mb-4">
              Escolha sua trilha, responda em poucos minutos e receba direcionamento organizado para o próximo passo.
              Sem promessa milagrosa, com foco em clareza clínica.
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
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar triagens..."
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                aria-label="Buscar triagens"
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

        {/* Grid de Triagens - Mobile First */}
        <div className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {filteredTriagens.map((triagem, index) => {
                // Paleta premium coerente com o fluxo de emagrecimento
                const cardColors = [
                  'bg-gradient-to-br from-green-500 to-emerald-600',
                  'bg-gradient-to-br from-blue-500 to-cyan-600',
                  'bg-gradient-to-br from-emerald-600 to-teal-700',
                  'bg-gradient-to-br from-amber-500 to-orange-600',
                  'bg-gradient-to-br from-slate-700 to-slate-900',
                  'bg-gradient-to-br from-teal-500 to-green-600',
                  'bg-gradient-to-br from-cyan-500 to-emerald-600',
                  'bg-gradient-to-br from-emerald-500 to-teal-600',
                  'bg-gradient-to-br from-orange-500 to-amber-600',
                  'bg-gradient-to-br from-slate-600 to-gray-700',
                  'bg-gradient-to-br from-emerald-700 to-green-800',
                ];
                
                const cardColor = cardColors[index % cardColors.length];
                
                return (
                  <motion.div
                    key={triagem.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div
                      className={`${cardColor} rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-[200px] sm:h-[220px] lg:h-[240px] relative overflow-hidden group text-white border-2 border-white/20 shadow-lg`}
                      onClick={() => handleTriageClick(triagem.slug, triagem.isFree || false)}
                      data-testid={`triage-card-${triagem.slug}`}
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
                            {triagem.icon || '🩺'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-white leading-tight drop-shadow-lg line-clamp-1">
                              {triagem.titulo}
                            </h3>
                            {triagem.subtitulo && (
                              <p className="text-xs text-white/90 line-clamp-1 font-medium">
                                {triagem.subtitulo}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Badge Compacto */}
                        <div className="flex-shrink-0 ml-1">
                          {triagem.isFree ? (
                            <div className="flex flex-col gap-1">
                              <span className="bg-white/25 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-bold border border-white/40 shadow-lg">
                                🔓
                              </span>
                              {/* Rótulos específicos para GI */}
                              {triagem.slug === 'gastro' && (
                                <div className="flex flex-col gap-1">
                                  <span className="bg-green-500/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-bold border border-green-400/50 shadow-lg">
                                    GRATUITA
                                  </span>
                                  <span className="bg-blue-500/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-bold border border-blue-400/50 shadow-lg">
                                    3 min
                                  </span>
                                  <span className="bg-amber-500/80 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-xs font-bold border border-amber-400/50 shadow-lg">
                                    Relatório imediato
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : hasPaidAccess ? (
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
                          <span>{triagem.duracao || '2-5 min'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⭐</span>
                          <span>{triagem.rating || '4.8'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👥</span>
                          <span>{triagem.participantes || '1k+'}</span>
                        </div>
                      </div>

                      {/* Tags Compactas */}
                      {triagem.tags && triagem.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 relative z-10">
                          {triagem.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
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
                          {triagem.descricaoDetalhada || triagem.descricao || 'Inicie sua triagem agora.'}
                        </p>
                      </div>

                      {/* Footer com Botão Compacto */}
                      <div className="flex items-center justify-end relative z-10 mt-auto pt-2">
                        <button
                          className="bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white font-bold py-1.5 px-3 rounded-lg transition-all duration-300 border border-white/40 hover:border-white/60 text-xs flex items-center gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.15)] transform hover:scale-105"
                          data-testid={`btn-triage-start-${triagem.slug}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTriageClick(triagem.slug, triagem.isFree || false);
                          }}
                        >
                          <span className="text-xs">▶️</span>
                          <span>{triagem.isFree || hasPaidAccess ? 'Iniciar' : 'Premium'}</span>
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

        {/* Modal de Plano */}
        {openPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setOpenPlan(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Desbloquear Todas as Triagens
              </h2>
              
              <p className="text-gray-600 mb-6 text-center">
                Libere todas as triagens com acompanhamento mais completo e relatório estruturado por etapa.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleCheckout('assinatura')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                  data-testid="btn-subscribe-basic"
                >
                  Assinar R$ 49 (30 dias, sem renovação)
                </button>

                <button
                  onClick={() => handleCheckout('presente')}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-slate-500/25"
                  data-testid="btn-subscribe-plus"
                >
                  Dar de presente R$ 89
                </button>
              </div>

              <button
                onClick={() => setOpenPlan(false)}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 py-2"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}

        {/* Seção de Segurança Moderna */}
        <div className="px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-amber-50 p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg" aria-hidden="true">🛡️</span>
                <h3 className="text-sm font-semibold text-gray-900">Dados protegidos e triagem segura</h3>
              </div>
              <p className="text-center text-gray-600 text-xs max-w-2xl mx-auto leading-relaxed">
                Seus dados são tratados com boas práticas de privacidade e segurança. Resultado de triagem não substitui consulta médica.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
