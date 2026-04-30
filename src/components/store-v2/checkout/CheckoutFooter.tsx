'use client';

import Link from 'next/link';
import { Lock, Shield } from 'lucide-react';

export default function CheckoutFooter() {
  return (
    <footer className="mt-12 py-8 border-t border-gray-100">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
        <p className="text-sm text-gray-600">
          Ao confirmar o pagamento, você concorda com nossos{' '}
          <Link href="/termos" className="text-blue-600 hover:underline">
            Termos de Uso
          </Link>{' '}
          e{' '}
          <Link href="/privacidade" className="text-blue-600 hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
        <p className="text-sm text-gray-600">
          Este site está protegido pelo Google reCAPTCHA.{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Política de Privacidade
          </a>{' '}
          e{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Termos de Serviço
          </a>
          .
        </p>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-800">SITE SEGURO SSL 256 BITS</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 border border-slate-200">
            <Shield className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-medium text-slate-700">PCI DSS COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
