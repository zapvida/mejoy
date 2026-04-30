export type EmailTemplate = 
  | 'triage-completed'
  | 'report-ready'
  | 'payment-confirmed'
  | 'welcome'
  | 'password-reset'
  | 'gift-received'
  | 'subscription-renewal'
  | 'follow-up-d1'
  | 'follow-up-d3'
  | 'follow-up-d7'
  | 'store-v2-order-confirmed'
  | 'store-v2-order-shipped'
  | 'store-v2-order-delivered';

export interface EmailData {
  to: string | string[];
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplateData {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  reportUrl?: string;
  triageType?: string;
  productName?: string;
  amount?: number;
  paymentMethod?: string;
  orderId?: string;
  giftCode?: string;
  giftMessage?: string;
  unsubscribeUrl?: string;
  [key: string]: any;
}

