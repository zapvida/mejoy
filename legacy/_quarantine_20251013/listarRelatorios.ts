import { NextApiRequest, NextApiResponse } from 'next';
import { DatabaseService } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cpf } = req.query;

  if (!cpf) return res.status(400).json({ error: 'CPF é obrigatório.' });

  try {
    const cpfString = String(cpf).replace(/\D/g, '');
    
    // Buscar paciente pelo CPF (email)
    const patient = await DatabaseService.findPatientByEmail(cpfString);
    if (!patient) {
      return res.status(404).json({ error: '👤 Paciente não encontrado.' });
    }

    const reports = await DatabaseService.getReportsByPatient(patient.id);

    const data = reports.map(report => {
      const summary = report.summary as any || {};
      const plan = report.plan as any || {};
      
      return {
        id: report.id,
        titulo: summary.titulo || `Relatório - ${report.type?.toUpperCase()}` || 'Relatório Sem Título',
        criadoEm: report.created_at?.toISOString(),
        atualizadoEm: report.updated_at?.toISOString(),
        status: report.rawPremium ? 'premium' : 'gratuito',
        tipo: report.type || '',
        score: report.score || 0,
        scoreFuturo: report.scoreFuture || 0,
        hipoteses: summary.hipoteses || '',
        causas: summary.causas || '',
        fisiopatologia: summary.fisiopatologia || '',
        elucidacao: summary.elucidacao || '',
        condutas: summary.condutas || '',
        planoAcao: plan || {},
      };
    });

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erro ao listar relatórios:', error);
    return res.status(500).json({ error: error.message });
  }
}