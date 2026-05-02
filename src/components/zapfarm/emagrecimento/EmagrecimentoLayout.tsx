import { HeaderZapfarm } from '@/components/zapfarm/emagrecimento/HeaderZapfarm';
import { FooterZapfarm } from '@/components/zapfarm/emagrecimento/FooterZapfarm';

interface EmagrecimentoLayoutProps {
  children: React.ReactNode;
  showStickyCta?: boolean;
}

export function EmagrecimentoLayout({ children, showStickyCta = false }: EmagrecimentoLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f6f2]">
      <HeaderZapfarm
        mode="landing"
        primaryCtaLabel="Começar avaliação"
        primaryCtaMobileLabel="Começar"
        showMenuButton
        showDesktopLinks={false}
      />

      <main className="pt-20 sm:pt-24">{children}</main>
      <FooterZapfarm />

      {showStickyCta ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_35px_rgba(15,23,42,0.10)] backdrop-blur-xl md:hidden">
          <a
            href="/triagem/emagrecimento"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#93b28d] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#7e9f79]"
          >
            Começar minha triagem agora
          </a>
        </div>
      ) : null}
    </div>
  );
}
