// TODO(backcompat-2025-10-23) - Shims/declarações externas para compatibilidade
declare module 'qrcode';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (..._args: any[]) => void;
  }
}

export {};
