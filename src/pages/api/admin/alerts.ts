// src/pages/api/admin/alerts.ts
// API de alertas do sistema

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verificar autorização
    ensureRole(req, ['admin', 'analyst']);
    
    switch (req.method) {
      case 'GET':
        return await handleGetAlerts(req, res);
      
      case 'POST':
        return await handleEvaluateAlerts(req, res);
      
      case 'PATCH':
        return await handleUpdateAlert(req, res);
      
      default:
        return res.status(405).json({ error: 'Método não permitido' });
    }

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    
    console.warn("[admin] Error:", error?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

async function handleGetAlerts(req: NextApiRequest, res: NextApiResponse) {
  // Mock de alertas para demonstração
  const alerts = [
    {
      id: 'alert-1',
      type: 'performance',
      level: 'warning',
      message: 'Tempo de resposta da API aumentou em 15%',
      timestamp: new Date().toISOString(),
      status: 'active'
    },
    {
      id: 'alert-2',
      type: 'security',
      level: 'info',
      message: 'Tentativa de acesso não autorizado detectada',
      timestamp: new Date().toISOString(),
      status: 'acknowledged'
    }
  ];
  
  return res.status(200).json({
    alerts,
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length
  });
}

async function handleEvaluateAlerts(req: NextApiRequest, res: NextApiResponse) {
  // Mock de avaliação de alertas
  const newAlerts = [
    {
      id: 'alert-new-1',
      type: 'system',
      level: 'info',
      message: 'Sistema funcionando normalmente',
      timestamp: new Date().toISOString(),
      status: 'active'
    }
  ];
  
  return res.status(200).json({
    message: 'Alertas avaliados',
    newAlerts: newAlerts.length,
    alerts: newAlerts
  });
}

async function handleUpdateAlert(req: NextApiRequest, res: NextApiResponse) {
  const { alertId, action } = req.body;
  
  if (!alertId || !action) {
    return res.status(400).json({ error: 'alertId e action são obrigatórios' });
  }

  if (!['ack', 'close'].includes(action)) {
    return res.status(400).json({ error: 'Ação inválida' });
  }
  
  return res.status(200).json({ 
    message: 'Alerta atualizado com sucesso',
    alertId,
    action
  });
}
