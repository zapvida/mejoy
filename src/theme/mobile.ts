export const mobileTheme = {
  colors: {
    bg: "#000000",
    surface: "#0B0B0C",
    text: "#FFFFFF",
    textDim: "rgba(255,255,255,0.7)",
    brand: "#00C853", // Verde ZapFarm
    brandHover: "#00A844",
  },
  gradients: {
    active: "from-brand to-brand-600",
    background: "from-zinc-900 via-zinc-800 to-zinc-900",
  },
  size: {
    topbar: "h-16",
    tabbar: "h-16",
    tapTarget: "min-h-[44px]", // Acessibilidade
  },
  spacing: {
    safeTop: "pt-[env(safe-area-inset-top)]",
    safeBottom: "pb-[env(safe-area-inset-bottom)]",
    mainPadding: "px-4",
  },
  effects: {
    backdrop: "bg-black/95 backdrop-blur-md",
    border: "border-white/10",
    shadow: "shadow-lg",
  },
  transitions: {
    default: "transition-all duration-200 ease-in-out",
    hover: "hover:scale-105",
  },
  zIndex: {
    topbar: "z-50",
    tabbar: "z-50",
    modal: "z-60",
  }
};
