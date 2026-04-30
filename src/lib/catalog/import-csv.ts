/**
 * Importador CSV para catálogo Store V2
 * Valida slug único, formas permitidas, flags RX.
 * Preços vazios → status draft (checkout bloqueado).
 */

import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { storeLogger } from '@/lib/store-v2/logger';

const FORMS_ALLOWED = ['caps', 'powder', 'topical', 'sachet', 'drops', 'cream', 'shampoo'];
const WHATSAPP_FLOWS = ['none', 'rx_upload'];

const RowSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  objective_primary: z.string().min(1),
  category_nav: z.string().optional(),
  form_display: z.string().optional(),
  form_key: z.string().optional(),
  pack_size_display: z.string().optional(),
  requires_rx: z.string().transform((v) => v === 'True'),
  requires_validation: z.string().transform((v) => v === 'True'),
  can_subscribe: z.string().transform((v) => v === 'True'),
  subscription_plan_default: z.string().optional(),
  subscription_discount_pct: z.string().transform((v) => (v ? parseInt(v, 10) : 10)),
  price_pix_brl: z.string().optional(),
  price_card_brl: z.string().optional(),
  compare_at_brl: z.string().optional(),
  lead_time_days: z.string().transform((v) => (v ? parseInt(v, 10) : 2)),
  shipping_class: z.string().optional(),
  seo_slug: z.string().min(1),
  seo_title: z.string().optional(),
  tags: z.string().optional(),
  short_benefit: z.string().optional(),
  active_ingredients: z.string().optional(),
  whatsapp_flow: z.string().optional(),
  upsell_parametrizado: z.string().transform((v) => v === 'True'),
  builder_template_id: z.string().optional(),
  status: z.string().optional(),
  priority_rank: z.string().transform((v) => (v ? parseInt(v, 10) : 0)),
});

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else if (c !== '\n' && c !== '\r') {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = values[j] ?? '';
    });
    rows.push(row);
  }
  return rows;
}

function normalizeSlug(slug: string, sku: string, used: Set<string>): string {
  let s = slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!s) s = sku.toLowerCase().replace(/\s+/g, '-');
  let final = s;
  let n = 0;
  while (used.has(final)) {
    n++;
    final = `${s}-${n}`;
  }
  used.add(final);
  return final;
}

function parsePriceBrl(v: string | undefined): number | null {
  if (!v || v.trim() === '') return null;
  const n = parseFloat(v.replace(',', '.').replace(/[^\d.-]/g, ''));
  return isNaN(n) || n <= 0 ? null : Math.round(n * 100);
}

export interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
  total: number;
}

