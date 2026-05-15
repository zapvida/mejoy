import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  redact: {
    paths: [
      'email',
      'customerEmail',
      'customer_email',
      'phone',
      'customerPhone',
      'customer_phone',
      'cpf',
      'cpfCnpj',
      'customerCpf',
      'customer_cpf',
      'token',
      'accessToken',
      'authorization',
      'cookie',
      'creditCard',
      'card',
      'qrCode',
      'qrCodeBase64',
      'pixCode',
      'err.config.headers',
      'err.config.data',
      'err.response.config.headers',
      'err.response.config.data',
    ],
    censor: '[REDACTED]'
  },
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: { colorize: true, translateTime: 'SYS:standard' }
      },
  base: { service: 'zapfarm-web' }
});
