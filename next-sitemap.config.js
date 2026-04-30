// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*', '/checkout/*', '/admin/*', '/dashboard/*', '/auth/*', '/b2b-disabled/*', '/test-resend'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/admin/', '/dashboard/', '/auth/']
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/admin/', '/dashboard/', '/auth/']
      }
    ],
    additionalSitemaps: []
  },
  transform: async (config, path) => {
    // Prioridades customizadas
    let priority = 0.7;
    let changefreq = 'weekly';

    // Homepage tem prioridade máxima
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // Página de catálogo e protocolos
    else if (path === '/produtos' || path === '/protocolos') {
      priority = 0.95;
      changefreq = 'weekly';
    }
    // Páginas de produtos têm alta prioridade
    else if (path.match(/^\/(emagrecimento|calvicie|sono|ansiedade|intestino|figado|libido-masculina|menopausa|articulacoes|imunidade|tirzepatida)$/)) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Fluxos (investidores e parceiros)
    else if (path === '/fluxos' || path.startsWith('/fluxos/')) {
      priority = 0.85;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString()
    };
  }
};
