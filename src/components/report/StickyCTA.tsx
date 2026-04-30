'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

type StickyCTAProps = {
  onClick?: () => void;
  bottomOffset?: number;
};

const MOBILE_QUERY = "(max-width: 768px)";

export function StickyCTA({ onClick, bottomOffset = 200 }: StickyCTAProps) {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const evaluate = useCallback(() => {
    if (typeof window === "undefined") return;
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) {
      setVisible(false);
      return;
    }
    const progress = scrollTop / scrollHeight;
    const distanceToBottom = scrollHeight - scrollTop;

    setVisible(progress > 0.4 && distanceToBottom > bottomOffset);
  }, [bottomOffset]);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setVisible(false);
      return;
    }
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, [evaluate, isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-4 bottom-6 z-30 md:hidden"
        >
          <button
            type="button"
            onClick={onClick}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-4 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:from-emerald-300 hover:to-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Quero acompanhamento premium agora
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
