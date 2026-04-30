/**
 * Evolution API client - envio de mensagens WhatsApp
 * Usado exclusivamente para Magic Link pós-triagem.
 * GHL continua para CRM/oportunidades.
 */

const EVOLUTION_ENABLED = process.env.EVOLUTION_MAGIC_LINK_ENABLED === 'true' || process.env.EVOLUTION_MAGIC_LINK_ENABLED === '1';

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 10 && digits.length <= 11) {
    return `55${digits}`;
  }
  if (digits.length >= 12 && digits.startsWith('55')) {
    return digits;
  }
  return `55${digits}`;
}

export interface SendResult {
  success: boolean;
  error?: string;
}

/**
 * Envia mensagem de texto via Evolution API.
 * Se EVOLUTION_MAGIC_LINK_ENABLED=false, retorna success sem enviar.
 */
export async function sendEvolutionMessage(phone: string, message: string): Promise<SendResult> {
  if (!EVOLUTION_ENABLED) {
    return { success: true };
  }

  const baseUrl = process.env.EVOLUTION_API_URL;
  const instance = process.env.EVOLUTION_INSTANCE || 'alloehealth';
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!baseUrl || !apiKey) {
    console.warn('[evolution] EVOLUTION_API_URL ou EVOLUTION_API_KEY não configurados');
    return { success: false, error: 'Evolution API não configurada' };
  }

  const normalized = normalizePhone(phone);
  // Evolution API: ajustar path conforme versão (ex: /message/sendText ou /chat/sendText)
  const url = `${baseUrl.replace(/\/$/, '')}/message/sendText/${instance}`;

  const payload = {
    number: normalized,
    text: message,
  };

  const maxRetries = 2;
  let lastError: string | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': apiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        return { success: true };
      }

      lastError = (data as { message?: string })?.message || `HTTP ${res.status}`;

      if (res.status >= 400 && res.status < 500) {
        console.warn('[evolution] Erro cliente (sem retry):', res.status, lastError);
        return { success: false, error: lastError };
      }

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  console.error('[evolution] Falha após retries:', lastError);
  return { success: false, error: lastError };
}

/**
 * Envia mensagem para Store V2 RX (não depende de EVOLUTION_MAGIC_LINK_ENABLED)
 */
export async function sendEvolutionMessageStoreV2(phone: string, message: string): Promise<SendResult> {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  if (!baseUrl || !apiKey) {
    return { success: false, error: 'Evolution API não configurada' };
  }
  const normalized = normalizePhone(phone);
  const instance = process.env.EVOLUTION_INSTANCE || 'alloehealth';
  const url = `${baseUrl.replace(/\/$/, '')}/message/sendText/${instance}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify({ number: normalized, text: message }),
    });
    if (res.ok) return { success: true };
    const data = await res.json().catch(() => ({}));
    return { success: false, error: (data as { message?: string })?.message || `HTTP ${res.status}` };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Envia mídia (imagem/documento) via Evolution API
 */
export async function sendEvolutionMedia(
  phone: string,
  mediaUrl: string,
  caption?: string
): Promise<SendResult> {
  if (!EVOLUTION_ENABLED) {
    return { success: true };
  }

  const baseUrl = process.env.EVOLUTION_API_URL;
  const instance = process.env.EVOLUTION_INSTANCE || 'alloehealth';
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!baseUrl || !apiKey) {
    return { success: false, error: 'Evolution API não configurada' };
  }

  const normalized = normalizePhone(phone);
  const url = `${baseUrl.replace(/\/$/, '')}/message/sendMedia/${instance}`;

  const payload = {
    number: normalized,
    mediatype: 'document',
    media: mediaUrl,
    ...(caption && { caption }),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return { success: true };
    return { success: false, error: (data as { message?: string })?.message || `HTTP ${res.status}` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}
