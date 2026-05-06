import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BrandingDraft = {
  logoUrl?: string;        // URL local para preview (ObjectURL ou path)
  logoFile?: File | null;  // arquivo para upload futuro
  primary?: string;        // Cor primária (ex: #10b981)
  secondary?: string;      // Cor secundária (ex: #34d399)
  fantasyName: string;     // NOME separado do logo
  ctaText: string;
  ctaUrl: string;
  whatsapp?: string;
  domain?: string;
};

type Store = {
  data: BrandingDraft;
   
  set: <K extends keyof BrandingDraft>(key: K, value: BrandingDraft[K]) => void;
  reset: () => void;
};

const defaultData: BrandingDraft = {
  logoUrl: "/logosmejoy/logomejoy.svg",
  logoFile: null,
  primary: "#10b981",
  secondary: "#34d399",
  fantasyName: "MeJoy",
  ctaText: "Falar com médico",
  ctaUrl: "https://wa.me/5511999999999",
  whatsapp: "",
  domain: ""
};

export const useBranding = create<Store>()(
  persist(
    (set) => ({
      data: defaultData,
      set: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
      reset: () => set({ data: defaultData })
    }),
    { 
      name: "branding_draft_v1",
      // Não persiste File objects (não serializável)
      partialize: (state) => ({
        data: {
          ...state.data,
          logoFile: null
        }
      })
    }
  )
);
