// src/components/admin/TechHealth.tsx
// Componente de saúde técnica do sistema

import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiActivity, FiDatabase, FiServer } from 'react-icons/fi';

interface TechData {
  apiUptime: number;
  avgResponseTime: number;
  errorRate: number;
  dbConnections: number;
  dbResponseTime: number;
  dbSize: number;
  openaiStatus: 'healthy' | 'degraded' | 'down';
  stripeStatus: 'healthy' | 'degraded' | 'down';
  supabaseStatus: 'healthy' | 'degraded' | 'down';
  lighthouseScore: number;
}

interface TechHealthProps {
  data: TechData | null;
  loading: boolean;
  variant?: 'light' | 'dark';
}

export function TechHealth({ data, loading, variant = 'dark' }: TechHealthProps) {
  const card = variant === 'light' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-white/5 backdrop-blur-md border border-white/10';
  if (loading) {
    return (
      <div className={`${card} rounded-xl p-6 mb-8`}>
        <div className="h-6 bg-white/20 rounded mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-6 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <p className="text-red-600">Erro ao carregar dados técnicos</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <FiCheckCircle className="text-green-400" size={20} />;
      case 'degraded':
        return <FiAlertCircle className="text-yellow-400" size={20} />;
      case 'down':
        return <FiXCircle className="text-red-400" size={20} />;
      default:
        return <FiActivity className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400';
      case 'degraded':
        return 'text-yellow-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatBytes = (bytes: number | undefined | null) => {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(k)), sizes.length - 1);
    return parseFloat((n / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const safe = {
    apiUptime: Number(data.apiUptime) || 0,
    avgResponseTime: Number(data.avgResponseTime) || 0,
    errorRate: Number(data.errorRate) || 0,
    dbConnections: Number(data.dbConnections) || 0,
    dbResponseTime: Number(data.dbResponseTime) || 0,
    dbSize: Number(data.dbSize) || 0,
    lighthouseScore: Number(data.lighthouseScore) || 0,
    openaiStatus: data.openaiStatus || 'healthy',
    stripeStatus: data.stripeStatus || 'healthy',
    supabaseStatus: data.supabaseStatus || 'healthy',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${card} rounded-xl p-6 mb-8`}
    >
      <h2 className="text-xl font-bold text-white mb-6">Saúde Técnica do Sistema</h2>
      
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Uptime da API</h4>
            <FiServer className="text-blue-400" size={16} />
          </div>
          <p className={`text-2xl font-bold ${
            safe.apiUptime >= 99.9 ? 'text-green-400' :
            safe.apiUptime >= 99.0 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {safe.apiUptime.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Tempo de Resposta</h4>
            <FiActivity className="text-green-400" size={16} />
          </div>
          <p className={`text-2xl font-bold ${
            safe.avgResponseTime <= 200 ? 'text-green-400' :
            safe.avgResponseTime <= 500 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {safe.avgResponseTime}ms
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Taxa de Erro</h4>
            <FiAlertCircle className="text-red-400" size={16} />
          </div>
          <p className={`text-2xl font-bold ${
            safe.errorRate <= 0.1 ? 'text-green-400' :
            safe.errorRate <= 1.0 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {safe.errorRate.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-white">Lighthouse Score</h4>
            <FiCheckCircle className="text-purple-400" size={16} />
          </div>
          <p className={`text-2xl font-bold ${
            safe.lighthouseScore >= 90 ? 'text-green-400' :
            safe.lighthouseScore >= 80 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {safe.lighthouseScore}
          </p>
        </div>
      </div>

      {/* Status dos serviços */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Status dos Serviços</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">OpenAI</h4>
              {getStatusIcon(safe.openaiStatus)}
            </div>
            <p className={`text-sm font-medium ${getStatusColor(safe.openaiStatus)}`}>
              {safe.openaiStatus === 'healthy' ? 'Operacional' :
               safe.openaiStatus === 'degraded' ? 'Degradado' : 'Indisponível'}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Stripe</h4>
              {getStatusIcon(safe.stripeStatus)}
            </div>
            <p className={`text-sm font-medium ${getStatusColor(safe.stripeStatus)}`}>
              {safe.stripeStatus === 'healthy' ? 'Operacional' :
               safe.stripeStatus === 'degraded' ? 'Degradado' : 'Indisponível'}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Supabase</h4>
              {getStatusIcon(safe.supabaseStatus)}
            </div>
            <p className={`text-sm font-medium ${getStatusColor(safe.supabaseStatus)}`}>
              {safe.supabaseStatus === 'healthy' ? 'Operacional' :
               safe.supabaseStatus === 'degraded' ? 'Degradado' : 'Indisponível'}
            </p>
          </div>
        </div>
      </div>

      {/* Métricas do banco de dados */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Banco de Dados</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Conexões Ativas</h4>
              <FiDatabase className="text-blue-400" size={16} />
            </div>
            <p className={`text-xl font-bold ${
              safe.dbConnections <= 10 ? 'text-green-400' :
              safe.dbConnections <= 20 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {safe.dbConnections}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Tempo de Resposta</h4>
              <FiActivity className="text-green-400" size={16} />
            </div>
            <p className={`text-xl font-bold ${
              safe.dbResponseTime <= 50 ? 'text-green-400' :
              safe.dbResponseTime <= 100 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {safe.dbResponseTime}ms
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Tamanho do DB</h4>
              <FiDatabase className="text-purple-400" size={16} />
            </div>
            <p className={`text-xl font-bold ${
              safe.dbSize <= 100 * 1024 * 1024 ? 'text-green-400' : // 100MB
              safe.dbSize <= 500 * 1024 * 1024 ? 'text-yellow-400' : // 500MB
              'text-red-400'
            }`}>
              {formatBytes(safe.dbSize)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
