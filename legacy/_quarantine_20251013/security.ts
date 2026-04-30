// src/middleware/security.ts
// Middleware de segurança com headers e rate limiting

import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { setSecurityHeaders, rateLimit, logSecurityEvent } from '@/lib/security';

/**
 * Middleware de segurança que aplica headers de segurança e rate limiting
 */
export function withSecurity(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Aplicar headers de segurança
    setSecurityHeaders(res);
    
    // Rate limiting baseado no IP
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown';
    
    const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;
    
    // Rate limiting mais restritivo para APIs sensíveis
    const isSensitiveAPI = req.url?.includes('/api/privacy/') || 
                          req.url?.includes('/api/stripe/') ||
                          req.url?.includes('/api/triage/');
    
    const maxRequests = isSensitiveAPI ? 20 : 100;
    
    if (!rateLimit(identifier, maxRequests)) {
      logSecurityEvent('rate_limit_exceeded', {
        ip: identifier,
        url: req.url,
        userAgent: req.headers['user-agent']
      }, 'high');
      
      return res.status(429).json({
        error: 'Muitas requisições. Tente novamente em alguns minutos.',
        retryAfter: 900 // 15 minutos
      });
    }
    
    // Log de requisições suspeitas
    const userAgent = req.headers['user-agent'] || '';
    if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent === '') {
      logSecurityEvent('suspicious_user_agent', {
        ip: identifier,
        userAgent,
        url: req.url
      }, 'medium');
    }
    
    return handler(req, res);
  };
}

/**
 * Middleware específico para APIs de pagamento
 */
export function withPaymentSecurity(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Headers de segurança extras para pagamentos
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    
    // Rate limiting mais restritivo
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown';
    
    const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;
    
    if (!rateLimit(identifier, 10, 5 * 60 * 1000)) { // 10 requests em 5 minutos
      logSecurityEvent('payment_rate_limit_exceeded', {
        ip: identifier,
        url: req.url,
        userAgent: req.headers['user-agent']
      }, 'high');
      
      return res.status(429).json({
        error: 'Muitas tentativas de pagamento. Tente novamente em 5 minutos.',
        retryAfter: 300
      });
    }
    
    return handler(req, res);
  };
}

/**
 * Middleware para APIs de privacidade (LGPD)
 */
export function withPrivacySecurity(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Headers extras para APIs de privacidade
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    
    // Rate limiting muito restritivo
    const clientIP = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] || 
                    req.connection.remoteAddress || 
                    'unknown';
    
    const identifier = Array.isArray(clientIP) ? clientIP[0] : clientIP;
    
    if (!rateLimit(identifier, 5, 15 * 60 * 1000)) { // 5 requests em 15 minutos
      logSecurityEvent('privacy_rate_limit_exceeded', {
        ip: identifier,
        url: req.url,
        userAgent: req.headers['user-agent']
      }, 'high');
      
      return res.status(429).json({
        error: 'Muitas tentativas de acesso aos dados. Tente novamente em 15 minutos.',
        retryAfter: 900
      });
    }
    
    // Log de todas as tentativas de acesso a dados pessoais
    logSecurityEvent('privacy_api_access', {
      ip: identifier,
      url: req.url,
      method: req.method,
      userAgent: req.headers['user-agent']
    }, 'medium');
    
    return handler(req, res);
  };
}
