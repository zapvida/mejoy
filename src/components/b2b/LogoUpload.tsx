'use client';

import { useEffect, useRef, useState } from 'react';

import { storageService } from '@/lib/storage';

interface Props {
  clienteId: string;
}

export default function LogoUpload({ clienteId }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Upload para Supabase Storage
      const { error } = await storageService.uploadFile(
        'logos',
        `${clienteId}`,
        file
      );

      if (error) {
        console.error('Erro no upload:', error);
        return;
      }

      // Obter URL pública
      const url = await storageService.getPublicUrl('logos', `${clienteId}`);
      setPreviewUrl(url);

      // TODO: Atualizar dados do cliente via API
      // await fetch('/api/clientes/update-logo', { ... });
      
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const url = await storageService.getPublicUrl('logos', clienteId);
        setPreviewUrl(url);
      } catch (err) {
        // logo ainda não existe
      }
    };

    fetchLogo();
  }, [clienteId]);

  return (
    <div className="text-sm space-y-4">
      {previewUrl ? (
        <div className="flex items-center gap-4">
          <img src={previewUrl} alt="Logo" className="h-16 rounded shadow" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-muted transition"
          >
            Alterar logo
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-muted transition"
        >
          Enviar logo
        </button>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {uploading && <p className="text-white/70">Enviando logo...</p>}
    </div>
  );
}