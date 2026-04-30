'use client';

import { COMPLIANCE_FOOTER } from '@/config/zapfarm/compliance';

export function ComplianceFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-xs text-gray-500 text-center leading-relaxed max-w-2xl mx-auto">
        {COMPLIANCE_FOOTER}
      </p>
    </footer>
  );
}
