// BEGIN flag-guard: StickyCTA
export default function StickyCTA({ onClick }: { onClick: () => void }) {
  if (process.env.NEXT_PUBLIC_STICKY_CTA_GI !== "1") return null;
  
  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-40 bg-emerald-600/95 backdrop-blur p-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}
    >
      <button
        onClick={onClick}
        className="w-full min-h-[44px] bg-white text-emerald-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
        aria-label="Iniciar triagem gastrointestinal gratuita"
      >
        Triagem gastrointestinal gratuita (3 min)
      </button>
    </div>
  );
}
// END flag-guard