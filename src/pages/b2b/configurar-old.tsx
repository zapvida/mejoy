'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/layout/Navbar';
import { CURATED_PALETTES, deriveBrand, type Hex } from '@/lib/theme/brand';

interface DraftData {
  logoUrl?: string;
  brandColor?: string;
  accentColor?: string;
  fantasyName?: string;
  ctaText?: string;
  ctaUrl?: string;
  whatsapp?: string;
  desiredDomain?: string;
}

export default function B2BConfigurar() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [formData, setFormData] = useState<DraftData>({
    brandColor: '#10b981',
    accentColor: '#34d399',
    ctaText: 'Falar com médico',
    ctaUrl: 'https://wa.me/5511999999999',
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB');
      return;
    }

    setUploading(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // Upload para API
        const res = await fetch('/api/branding/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64 }),
        });

        if (!res.ok) {
          throw new Error('Upload falhou');
        }

        const data = await res.json();
        setFormData({ ...formData, logoUrl: data.url });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload. Tente novamente.');
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/branding/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar');
      }

      const data = await res.json();

      // Redirecionar para assinar com draft_id
      router.push(`/b2b/assinar?draft=${data.id}`);
    } catch (error) {
      console.error('Save error:', error);
      alert('Erro ao salvar. Tente novamente.');
      setSaving(false);
    }
  };

  // Preview em tempo real - aplica vars com deriveBrand
  const brandSeed = (formData.brandColor || '#10b981') as Hex;
  const previewBrand = deriveBrand(brandSeed);

  const previewAccent = formData.accentColor
    ? deriveBrand((formData.accentColor || '#34d399') as Hex)
    : null;

  const previewStyle = {
    '--brand-600': previewBrand.brand600,
    '--brand-700': previewBrand.brand700,
    '--brand': previewBrand.brand600,
    ...(previewAccent && {
      '--accent-600': previewAccent.brand600,
      '--accent-700': previewAccent.brand700,
      '--accent': previewAccent.brand600,
    }),
  } as React.CSSProperties;

  return (
    <>
      <Head>
        <title>Personalizar sua marca | Me Joy</title>
        <meta name="description" content="Configure logo, cores e CTAs para sua clínica. Preview em tempo real." />
      </Head>
      <main className="min-h-screen bg-muted">
        <Navbar />
        
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-ink mb-2">
              Personalize sua marca
            </h1>
            <p className="text-subtle text-lg">
              Configure logo, cores e CTAs. Veja o resultado em tempo real!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[color:var(--ring)]">
              <h2 className="text-2xl font-bold text-ink mb-6">Configurações</h2>
              
              <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Logo da clínica
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn-ghost"
                    >
                      {uploading ? 'Enviando...' : formData.logoUrl ? 'Trocar logo' : 'Enviar logo'}
                    </button>
                    {formData.logoUrl && (
                      <img
                        src={formData.logoUrl}
                        alt="Logo preview"
                        className="h-12 object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Cores */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-3">
                    Cor primária
                  </label>
                  
                  {/* Paletas curadas - Radio-cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {CURATED_PALETTES.map((palette) => {
                      const selected = formData.brandColor === palette.brand;
                      return (
                        <button
                          key={palette.name}
                          type="button"
                          onClick={() => {
                            const d = deriveBrand(palette.brand as Hex);
                            setFormData({
                              ...formData,
                              brandColor: d.brand600,
                              accentColor: palette.accent,
                            });
                            setOptimized(d.optimized);
                          }}
                          className={`
                            relative p-3 rounded-lg border-2 transition-all
                            ${selected 
                              ? 'border-primary ring-2 ring-[color:var(--ring)]' 
                              : 'border-[color:var(--ring)] hover:border-primary'
                            }
                          `}
                          style={{
                            '--brand-600': palette.brand,
                          } as React.CSSProperties}
                        >
                          <div
                            className="w-full h-8 rounded mb-2"
                            style={{ backgroundColor: palette.brand }}
                          />
                          <div className="text-xs font-medium text-ink">{palette.name}</div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Cor personalizada */}
                  <div className="border-t border-[color:var(--ring)] pt-4">
                    <label className="block text-sm font-medium text-ink mb-2">
                      Ou escolha uma cor personalizada
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={(formData.brandColor as string) || '#10b981'}
                        onChange={(e) => {
                          const color = e.target.value as Hex;
                          const d = deriveBrand(color);
                          setFormData({ ...formData, brandColor: d.brand600 });
                          setOptimized(d.optimized);
                        }}
                        className="h-10 w-20 rounded border border-[color:var(--ring)]"
                      />
                      <input
                        type="text"
                        placeholder="#10b981"
                        value={(formData.brandColor as string) || '#10b981'}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                            const d = deriveBrand(v as Hex);
                            setFormData({ ...formData, brandColor: d.brand600 });
                            setOptimized(d.optimized);
                          } else {
                            setFormData({ ...formData, brandColor: v });
                          }
                        }}
                        className="flex-1 rounded-lg border border-[color:var(--ring)] px-3 py-2"
                      />
                    </div>
                    {optimized && (
                      <p className="text-xs text-primary mt-2">
                        ⚡ Cor otimizada para contraste AA
                      </p>
                    )}
                  </div>
                </div>

                {/* Cor secundária (accent) */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Cor secundária (opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#34d399'}
                      onChange={(e) => {
                        const color = e.target.value as Hex;
                        const d = deriveBrand(color);
                        setFormData({ ...formData, accentColor: d.brand600 });
                      }}
                      className="h-10 w-20 rounded border border-[color:var(--ring)]"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#34d399'}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                          const d = deriveBrand(v as Hex);
                          setFormData({ ...formData, accentColor: d.brand600 });
                        } else {
                          setFormData({ ...formData, accentColor: v });
                        }
                      }}
                      className="flex-1 rounded-lg border border-[color:var(--ring)] px-3 py-2"
                      placeholder="#34d399"
                    />
                  </div>
                </div>

                {/* Nome fantasia */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Nome da clínica/empresa
                  </label>
                  <input
                    type="text"
                    value={formData.fantasyName || ''}
                    onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
                    className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2"
                    placeholder="Ex: Clínica Saúde Total"
                  />
                </div>

                {/* CTA */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      Texto do CTA
                    </label>
                    <input
                      type="text"
                      value={formData.ctaText || ''}
                      onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                      className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2"
                      placeholder="Falar com médico"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">
                      URL do CTA
                    </label>
                    <input
                      type="url"
                      value={formData.ctaUrl || ''}
                      onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                      className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2"
                      placeholder="https://wa.me/..."
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    WhatsApp (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2"
                    placeholder="11999999999"
                  />
                </div>

                {/* Domínio */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Domínio desejado (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.desiredDomain || ''}
                    onChange={(e) => setFormData({ ...formData, desiredDomain: e.target.value })}
                    className="w-full rounded-lg border border-[color:var(--ring)] px-3 py-2"
                    placeholder="clinicaexemplo.com.br"
                  />
                  <p className="text-xs text-subtle mt-1">
                    Você receberá uma URL provisória imediatamente. Configure o domínio depois.
                  </p>
                </div>

                {/* Botão Continuar */}
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.fantasyName}
                  className="btn-brand w-full justify-center"
                  data-testid="cta-continuar-config"
                >
                  {saving ? 'Salvando...' : 'Continuar'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-[color:var(--ring)]">
              <h2 className="text-2xl font-bold text-ink mb-6">Preview</h2>
              
              <div 
                className="rounded-xl p-6 border border-[color:var(--ring)]"
                style={previewStyle}
              >
                {/* Logo */}
                {formData.logoUrl && (
                  <div className="mb-4">
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="h-12 object-contain"
                    />
                  </div>
                )}

                {/* Nome */}
                {formData.fantasyName && (
                  <h3 className="text-2xl font-bold text-ink mb-4">
                    {formData.fantasyName}
                  </h3>
                )}

                {/* CTA Button */}
                {formData.ctaText && (
                  <a
                    href={formData.ctaUrl || '#'}
                    className="btn-brand inline-block"
                    style={{ 
                      backgroundColor: previewBrand.brand600,
                      color: '#fff' 
                    }}
                  >
                    {formData.ctaText}
                  </a>
                )}

                {/* Preview da landing */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-subtle mb-2">Como ficará sua landing:</p>
                  <div className="space-y-2">
                    <div className="h-4 bg-[color:var(--brand)] rounded w-3/4"></div>
                    <div className="h-4 bg-[color:var(--accent)] rounded w-1/2"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/b2b/sandbox"
                  className="btn-ghost"
                  data-testid="preview-live"
                >
                  Ver demo em tela cheia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

