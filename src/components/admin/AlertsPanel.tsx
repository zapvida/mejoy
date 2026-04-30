// src/components/admin/AlertsPanel.tsx
// Componente de painel de alertas

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';

interface Alert {
  id: string;
  ruleId: string;
  at: Date;
  severity: 'P0' | 'P1';
  message: string;
  status: 'open' | 'acked' | 'closed';
  metadata?: any;
}

interface AlertsPanelProps {
  data: Alert[] | null;
  loading: boolean;
  onRefresh: () => void;
  onAcknowledge: (_alertId: string) => void;
  onClose: (_alertId: string) => void;
  variant?: 'light' | 'dark';
}

export function AlertsPanel({ data, loading, onRefresh, onAcknowledge: _onAcknowledge, onClose: _onClose, variant = 'dark' }: AlertsPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const card = variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10';
  if (loading) {
    return (
      <div className={`${card} rounded-xl p-6 mb-8`}>
        <div className="h-6 bg-white/20 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-3 bg-white/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Erro ao carregar alertas</p>
      </div>
    );
  }

  const openAlerts = data.filter(alert => alert.status === 'open');
  const p0Alerts = openAlerts.filter(alert => alert.severity === 'P0');
  const p1Alerts = openAlerts.filter(alert => alert.severity === 'P1');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Alertas do Sistema</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <FiRefreshCw 
            size={16} 
            className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} 
          />
          <span className="text-sm text-white">Atualizar</span>
        </button>
      </div>

      {/* Resumo dos alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="text-red-400" size={16} />
            <h4 className="text-sm font-medium text-red-400">Críticos (P0)</h4>
          </div>
          <p className="text-2xl font-bold text-white">{p0Alerts.length}</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertTriangle className="text-yellow-400" size={16} />
            <h4 className="text-sm font-medium text-yellow-400">Importantes (P1)</h4>
          </div>
          <p className="text-2xl font-bold text-white">{p1Alerts.length}</p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiCheckCircle className="text-green-400" size={16} />
            <h4 className="text-sm font-medium text-green-400">Total Abertos</h4>
          </div>
          <p className="text-2xl font-bold text-white">{openAlerts.length}</p>
        </div>
      </div>

      {/* Lista de alertas */}
      {openAlerts.length === 0 ? (
        <div className="text-center py-8">
          <FiCheckCircle className="text-green-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-white mb-2">Nenhum Alerta Ativo</h3>
          <p className="text-white/60">Todos os sistemas estão funcionando normalmente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {openAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg p-4 border ${
                alert.severity === 'P0' 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAlertTriangle 
                      className={alert.severity === 'P0' ? 'text-red-400' : 'text-yellow-400'} 
                      size={16} 
                    />
                    <span className={`text-sm font-medium ${
                      alert.severity === 'P0' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {alert.severity === 'P0' ? 'CRÍTICO' : 'IMPORTANTE'}
                    </span>
                    <span className="text-xs text-white/60">
                      {new Date(alert.at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-white mb-2">{alert.message}</p>
                  {alert.metadata && (
                    <div className="text-xs text-white/60">
                      <details>
                        <summary className="cursor-pointer hover:text-white/80">
                          Detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-x-auto">
                          {JSON.stringify(alert.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => _onAcknowledge(alert.id)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded text-sm transition-colors"
                  >
                    Reconhecer
                  </button>
                  <button
                    onClick={() => _onClose(alert.id)}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