export async function importCatalogFromCSV(
  csvPath: string,
  prisma: PrismaClient
): Promise<ImportResult> {
  const result: ImportResult = { created: 0, updated: 0, errors: [], total: 0 };
  const slugUsed = new Set<string>();

  if (!fs.existsSync(csvPath)) {
    result.errors.push(`Arquivo não encontrado: ${csvPath}`);
    return result;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i];
    const parsed = RowSchema.safeParse(raw);
    if (!parsed.success) {
      result.errors.push(`Linha ${i + 2}: ${parsed.error.message}`);
      continue;
    }
    const row = parsed.data;

    const formKey = (row.form_key || 'caps').toLowerCase();
    if (!FORMS_ALLOWED.includes(formKey)) {
      result.errors.push(`Linha ${i + 2}: forma "${formKey}" não permitida`);
      continue;
    }
    const whatsappFlow = (row.whatsapp_flow || 'none').toLowerCase();
    if (!WHATSAPP_FLOWS.includes(whatsappFlow)) {
      result.errors.push(`Linha ${i + 2}: whatsapp_flow "${whatsappFlow}" inválido`);
      continue;
    }

    const slug = normalizeSlug(row.seo_slug, row.sku, slugUsed);
    const priceFromCsv = parsePriceBrl(row.price_card_brl || row.price_pix_brl);
    const seedCents = process.env.STORE_V2_SEED_PRICE_CENTS
      ? parseInt(process.env.STORE_V2_SEED_PRICE_CENTS, 10)
      : null;
    const priceCents = priceFromCsv ?? (seedCents && seedCents > 0 ? seedCents : null);
    const compareAtCents = parsePriceBrl(row.compare_at_brl);
    const status = priceCents != null && priceCents > 0 ? 'active' : 'draft';
    const tags = (row.tags || '')
      .split(';')
      .map((t) => t.replace(/&/g, '-').trim())
      .filter(Boolean);

    const seoTitle = (row.seo_title || row.name).replace('Moonjoy', 'Me Joy').replace('MoonJoy', 'Me Joy');

    try {
      const existing = await prisma.product.findUnique({ where: { sku: row.sku } });
      if (existing) {
        await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: row.name,
            slug,
            shortName: row.name,
            shortBenefit: row.short_benefit,
            activeIngredients: row.active_ingredients,
            formDisplay: row.form_display,
            formKey: formKey,
            packSizeDisplay: row.pack_size_display,
            objective: row.objective_primary,
            category: row.category_nav,
            requiresRx: row.requires_rx,
            requiresValidation: row.requires_validation,
            canSubscribe: row.can_subscribe,
            subscribeDiscountPct: row.subscription_discount_pct,
            subscriptionPlanDefault: row.subscription_plan_default || 'MENSAL',
            leadTimeDays: row.lead_time_days,
            shippingClass: row.shipping_class || 'PADRAO',
            seoTitle,
            tags,
            whatsappFlow,
            builderTemplateId: row.builder_template_id,
            upsellParametrizado: row.upsell_parametrizado,
            priorityRank: row.priority_rank,
            status,
            active: true,
          },
        });
        // Atualizar variant e PriceVersion ao reimportar com novo preço
        const variant = await prisma.productVariant.findFirst({ where: { productId: existing.id } });
        if (variant) {
          await prisma.productVariant.update({
            where: { id: variant.id },
            data: { priceCents },
          });
        }
        if (priceCents != null && priceCents > 0) {
          await prisma.priceVersion.create({
            data: {
              productId: existing.id,
              priceCents,
              compareAtCents,
            },
          });
        }
        result.updated++;
      } else {
        const product = await prisma.product.create({
          data: {
            sku: row.sku,
            slug,
            name: row.name,
            shortName: row.name,
            shortBenefit: row.short_benefit,
            activeIngredients: row.active_ingredients,
            formDisplay: row.form_display,
            formKey: formKey,
            packSizeDisplay: row.pack_size_display,
            objective: row.objective_primary,
            category: row.category_nav,
            requiresRx: row.requires_rx,
            requiresValidation: row.requires_validation,
            canSubscribe: row.can_subscribe,
            subscribeDiscountPct: row.subscription_discount_pct,
            subscriptionPlanDefault: row.subscription_plan_default || 'MENSAL',
            leadTimeDays: row.lead_time_days,
            shippingClass: row.shipping_class || 'PADRAO',
            seoTitle,
            tags,
            whatsappFlow,
            builderTemplateId: row.builder_template_id,
            upsellParametrizado: row.upsell_parametrizado,
            priorityRank: row.priority_rank,
            status,
            active: true,
          },
        });
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: row.sku,
            name: row.pack_size_display,
            priceCents,
          },
        });
        if (priceCents != null && priceCents > 0) {
          await prisma.priceVersion.create({
            data: {
              productId: product.id,
              priceCents,
              compareAtCents,
            },
          });
        }
        result.created++;
      }
      result.total++;
    } catch (err) {
      result.errors.push(`Linha ${i + 2}: ${err instanceof Error ? err.message : String(err)}`);
      storeLogger.error('Import row failed', err, { sku: row.sku, line: i + 2 });
    }
  }

  return result;
}
