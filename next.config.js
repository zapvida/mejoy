const fs = require('fs');
const path = require('path');
const getRouteFromEntrypoint = require('next/dist/server/get-route-from-entrypoint').default;
const {
  CLIENT_STATIC_FILES_RUNTIME_MAIN,
  SYSTEM_ENTRYPOINTS,
} = require('next/dist/shared/lib/constants');

const DEFAULT_PUBLIC_SUPABASE_URL = 'https://ksmrownmfwcywhxtpshq.supabase.co';
const DEFAULT_PUBLIC_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_zsyeTlTXL4jzYVpz5RyiKQ_xQdOGyQQ';
const shouldUseManagedSupabaseFallback =
  process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV);

function walkEmittedFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkEmittedFiles(fullPath));
      continue;
    }
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function routeFromEmittedPage(relativePath) {
  if (!relativePath.endsWith('.js')) return null;
  if (relativePath.endsWith('.nft.json')) return null;

  const normalized = relativePath.split(path.sep).join('/');
  const withoutExt = normalized.slice(0, -'.js'.length);

  if (
    withoutExt.startsWith('chunks/') ||
    withoutExt.startsWith('vendor-chunks/') ||
    withoutExt.startsWith('static/') ||
    withoutExt.startsWith('webpack')
  ) {
    return null;
  }

  if (withoutExt === 'index') return '/';
  if (withoutExt.endsWith('/index')) return `/${withoutExt.slice(0, -'/index'.length)}`;
  return `/${withoutExt}`;
}

class EnsurePagesManifestPlugin {
  apply(compiler) {
    if (compiler.name !== 'server') return;

    compiler.hooks.afterEmit.tap('EnsurePagesManifestPlugin', () => {
      const pagesDir = path.join(compiler.outputPath, 'pages');
      const manifestPath = path.join(compiler.outputPath, 'pages-manifest.json');

      if (!fs.existsSync(pagesDir)) return;

      const manifest = {};
      for (const filePath of walkEmittedFiles(pagesDir)) {
        const relativePath = path.relative(pagesDir, filePath);
        const route = routeFromEmittedPage(relativePath);
        if (!route) continue;

        manifest[route] = `pages/${relativePath.split(path.sep).join('/')}`;
      }

      if (Object.keys(manifest).length > 0) {
        fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
      }
    });
  }
}

function getEntrypointFiles(entrypoint) {
  return (entrypoint?.getFiles().filter((file) => /(?<!\.hot-update)\.(js|css)($|\?)/.test(file)) ?? []).map((file) =>
    file.replace(/\\/g, '/'),
  );
}

class EnsureBuildManifestPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tap('EnsureBuildManifestPlugin', (compilation) => {
      const entrypoints = compilation.entrypoints;
      const mainFiles = new Set(getEntrypointFiles(entrypoints.get(CLIENT_STATIC_FILES_RUNTIME_MAIN)));
      const buildManifestPath = path.join(compiler.outputPath, 'build-manifest.json');
      const assetMap = {
        polyfillFiles: [],
        devFiles: [],
        ampDevFiles: [],
        lowPriorityFiles: [],
        rootMainFiles: [],
        rootMainFilesTree: {},
        pages: {
          '/_app': [...mainFiles],
        },
        ampFirstPages: [],
      };

      for (const entrypoint of entrypoints.values()) {
        if (SYSTEM_ENTRYPOINTS.has(entrypoint.name)) continue;

        const pagePath = getRouteFromEntrypoint(entrypoint.name);
        if (!pagePath) continue;

        assetMap.pages[pagePath] = [
          ...new Set([...mainFiles, ...getEntrypointFiles(entrypoint)]),
        ];
      }

      fs.writeFileSync(buildManifestPath, `${JSON.stringify(assetMap, null, 2)}\n`, 'utf8');
    });
  }
}

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
    if (process.env.NEXT_DISABLE_WEBPACK_FS_CACHE === '1') {
      config.cache = false;
    }

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

      config.plugins = config.plugins || [];
      config.plugins.push(new EnsureBuildManifestPlugin());
    }

    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(new EnsurePagesManifestPlugin());
    }

    return config;
  },
};

module.exports = nextConfig;
