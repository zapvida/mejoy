// src/pages/b2b/configuracoes.tsx
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/buttons';
import { Input } from '@/components/ui/inputs';
import { useAuth } from '@/context/AuthContext';
import { storageService } from '@/lib/storage';

export default function ConfiguracoesClientePage() {
  const { user, loading } = useAuth();
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!user) return;
      
      // TODO: Implementar busca de dados do cliente via API Supabase
      // Por enquanto, manter estado vazio
      setNomeFantasia('');
      setLogoUrl('');
    };
    
    if (!loading) fetchCliente();
  }, [user, loading]);

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    
    try {
      // Upload para Supabase Storage
      const { error } = await storageService.uploadFile(
        'clientes',
        `${user.id}/logo.png`,
        file
      );

      if (error) {
        console.error('Erro no upload:', error);
        return;
      }

      // Obter URL pública
      const url = await storageService.getPublicUrl('clientes', `${user.id}/logo.png`);
      setLogoUrl(url);

      // TODO: Atualizar dados do cliente via API
      // await fetch('/api/clientes/update-logo', { ... });
      
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSalvando(true);
    
    try {
      // TODO: Implementar salvamento via API Supabase
      // await fetch('/api/clientes/update', { ... });
      
      console.log('Dados salvos:', { nomeFantasia, logoUrl });
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Faça login para acessar as configurações.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configurações do Cliente</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nome Fantasia</label>
            <Input
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
              placeholder="Digite o nome fantasia"
              className="bg-background border-border text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <div className="space-y-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-16 rounded shadow" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadLogo}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-black hover:file:bg-green-400"
              />
              {uploading && <p className="text-muted-foreground">Enviando logo...</p>}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={salvando}
            className="bg-green-500 hover:bg-green-600 text-black font-medium"
          >
            {salvando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              'Salvar Configurações'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}