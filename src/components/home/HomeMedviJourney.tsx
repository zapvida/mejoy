/**
 * @deprecated — use `MedviHomeHub` (`/`) ou `EmagrecimentoLpacPage` (`/emagrecimento`).
 *
 * Shim de compatibilidade para imports legados. Roteia conforme `page`:
 * - `page='home'` → `MedviHomeHub`
 * - `page='emagrecimento'` → `EmagrecimentoLpacPage`
 */
import { MedviHomeHub } from '@/components/home/MedviHomeHub';
import { EmagrecimentoLpacPage } from '@/components/lpac/EmagrecimentoLpacPage';
import type { LandingPageKey } from '@/contexts/LandingAnalyticsContext';

export function HomeMedviJourney({
  page = 'home',
  canonicalPath = '/',
}: {
  page?: LandingPageKey;
  canonicalPath?: string;
}) {
  if (page === 'emagrecimento') {
    return <EmagrecimentoLpacPage canonicalPath={canonicalPath} />;
  }
  return <MedviHomeHub canonicalPath={canonicalPath} />;
}

export default HomeMedviJourney;
