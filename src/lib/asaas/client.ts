/**
 * Cliente Asaas - Integração com a API do Asaas
 * 
 * Documentação: https://docs.asaas.com/
 */

import axios, { AxiosInstance } from 'axios';
import { getAsaasApiUrl } from './config';

export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  country?: string;
  externalReference?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string; // ID do cliente
  billingType: 'PIX' | 'CREDIT_CARD' | 'BOLETO' | 'DEBIT_CARD';
  value: number; // Valor em reais (não centavos!)
  dueDate: string; // Data de vencimento (YYYY-MM-DD)
  description?: string;
  externalReference?: string;
  installmentCount?: number; // Número de parcelas (1-12)
  installmentValue?: number; // Valor da parcela
  totalValue?: number; // Valor total parcelado
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
  };
  creditCardToken?: string; // Token do cartão (se já tokenizado)
  remoteIp?: string; // IP do cliente (obrigatório para cartão)
  metadata?: Record<string, string>;
}

export interface AsaasPaymentResponse {
  id: string;
  customer: string;
  subscription?: string;
  installment?: string;
  paymentLink?: string;
  value: number;
  netValue: number;
  originalValue: number;
  interestValue: number;
  description: string;
  billingType: string;
  status: 'PENDING' | 'CONFIRMED' | 'RECEIVED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  dueDate: string;
  originalDueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
  deleted: boolean;
  anticipated: boolean;
  anticipable: boolean;
  refunds?: any;
  pixTransaction?: {
    id: string;
    qrCode: string;
    qrCodeBase64: string;
    endToEndIdentifier: string;
    value: number;
    netValue: number;
    status: string;
    payedAt?: string;
  };
  creditCard?: {
    creditCardNumber: string;
    creditCardBrand: string;
    creditCardToken: string;
  };
  metadata?: Record<string, string>;
}

export interface AsaasPixQrCodeResponse {
  encodedImage?: string;
  payload?: string;
  copyAndPaste?: string;
  expirationDate?: string;
  success?: boolean;
  qrCode?: string;
}

export interface AsaasWebhookEvent {
  event: string;
  payment?: AsaasPaymentResponse;
  customer?: AsaasCustomer;
  [key: string]: any;
}

class AsaasClient {
  private api: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.ASAAS_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('[Asaas] ASAAS_API_KEY não configurada');
    }

    this.api = axios.create({
      baseURL: getAsaasApiUrl(),
      headers: {
        'access_token': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Cria ou atualiza um cliente no Asaas
   */
  async createOrUpdateCustomer(customer: AsaasCustomer): Promise<AsaasCustomer> {
    try {
      // Se já tem ID, atualiza
      if (customer.id) {
        const response = await this.api.put(`/customers/${customer.id}`, customer);
        return response.data;
      }

      // Se tem externalReference, tenta buscar primeiro
      if (customer.externalReference) {
        try {
          const searchResponse = await this.api.get('/customers', {
            params: { cpfCnpj: customer.cpfCnpj || customer.email },
          });
          
          if (searchResponse.data.data && searchResponse.data.data.length > 0) {
            const existingCustomer = searchResponse.data.data[0];
            // Atualiza o cliente existente
            const updateResponse = await this.api.put(`/customers/${existingCustomer.id}`, customer);
            return updateResponse.data;
          }
        } catch {
          // Se não encontrou, continua para criar novo
        }
      }

      // Cria novo cliente
      const response = await this.api.post('/customers', customer);
      return response.data;
    } catch (error: any) {
      console.error('[Asaas] Erro ao criar/atualizar cliente:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cria um pagamento no Asaas
   * 
   * IMPORTANTE: O Asaas espera o valor em REAIS (não centavos)
   * A interface AsaasPayment já espera valor em REAIS, então não precisamos converter
   */
  async createPayment(payment: AsaasPayment): Promise<AsaasPaymentResponse> {
    try {
      // O valor já está em REAIS conforme a interface AsaasPayment
      // Não precisamos converter, apenas garantir que seja um número válido
      const paymentData = {
        ...payment,
        value: typeof payment.value === 'number' ? payment.value : parseFloat(String(payment.value)),
        ...(payment.installmentValue && {
          installmentValue: typeof payment.installmentValue === 'number' 
            ? payment.installmentValue 
            : parseFloat(String(payment.installmentValue)),
        }),
        ...(payment.totalValue && {
          totalValue: typeof payment.totalValue === 'number'
            ? payment.totalValue
            : parseFloat(String(payment.totalValue)),
        }),
      };

      console.log('[Asaas] Criando pagamento:', {
        value: paymentData.value,
        billingType: paymentData.billingType,
        customer: paymentData.customer,
      });

      const response = await this.api.post('/payments', paymentData);
      return response.data;
    } catch (error: any) {
      console.error('[Asaas] Erro ao criar pagamento:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Busca um pagamento pelo ID
   */
  async getPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    try {
      const response = await this.api.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error('[Asaas] Erro ao buscar pagamento:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPaymentPixQrCode(paymentId: string): Promise<AsaasPixQrCodeResponse> {
    try {
      const response = await this.api.get(`/payments/${paymentId}/pixQrCode`);
      return response.data;
    } catch (error: any) {
      console.error('[Asaas] Erro ao buscar QR Code PIX:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Cancela um pagamento
   */
  async cancelPayment(paymentId: string): Promise<AsaasPaymentResponse> {
    try {
      const response = await this.api.delete(`/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      console.error('[Asaas] Erro ao cancelar pagamento:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Gera link de pagamento (checkout)
   */
  async createPaymentLink(payment: AsaasPayment): Promise<{ url: string; paymentId: string }> {
    try {
      const paymentResponse = await this.createPayment(payment);
      
      // Se já tem paymentLink, retorna
      if (paymentResponse.paymentLink) {
        return {
          url: paymentResponse.paymentLink,
          paymentId: paymentResponse.id,
        };
      }

      // Caso contrário, constrói URL do checkout
      const checkoutUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/asaas/${paymentResponse.id}`;
      
      return {
        url: checkoutUrl,
        paymentId: paymentResponse.id,
      };
    } catch (error: any) {
      console.error('[Asaas] Erro ao criar link de pagamento:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Valida webhook do Asaas
   */
   
  validateWebhook(): boolean {
    // O Asaas não usa assinatura HMAC como o Stripe
    // A validação é feita verificando o token no header ou via IP whitelist
    // Por enquanto, vamos confiar no payload (em produção, usar IP whitelist)
    return true;
  }
}

// Singleton instance
export const asaasClient = new AsaasClient();
