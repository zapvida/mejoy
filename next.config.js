const DEFAULT_PUBLIC_SUPABASE_URL = 'https://ksmrownmfwcywhxtpshq.supabase.co';
const DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_zsyeTlTXL4jzYVpz5RyiKQ_xQdOGyQQ';
const shouldUseManagedSupabaseFallback =
  process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone' removido - causa ENOENT no build Next.js 15 (rename export/*.html)
  // Vercel não exige standalone; deploy funciona normalmente sem ele.
  distDir: process.env.NEXT_DIST_DIR || '.next',

  // Variáveis de ambiente para PDF
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mejoy.com.br',
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      (shouldUseManagedSupabaseFallback ? DEFAULT_PUBLIC_SUPABASE_URL : ''),
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      (shouldUseManagedSupabaseFallback ? DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY : ''),
  },
  
  // Configurações de segurança - FAIL FAST
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Otimizações de performance
  compress: true,
  
  // Configurações experimentais para performance
  experimental: {
    optimizePackageImports: ['@react-pdf/renderer', 'openai'],
  },

  i18n: {
    locales: ['pt-BR'],
    defaultLocale: 'pt-BR',
    localeDetection: false,
  },
  
  // Otimizações de imagem
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 ano
    // domains: ['images.ctfassets.net', 'cdn.alloehealth.com'], // adicione se precisar carregar externas
  },
  
  // Redirects canônicos para domínio principal
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'mejoy.com.br' }],
        destination: 'https://www.mejoy.com.br/:path*',
        permanent: true,
      },
      // Garantir que zapfarm.com.br (sem www) redirecione para www.zapfarm.com.br se necessário
      // Ou manter ambos funcionando - removido redirect para não quebrar
    ];
  },

  // Headers de segurança e performance
  async headers() {
    const prod = process.env.NODE_ENV === 'production';
    const common = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
    ];
    const hsts = prod ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : [];

    return [
      {
        source: '/(.*)',
        headers: [...common, ...hsts]
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Otimizações de bundle
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      (warning) =>
        typeof warning.message === 'string' &&
        /Critical dependency: the request of a dependency is an expression/.test(
          warning.message
        ) &&
        warning.module?.resource?.match(/@supabase\/(functions|storage|auth|realtime)-js/),
    ];

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
