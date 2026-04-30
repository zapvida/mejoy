import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { isFeatureEnabled } from "@/lib/env";
import puppeteer from "puppeteer";

type PdfResponse = { pdf: Buffer } | { error: string };

// Schema de validação Zod
const PdfRequestSchema = z.object({
  reportId: z.string().uuid(),
  format: z.enum(['A4', 'Letter']).default('A4'),
  orientation: z.enum(['portrait', 'landscape']).default('portrait'),
});

// Rate limiting para PDF
const pdfRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const PDF_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const PDF_RATE_LIMIT_MAX_REQUESTS = 2; // Menos requests que TTS

function checkPdfRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = pdfRateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    pdfRateLimitMap.set(ip, { count: 1, resetTime: now + PDF_RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= PDF_RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

// Autenticação via NextAuth (simulada)
async function authenticatePdfRequest(req: NextApiRequest): Promise<{ userId: string | null; isAuthenticated: boolean }> {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Em produção: validar JWT token
    return { userId: token, isAuthenticated: true };
  }
  
  return { userId: null, isAuthenticated: false };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PdfResponse>) {
  const startTime = Date.now();
  const reqId = Math.random().toString(36).substring(7);
  const ip = req.headers['x-forwarded-for'] as string || req.connection.remoteAddress || 'unknown';
  
  // Log estruturado
  console.log(`[${reqId}] PDF ${req.method} ${req.url} - IP: ${ip}`);
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  // Verificar feature flag PDF_V2
  if (!isFeatureEnabled('PDF_V2')) {
    console.log(`[${reqId}] PDF V2 disabled by feature flag`);
    return res.status(501).json({ 
      error: "Export PDF V2 temporariamente indisponível. Use a função de impressão do navegador." 
    });
  }

  // Rate limiting
  if (!checkPdfRateLimit(ip)) {
    console.log(`[${reqId}] PDF rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  // Validação Zod
  const validationResult = PdfRequestSchema.safeParse(req.body);
  if (!validationResult.success) {
    console.log(`[${reqId}] PDF validation error:`, validationResult.error);
    return res.status(400).json({ 
      error: "Dados inválidos: " + validationResult.error.errors.map(e => e.message).join(", ")
    });
  }

  const { reportId, format, orientation } = validationResult.data;

  // Autenticação
  const { userId, isAuthenticated } = await authenticatePdfRequest(req);
  
  // Para PDF, exigir autenticação
  if (!isAuthenticated) {
    console.log(`[${reqId}] PDF access denied - not authenticated`);
    return res.status(401).json({ error: "Autenticação necessária para exportar PDF." });
  }

  try {
    // Verificar se o relatório pertence ao usuário (owner-only)
    // TODO: Implementar verificação de ownership
    
    // Configurar Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Configurar viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navegar para a página do relatório
    const reportUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/relatorio/${reportId}`;
    await page.goto(reportUrl, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Aguardar carregamento completo
    await page.waitForSelector('[data-testid="report-content"]', { timeout: 10000 });

    // Configurar CSS para impressão
    await page.addStyleTag({
      content: `
        @media print {
          .no-print { display: none !important; }
          .chat-container { display: none !important; }
          .navigation { display: none !important; }
          .footer { display: none !important; }
          body { margin: 0; padding: 12mm; }
          .page-break { page-break-before: always; }
        }
      `
    });

    // Gerar PDF
    const pdf = await page.pdf({
      format: format.toLowerCase() as any,
      orientation: orientation,
      margin: {
        top: '12mm',
        right: '12mm',
        bottom: '12mm',
        left: '12mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    await browser.close();

    const duration = Date.now() - startTime;
    console.log(`[${reqId}] PDF generated successfully - Duration: ${duration}ms, User: ${userId}, Report: ${reportId}`);

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="relatorio-${reportId}.pdf"`);
    res.setHeader('Content-Length', pdf.length.toString());

    return res.status(200).send(pdf);
  } catch (error) {
    const duration = Date.now() - startTime;
    const message = error instanceof Error ? error.message : "Erro ao gerar PDF.";
    console.log(`[${reqId}] PDF error - Duration: ${duration}ms, Error: ${message}`);
    return res.status(500).json({ error: message });
  }
}
