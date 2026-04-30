// src/pages/api/admin/export.ts
// API de exportação de dados

import type { NextApiRequest, NextApiResponse } from 'next';

import { ensureRole, UnauthorizedError } from '@/lib/rbac';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Verificar autorização
    const user = ensureRole(req, ['admin', 'analyst']);

    const format = req.query.format as string || 'csv';
    const period = req.query.period as string || '30d';
    const includePII = req.query.includePII === 'true';

    // Mock audit log
    console.log(`Audit log: ${user.id} exported ${format} for period ${period}, PII: ${includePII}`);

    // Mock de dados para exportação
    const exportData = {
      kpis: {
        totalUsers: 1250,
        activeUsers: 890,
        conversionRate: 0.15,
        revenue: 12500
      },
      funnel: {
        visitors: 5000,
        triages: 750,
        reports: 450,
        conversions: 125
      },
      revenue: {
        monthly: 12500,
        annual: 150000,
        growth: 0.25
      },
      product: {
        mostUsedTriage: 'gastro',
        avgSessionTime: 8.5,
        completionRate: 0.78
      },
      tech: {
        uptime: 99.9,
        avgResponseTime: 0.15,
        errorRate: 0.01
      },
      exportedAt: new Date().toISOString(),
      period,
      includePII,
    };

    switch (format) {
      case 'csv':
        return exportCSV(res, exportData);
      
      case 'json':
        return exportJSON(res, exportData);
      
      case 'pdf':
        return res.status(501).json({ error: 'Exportação PDF em desenvolvimento' });
      
      default:
        return res.status(400).json({ error: 'Formato não suportado' });
    }

  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ error: error.message });
    }
    
    console.warn("[admin] Error:", error?.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

function exportCSV(res: NextApiResponse, data: any) {
  const csv = convertToCSV(data);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="admin-export-${new Date().toISOString().split('T')[0]}.csv"`);
  
  return res.status(200).send(csv);
}

function exportJSON(res: NextApiResponse, data: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="admin-export-${new Date().toISOString().split('T')[0]}.json"`);
  
  return res.status(200).json(data);
}

function convertToCSV(data: any): string {
  const rows: string[] = [];
  
  // Cabeçalho
  rows.push('Métrica,Valor,Período');
  
  // KPIs
  if (data.kpis) {
    Object.entries(data.kpis).forEach(([key, value]) => {
      rows.push(`KPI.${key},"${value}",${data.period}`);
    });
  }
  
  // Funnel
  if (data.funnel) {
    Object.entries(data.funnel).forEach(([key, value]) => {
      rows.push(`FUNNEL.${key},"${value}",${data.period}`);
    });
  }
  
  // Revenue
  if (data.revenue) {
    Object.entries(data.revenue).forEach(([key, value]) => {
      rows.push(`REVENUE.${key},"${value}",${data.period}`);
    });
  }
  
  // Product
  if (data.product) {
    Object.entries(data.product).forEach(([key, value]) => {
      if (typeof value === 'object') {
        rows.push(`PRODUCT.${key},"${JSON.stringify(value)}",${data.period}`);
      } else {
        rows.push(`PRODUCT.${key},"${value}",${data.period}`);
      }
    });
  }
  
  // Tech
  if (data.tech) {
    Object.entries(data.tech).forEach(([key, value]) => {
      rows.push(`TECH.${key},"${value}",${data.period}`);
    });
  }
  
  return rows.join('\n');
}
