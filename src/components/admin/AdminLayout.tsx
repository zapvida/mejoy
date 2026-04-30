/**
 * Layout admin estilo ZapVida - sidebar, clean, responsivo
 */

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import {
  FiLayout,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiShoppingCart,
  FiActivity,
  FiLink,
  FiSettings,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Visão Geral', icon: FiLayout },
  { href: '/admin/store-v2/orders', label: 'Pedidos Loja', icon: FiShoppingCart },
  { href: '/admin/leads', label: 'Leads & Funil', icon: FiUsers },
  { href: '/admin/handoff', label: 'Handoff Clínico', icon: FiLink },
  { href: '/admin', label: 'Financeiro', icon: FiDollarSign, hash: '#financeiro' },
  { href: '/admin', label: 'Produtos', icon: FiPackage, hash: '#produtos' },
  { href: '/admin', label: 'Saúde Técnica', icon: FiActivity, hash: '#tech' },
  { href: '/admin', label: 'Configurações', icon: FiSettings, hash: '#config' },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-sm">MJ</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">MeJoy Admin</span>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const currentHash = (router.asPath || '').split('#')[1] || '';
              const isActive =
                item.href !== '/admin'
                  ? router.pathname.startsWith(item.href)
                  : item.hash
                    ? router.pathname === '/admin' && currentHash === item.hash.slice(1)
                    : router.pathname === '/admin' && !currentHash;
              const href = item.hash ? `${item.href}${item.hash}` : item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href + (item.hash || '')}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <span className="font-semibold text-gray-900">MeJoy Admin</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2">
              <FiX size={20} />
            </button>
          </div>
          <nav className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const currentHash = (router.asPath || '').split('#')[1] || '';
              const isActive =
                item.href !== '/admin'
                  ? router.pathname.startsWith(item.href)
                  : item.hash
                    ? router.pathname === '/admin' && currentHash === item.hash.slice(1)
                    : router.pathname === '/admin' && !currentHash;
              return (
              <Link
                key={item.href + (item.hash || '')}
                href={item.hash ? `${item.href}${item.hash}` : item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6 lg:p-8 pb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">{children}</div>
        </main>
      </div>
    </>
  );
}
