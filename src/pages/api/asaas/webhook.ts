/**
 * @deprecated Use /api/webhooks/asaas
 * Redireciona para o handler em /api/webhooks/asaas (URL canônica).
 */
import webhookHandler from '../webhooks/asaas';

export const config = { api: { bodyParser: false } };
export default webhookHandler;
