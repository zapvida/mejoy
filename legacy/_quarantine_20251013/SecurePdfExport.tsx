// src/components/pdf/SecurePdfExport.tsx
// Componente de export PDF seguro com feature flag

import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/env';

interface SecurePdfExportProps {
  reportId: string;
  fileName?: string;
  className?: string;
}

export default function SecurePdfExport({ 
  reportId, 
  fileName = 'relatorio.pdf',
  className = '' 
}: SecurePdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Verificar feature flag PDF_V2
      if (!isFeatureEnabled('PDF_V2')) {
        // Fallback para window.print()
        window.print();
        return;
      }

      // Usar endpoint seguro
      const response = await fetch(`/api/pdf/${reportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
        body: JSON.stringify({
          reportId,
          format: 'A4',
          orientation: 'portrait'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar PDF');
      }

      // Download do PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Fallback para window.print() em caso de erro
      if (err instanceof Error && err.message.includes('501')) {
        window.print();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Botão principal de export */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Gerando PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Exportar PDF</span>
          </>
        )}
      </button>

      {/* Botão de impressão (sempre disponível) */}
      <button
        onClick={handlePrint}
        className="w-full flex items-center justify-center space-x-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span>Imprimir</span>
      </button>

      {/* Indicador de feature flag */}
      {!isFeatureEnabled('PDF_V2') && (
        <div className="text-xs text-gray-500 text-center">
          PDF V2 desabilitado - usando impressão do navegador
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Instruções */}
      <div className="text-xs text-gray-600 text-center">
        <p>O PDF será gerado com layout otimizado para impressão.</p>
        <p>Elementos de navegação e chat não serão incluídos.</p>
      </div>
    </div>
  );
}

// Hook para verificar se PDF V2 está habilitado
export function usePdfV2Status() {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/pdf/status');
        const data = await response.json();
        setIsEnabled(data.enabled);
      } catch {
        setIsEnabled(isFeatureEnabled('PDF_V2'));
      }
    };

    checkStatus();
  }, []);

  return {
    isEnabled,
    isLoading: isEnabled === null
  };
}
