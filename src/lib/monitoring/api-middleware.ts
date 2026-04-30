// src/lib/monitoring/api-middleware.ts
// Middleware de monitoração para APIs críticas

import { NextApiRequest, NextApiResponse } from 'next';

import { createRequestLogger, captureMetric, captureBusinessEvent } from './sentry';

export interface ApiMonitoringOptions {
  rateLimit?: {
    windowMs: number;
    maxRequests: number;
  };
  requireAuth?: boolean;
  logRequestBody?: boolean;
  logResponseBody?: boolean;
}

// Rate limiting em memória (em produção usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withApiMonitoring(
  handler: (_req: NextApiRequest, _res: NextApiResponse) => Promise<void>,
  options: ApiMonitoringOptions = {}
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const logger = createRequestLogger(req);
    const startTime = Date.now();
    const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
    
    try {
      // Rate limiting
      if (options.rateLimit) {
        const { windowMs, maxRequests } = options.rateLimit;
        const now = Date.now();
        const userLimit = rateLimitMap.get(ip);
        
        if (!userLimit || now > userLimit.resetTime) {
          rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
        } else if (userLimit.count >= maxRequests) {
          logger.warn('Rate limit exceeded', { ip, count: userLimit.count });
          return res.status(429).json({ error: 'Rate limit exceeded' });
        } else {
          userLimit.count++;
        }
      }

      // Autenticação obrigatória
      if (options.requireAuth) {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
          logger.warn('Unauthorized access attempt', { ip, route: req.url });
          return res.status(401).json({ error: 'Authentication required' });
        }
      }

      // Log da requisição
      logger.info('API request started', {
        method: req.method,
        url: req.url,
        ip,
        userAgent: req.headers['user-agent'],
        body: options.logRequestBody ? req.body : '[FILTERED]'
      });

      // Executar handler
      await handler(req, res);

      // Log da resposta
      const duration = Date.now() - startTime;
      logger.info('API request completed', {
        status: res.statusCode,
        duration,
        ip
      });

      // Capturar métricas
      captureMetric('api_response_time', duration, {
        route: req.url || 'unknown',
        method: req.method || 'unknown',
        status: res.statusCode.toString()
      });

      captureMetric('api_request_count', 1, {
        route: req.url || 'unknown',
        method: req.method || 'unknown',
        status: res.statusCode.toString()
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      
      logger.error('API request error', {
        error: error instanceof Error ? error : new Error(String(error)),
        status: res.statusCode,
        duration,
        ip
      });

      // Capturar métrica de erro
      captureMetric('api_error_count', 1, {
        route: req.url || 'unknown',
        method: req.method || 'unknown',
        error: error instanceof Error ? error.name : 'Unknown'
      });

      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
}

// Middleware específico para APIs de triagem
export function withTriageMonitoring(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return withApiMonitoring(handler, {
    rateLimit: {
      windowMs: 120 * 1000, // 2 minutos
      maxRequests: 500 // Muito generoso para permitir triagem completa
    },
    requireAuth: false, // Permitir anônimo para triagem gratuita
    logRequestBody: false // Não logar dados sensíveis de saúde
  });
}

// Middleware específico para APIs de TTS
export function withTtsMonitoring(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return withApiMonitoring(handler, {
    rateLimit: {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 3
    },
    requireAuth: true, // Exigir autenticação para TTS
    logRequestBody: false // Não logar conteúdo de áudio
  });
}

// Middleware específico para APIs de PDF
export function withPdfMonitoring(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return withApiMonitoring(handler, {
    rateLimit: {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 2
    },
    requireAuth: true, // Exigir autenticação para PDF
    logRequestBody: false // Não logar conteúdo de relatório
  });
}

// Middleware específico para APIs de Stripe
export function withStripeMonitoring(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return withApiMonitoring(handler, {
    rateLimit: {
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 10
    },
    requireAuth: false, // Stripe webhooks não têm auth tradicional
    logRequestBody: false // Não logar dados de pagamento
  });
}

// Função para capturar eventos de negócio específicos
export function captureTriageEvent(event: string, properties: Record<string, any> = {}) {
  captureBusinessEvent(`triage_${event}`, {
    ...properties,
    timestamp: new Date().toISOString()
  });
}

export function capturePaymentEvent(event: string, properties: Record<string, any> = {}) {
  captureBusinessEvent(`payment_${event}`, {
    ...properties,
    timestamp: new Date().toISOString()
  });
}

export function captureUserEvent(event: string, properties: Record<string, any> = {}) {
  captureBusinessEvent(`user_${event}`, {
    ...properties,
    timestamp: new Date().toISOString()
  });
}
