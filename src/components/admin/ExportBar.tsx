// src/components/admin/ExportBar.tsx
// Componente de barra de exportação

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiFileText, FiFile, FiPrinter } from 'react-icons/fi';

interface ExportBarProps {
  period: string;
  onExport: (_format: 'csv' | 'json' | 'pdf', _includePII: boolean) => void;
  loading: boolean;
  variant?: 'light' | 'dark';
}

export function ExportBar({ period, onExport, loading, variant = 'dark' }: ExportBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [includePII, setIncludePII] = useState(false);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true);
    try {
      await onExport(format, includePII);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10'} rounded-xl p-6 mb-8`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>Exportar Dados</h2>
        <div className="flex items-center gap-4">
          <label className={`flex items-center gap-2 text-sm ${variant === 'light' ? 'text-gray-600' : 'text-white/80'}`}>
            <input
              type="checkbox"
              checked={includePII}
              onChange={(e) => setIncludePII(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-green-500 focus:ring-green-500"
            />
            Incluir dados pessoais (PII)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting || loading}
          className="flex items-center justify-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiFileText className="text-green-400" size={20} />
          <div className="text-left">
            <p className={`text-sm font-medium ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>CSV</p>
            <p className={`text-xs ${variant === 'light' ? 'text-gray-500' : 'text-white/60'}`}>Planilha</p>
          </div>
          {isExporting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>}
        </button>

        <button
          onClick={() => handleExport('json')}
          disabled={isExporting || loading}
          className="flex items-center justify-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiFile className="text-blue-400" size={20} />
          <div className="text-left">
            <p className={`text-sm font-medium ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>JSON</p>
            <p className={`text-xs ${variant === 'light' ? 'text-gray-500' : 'text-white/60'}`}>Dados estruturados</p>
          </div>
          {isExporting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>}
        </button>

        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting || loading}
          className="flex items-center justify-center gap-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPrinter className="text-purple-400" size={20} />
          <div className="text-left">
            <p className={`text-sm font-medium ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>PDF</p>
            <p className={`text-xs ${variant === 'light' ? 'text-gray-500' : 'text-white/60'}`}>Relatório executivo</p>
          </div>
          {isExporting && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>}
        </button>
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <p className={`text-xs ${variant === 'light' ? 'text-gray-500' : 'text-white/60'}`}>
          <strong>Período:</strong> {period} | 
          <strong> PII:</strong> {includePII ? 'Incluído' : 'Mascarado'} | 
          <strong> Exportado em:</strong> {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
    </motion.div>
  );
}
