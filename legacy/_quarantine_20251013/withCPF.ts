import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import cookies from '@/utils/cookies';

/**
 * Middleware para validar e injetar o CPF do usuário a partir dos cookies.
 * Retorna erro 401 se o CPF não estiver presente.
 *
 * @param handler - Função NextApiHandler que será executada após validação do CPF.
 */
export function withCPF(handler: NextApiHandler) {
  return async (req: NextApiRequest & { cpf?: string }, res: NextApiResponse) => {
    const cpf = cookies.getCPF();

    if (!cpf) {
      return res.status(401).json({
        error: 'CPF não encontrado nos cookies. Acesso não autorizado.',
      });
    }

    req.cpf = cpf;

    return handler(req, res);
  };
}