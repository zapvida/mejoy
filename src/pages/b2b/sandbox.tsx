import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { deriveBrand, applyBrandVars, type Hex } from '@/lib/theme/brand';
import { track } from '@/lib/analytics';
import LogoWithName from '@/components/ui/LogoWithName';

interface Draft {
  id: string;
  logoUrl?: string | null;
  brandColor?: string | null;
  accentColor?: string | null;
  fantasyName?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  whatsapp?: string | null;
  desiredDomain?: string | null;
}

export default function B2BSandbox() {
  const router = useRouter();
  const { draft: draftId } = router.query;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!draftId || typeof draftId !== 'string') {
      setLoading(false);
      return;
    }

    async function loadDraft() {
      try {
        const res = await fetch(`/api/branding/draft?id=${draftId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('Draft não encontrado. Verifique se o link está correto.');
          } else if (res.status === 410) {
            setError('Este draft expirou (válido por 48h). Por favor, crie um novo.');
          } else {
            setError('Erro ao carregar draft. Tente novamente.');
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        const draftData = data.draft;
        
        if (!draftData) {
          setError('Draft inválido.');
          setLoading(false);
          return;
        }

        setDraft(draftData);

        // ✅ Aplicar branding imediatamente
        if (draftData.brandColor) {
          const brandSeed = (draftData.brandColor as Hex) || '#10b981';
          const base = deriveBrand(brandSeed);
          applyBrandVars(
            base,
            draftData.accentColor as Hex | undefined
          );
        }

        // ✅ Salvar draft no sessionStorage para usar na triagem
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem('b2b_draft', JSON.stringify({
            id: draftData.id,
            logoUrl: draftData.logoUrl,
            brandColor: draftData.brandColor,
            accentColor: draftData.accentColor,
            fantasyName: draftData.fantasyName,
            ctaText: draftData.ctaText,
            ctaUrl: draftData.ctaUrl,
            whatsapp: draftData.whatsapp,
          }));
        }

        track('sandbox_view', { 
          draft_id: draftData.id,
          has_logo: !!draftData.logoUrl,
          has_colors: !!draftData.brandColor
        });

      } catch (e) {
        console.error('[Sandbox] Erro ao carregar draft:', e);
        setError('Erro ao carregar draft. Verifique sua conexão e tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    loadDraft();
  }, [draftId]);

  const handleStartTriage = () => {
    track('triage_start', { 
      draft_id: draft?.id,
      triage_slug: 'gastro',
      source: 'sandbox'
    });
    // ✅ Redireciona para triagem com draft preservado no sessionStorage
    router.push('/triagem/gastro');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Carregando Demo | Me Joy</title>
        </Head>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
            <p className="mt-4 text-gray-600">Carregando sua personalização...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Erro | Me Joy</title>
        </Head>
        <Navbar />
        <main className="min-h-screen bg-gray-50 px-4 py-10 flex items-center justify-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm border text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/b2b/configurar"
              className="inline-flex items-center gap-2 btn-brand"
            >
              Criar nova personalização
            </Link>
          </div>
        </main>
      </>
    );
  }

  const brandName = draft?.fantasyName || 'Sua Clínica';
  const hasBranding = !!(draft?.brandColor || draft?.logoUrl);

  return (
    <>
      <Head>
        <title>{brandName} - Demo White-label | Me Joy</title>
        <meta name="description" content={`Demonstração do White-label para ${brandName} - Veja como sua clínica verá a triagem com logo, cores e CTAs personalizados.`} />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {hasBranding ? `✅ ${brandName}` : 'White-label aplicado'}
            </h1>
            <p className="text-gray-600">
              Aqui você consegue ver como sua clínica/empresa verá a triagem com personalização completa.
            </p>
          </div>

          {/* Preview Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview da Personalização</h2>
              
              {/* Logo Preview */}
              {draft?.logoUrl && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Logo:</p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={draft.logoUrl} 
                      alt={brandName}
                      className="h-12 max-w-[200px] object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <LogoWithName 
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              {/* Cores Preview */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Cores:</p>
                <div className="flex gap-3">
                  {draft?.brandColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: draft.brandColor }}
                      />
                      <span className="text-sm text-gray-700">{draft.brandColor}</span>
                    </div>
                  )}
                  {draft?.accentColor && (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: draft.accentColor }}
                      />
                      <span className="text-sm text-gray-700">{draft.accentColor}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Preview */}
              {(draft?.ctaText || draft?.ctaUrl) && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">CTA:</p>
                  <a
                    href={draft.ctaUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-lg text-white font-medium text-sm"
                    style={{ 
                      backgroundColor: draft.brandColor || '#10b981',
                      cursor: draft.ctaUrl ? 'pointer' : 'default'
                    }}
                  >
                    {draft.ctaText || 'Falar com médico'}
                  </a>
                </div>
              )}

              {/* Domínio */}
              {draft?.desiredDomain && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Domínio desejado:</p>
                  <p className="text-sm font-medium text-gray-900">{draft.desiredDomain}</p>
                </div>
              )}
            </div>

            {/* CTA Principal */}
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleStartTriage}
                className="w-full h-12 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: draft?.brandColor || '#10b981'
                }}
              >
                🧪 Testar Triagem Personalizada
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                A triagem será aberta com seu branding aplicado
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> Esta é uma demonstração. Após assinar, você terá uma URL própria ({draft?.desiredDomain || 'seu-dominio.com.br'}) com todo o branding aplicado automaticamente.
            </p>
          </div>

          {/* CTA Assinar */}
          <div className="text-center">
            <Link
              href={`/b2b/assinar?draft=${draft?.id || ''}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all"
              style={{ 
                backgroundColor: draft?.brandColor || '#10b981'
              }}
            >
              Quero assinar agora →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
