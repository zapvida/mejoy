// src/lib/rbac.ts
// Sistema de controle de acesso baseado em roles (RBAC)

import { NextApiRequest } from 'next';

export type AdminRole = 'admin' | 'analyst';

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
  has2FA: boolean;
  lastLogin?: Date;
}

// BEGIN patch: UnauthorizedError dedicada
export class UnauthorizedError extends Error {
  constructor(message = "Não autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export function checkAdminAccess(req: NextApiRequest): AdminUser {
  const user = getAdminUser(req);
  
  if (!user) {
    throw new UnauthorizedError("Token de acesso não fornecido");
  }

  return user;
}
// END patch

// Mock de usuários admin (em produção, usar banco de dados)
const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'admin@zapfarm.com.br',
    role: 'admin',
    has2FA: true,
  },
  {
    id: 'analyst-1',
    email: 'analyst@zapfarm.com.br',
    role: 'analyst',
    has2FA: false,
  },
];

export function getAdminUser(req: NextApiRequest): AdminUser | null {
  // Verificação básica por header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const secret = process.env.ADMIN_SECRET_KEY || process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || 'admin-secret-key';

  if (token === secret) {
    return ADMIN_USERS[0]; // admin padrão
  }

  return null;
}

export function ensureRole(req: NextApiRequest, allowedRoles: AdminRole[]): AdminUser {
  const user = getAdminUser(req);
  
  if (!user) {
    throw new UnauthorizedError('Token de acesso não fornecido');
  }

  if (!allowedRoles.includes(user.role)) {
    throw new UnauthorizedError(`Role ${user.role} não permitida`);
  }

  return user;
}

export function require2FA(req: NextApiRequest): AdminUser {
  const user = ensureRole(req, ['admin', 'analyst']);
  
  if (user.role === 'admin' && !user.has2FA) {
    throw new Error('2FA obrigatório para administradores');
  }

  return user;
}

export function checkIPAllowlist(req: NextApiRequest): boolean {
  // TODO(backcompat-2025-10-23) - ADMIN_IP_ALLOWLIST opcional
  if (!process.env.ADMIN_IP_ALLOWLIST) {
    return true; // Sem restrição de IP
  }

  const clientIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress ||
                   req.socket.remoteAddress;

  if (!clientIP) {
    return false;
  }

  // TODO(backcompat-2025-10-23) - ADMIN_IP_ALLOWLIST opcional
  const allowedIPs = process.env.ADMIN_IP_ALLOWLIST!.split(',').map((ip: string) => ip.trim());
  return allowedIPs.includes(clientIP.toString());
}

export function maskPII(data: any): any {
  if (typeof data === 'string') {
    // Mascarar emails
    if (data.includes('@')) {
      const [local, domain] = data.split('@');
      return `${local.substring(0, 2)}***@${domain}`;
    }
    
    // Mascarar telefones
    if (data.match(/^\d{10,11}$/)) {
      return `${data.substring(0, 2)}****${data.substring(data.length - 2)}`;
    }
    
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(maskPII);
  }

  if (data && typeof data === 'object') {
    const masked: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (['email', 'whatsapp', 'phone', 'telefone'].includes(key.toLowerCase())) {
        masked[key] = maskPII(value);
      } else {
        masked[key] = maskPII(value);
      }
    }
    return masked;
  }

  return data;
}

export function hashIP(ip: string): string {
  // Hash simples do IP para logs (em produção, usar crypto)
  return Buffer.from(ip).toString('base64').substring(0, 16);
}
