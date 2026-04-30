// src/lib/monitoring/sentry.ts
// Configuração de monitoração com Sentry

import * as Sentry from '@sentry/node';

// Configurar Sentry
export function initSentry() {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% das transações
      profilesSampleRate: 0.1, // 10% dos perfis
      beforeSend(event) {
        // Filtrar dados sensíveis
        if (event.request?.data) {
          event.request.data = '[FILTERED]';
        }
        return event;
      },
    });
  }
}

// Logger estruturado
export type LogContext = Record<string, unknown>;

export class StructuredLogger {
  private reqId: string;
  private userId?: string;
  private ip?: string;
  private route?: string;

  constructor(context: Partial<LogContext> = {}) {
    this.reqId = (context.reqId as string) || Math.random().toString(36).substring(7);
    this.userId = context.userId as string;
    this.ip = context.ip as string;
    this.route = context.route as string;
  }

  private formatMessage(level: string, message: string, context: LogContext = {}) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      reqId: this.reqId,
      userId: this.userId,
      ip: this.ip,
      route: this.route,
      ...context
    };

    // Enviar para Sentry se for erro
    if (level === 'error' && context.error) {
      Sentry.withScope((scope) => {
        scope.setTag('reqId', this.reqId);
        scope.setTag('userId', this.userId || 'anonymous');
        scope.setTag('route', this.route || 'unknown');
        scope.setContext('request', {
          ip: this.ip,
          route: this.route,
          status: context.status,
          duration: context.duration
        });
        scope.setContext('metadata', (context.metadata as Record<string, any>) || {});
        Sentry.captureException(context.error);
      });
    }

    return JSON.stringify(logData);
  }

  info(message: string, context: LogContext = {}) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context: LogContext = {}) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context: LogContext = {}) {
    console.error(this.formatMessage('error', message, context));
  }

  debug(message: string, context: LogContext = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

// Helper para criar logger com contexto de request
export function createRequestLogger(req: any): StructuredLogger {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const route = req.url || 'unknown';
  
  return new StructuredLogger({
    ip: Array.isArray(ip) ? ip[0] : ip,
    route
  });
}

// Middleware para logging automático
export function requestLoggingMiddleware(req: any, res: any, next: any) {
  const logger = createRequestLogger(req);
  const startTime = Date.now();

  // Log da requisição
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent']
  });

  // Interceptar resposta
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      status: res.statusCode,
      duration,
      contentLength: data?.length || 0
    });

    return originalSend.call(this, data);
  };

  // Interceptar erros
  res.on('error', (error: Error) => {
    const duration = Date.now() - startTime;
    
    logger.error('Request error', {
      error,
      status: res.statusCode,
      duration
    });
  });

  next();
}

// Função para capturar métricas customizadas
export function captureMetric(name: string, value: number, tags: Record<string, string> = {}) {
  Sentry.addBreadcrumb({
    category: 'metric',
    message: `${name}: ${value}`,
    data: { name, value, tags },
    level: 'info'
  });
}

// Função para capturar eventos de negócio
export function captureBusinessEvent(event: string, properties: Record<string, any> = {}) {
  Sentry.addBreadcrumb({
    category: 'business',
    message: event,
    data: properties,
    level: 'info'
  });
}

// Função para monitorar performance de APIs
export function monitorApiPerformance(apiName: string, fn: () => Promise<any>) {
  return async (...args: any[]) => {
    const startTime = Date.now();
    
    try {
      const result = await (fn as (...a: any[]) => any)(...(args as any[]));
      const duration = Date.now() - startTime;
      
      captureMetric('api_performance', duration, {
        api: apiName,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      captureMetric('api_performance', duration, {
        api: apiName,
        status: 'error'
      });
      
      throw error;
    }
  };
}
