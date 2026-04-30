export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const abs = (path: string) => `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

export const buildSuccessUrl = () => abs("/checkout/sucesso");
export const buildCancelUrl = () => abs("/checkout/cancelado");