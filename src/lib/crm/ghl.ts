import { detectTenantByHost } from '@/lib/tenancy/tenant';

// TODO(backcompat-2025-10-23) - Tipo FetchArgs para GHL client
type FetchArgs = { 
  path: string; 
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'; 
  body?: any 
};

const base = process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com';
const locationId = process.env.GHL_LOCATION_ID!;
const apiKey = process.env.GHL_API_KEY!;
const apiVersion = process.env.GHL_API_VERSION || '2021-07-28';

function headers() {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Version': apiVersion,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'LocationId': locationId
  };
}

async function ghlFetch<T=any>({ path, method='POST', body }: FetchArgs): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(()=>'');
    throw new Error(`[GHL ${method} ${path}] ${res.status} ${text}`);
  }
  return res.json();
}

/** Upsert de contato no GHL */
export async function upsertContact(input: {
  name?: string, email?: string, phone?: string, utm?: any
}) {
  const body: any = {
    // endpoint usual do LeadConnector para upsert de contatos
    // ajuste se sua conta usar rota diferente (contacts/ ou contacts/upsert)
    // manteremos contacts/upsert como padrão:
    // doc: LeadConnector "Contacts" API
    contact: {
      firstName: input?.name || undefined,
      email: input?.email || undefined,
      phone: input?.phone || undefined,
      source: input?.utm?.source || undefined,
      customFields: Object.entries(input?.utm||{}).map(([k,v])=>({ id: k, value: String(v) }))
    }
  };
  const resp = await ghlFetch<{contact:{id:string}}>({ path:'/contacts/upsert', body });
  return resp?.contact?.id;
}

/** Cria/move oportunidade no pipeline */
export async function upsertOpportunity(input: {
  contactId: string;
  pipelineId: string;
  stageId: string;
  title: string;
  monetary?: number;
  notes?: string;
}) {
  const body = {
    opportunity: {
      contactId: input.contactId,
      pipelineId: input.pipelineId,
      stageId: input.stageId,
      name: input.title,
      monetaryValue: input.monetary ?? 0,
      notes: input.notes,
    }
  };
  const resp = await ghlFetch<{opportunity:{id:string}}>({ path:'/opportunities/upsert', body });
  return resp?.opportunity?.id;
}

/** Envia mensagem (WhatsApp/SMS/Email) via Conversations */
export async function sendMessage(input: {
  contactId: string; message: string; channel?: 'whatsapp'|'sms'|'email'
}) {
  const body = {
    conversation: {
      contactId: input.contactId,
      message: input.message,
      type: input.channel || 'whatsapp'
    }
  };
  return ghlFetch({ path:'/conversations/messages', body });
}

export async function upsertOpportunityPerTenant(args: {
  reqHost?: string;
  contactId: string;
  stage: 'visit'|'triage'|'checkout'|'won';
  title: string;
  monetary?: number;
  notes?: string;
}) {
  const t = detectTenantByHost(args.reqHost);
  const stageIdMap = t.ghl.stage;
  const stageId = stageIdMap[args.stage];
  
  return upsertOpportunity({
    contactId: args.contactId,
    pipelineId: t.ghl.pipelineId,
    stageId,
    title: args.title,
    monetary: args.monetary,
    notes: args.notes
  });
}

export async function markWonAndOnboard(input: {
  email?: string; phone?: string; name?: string; utm?: any; title?: string; amount?: number;
}) {
  const contactId = await upsertContact({
    email: input.email, phone: input.phone, name: input.name, utm: input.utm
  });
  await upsertOpportunity({
    contactId, pipelineId: process.env.GHL_PIPELINE_ID!, stageId: process.env.GHL_STAGE_WON!,
    title: input.title || 'Pagamento aprovado', monetary: input.amount
  });
  await sendMessage({
    contactId, message: 'Pagamento confirmado! Instruções enviadas ao seu e-mail/WhatsApp. Qualquer dúvida, estou aqui.',
    channel: 'whatsapp'
  });
  return contactId;
}

export function buildCheckoutContextNotes(context: {
  variant?: string;
  extraSeats?: number;
  beneficiaryEmail?: string | null;
  tenant?: string;
}) {
  const parts: string[] = [];
  if (context.tenant) parts.push(`tenant=${context.tenant}`);
  if (context.variant) parts.push(`variant=${context.variant}`);
  if (typeof context.extraSeats === 'number') parts.push(`extraSeats=${context.extraSeats}`);
  if (context.beneficiaryEmail) parts.push(`beneficiary=${context.beneficiaryEmail}`);
  return parts.join(' | ');
}
