// src/lib/admin-cache.ts
// Sistema de cache em memória para APIs admin

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class AdminCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 30 * 1000; // 30 segundos

  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Gerar chave de cache baseada em parâmetros
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${prefix}:${sortedParams}`;
  }

  // Cache específico para diferentes tipos de dados
  setKPIs(data: any, period: string): void {
    this.set(`kpis:${period}`, data, 30 * 1000);
  }

  getKPIs(period: string): any | null {
    return this.get(`kpis:${period}`);
  }

  setFunnel(data: any, period: string): void {
    this.set(`funnel:${period}`, data, 30 * 1000);
  }

  getFunnel(period: string): any | null {
    return this.get(`funnel:${period}`);
  }

  setRevenue(data: any, period: string): void {
    this.set(`revenue:${period}`, data, 30 * 1000);
  }

  getRevenue(period: string): any | null {
    return this.get(`revenue:${period}`);
  }

  setProduct(data: any, period: string): void {
    this.set(`product:${period}`, data, 30 * 1000);
  }

  getProduct(period: string): any | null {
    return this.get(`product:${period}`);
  }

  setTech(data: any): void {
    this.set('tech', data, 60 * 1000); // 1 minuto para dados técnicos
  }

  getTech(): any | null {
    return this.get('tech');
  }

  setAlerts(data: any): void {
    this.set('alerts', data, 10 * 1000); // 10 segundos para alertas
  }

  getAlerts(): any | null {
    return this.get('alerts');
  }
}

export const adminCache = new AdminCache();
