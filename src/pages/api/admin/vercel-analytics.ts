// src/pages/api/admin/vercel-analytics.ts
// API para buscar métricas do Vercel Analytics

import { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método não permitido' });
  }

  try {
    // Verificar autorização
    await ensureRole(req, ['admin', 'analyst']);
    
    // Por enquanto, retornar dados mockados até configurar o token do Vercel
    // TODO: Implementar integração real com Vercel API quando tivermos o token
    const mockData = {
      pageViews: 0,
      visitors: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
      topPages: [],
      referrers: [],
      countries: [],
      devices: [],
      performance: {
        avgLoadTime: 0,
        coreWebVitals: {
          lcp: 0,
          fid: 0,
          cls: 0
        }
      },
      errors: {
        errorRate: 0,
        totalErrors: 0,
        errorTypes: []
      }
    };

    res.status(200).json({
      success: true,
      data: mockData,
      message: 'Vercel Analytics integrado - aguardando configuração do token'
    });

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ 
        success: false, 
        error: error.message 
      });
    }
    
    console.warn("[admin] Error:", error?.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor'
    });
  }
}
