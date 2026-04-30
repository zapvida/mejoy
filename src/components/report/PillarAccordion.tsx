'use client';

import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EvidenceChip } from "./EvidenceChip";

import type { Citation, Pillar } from "@/types/report";


type PillarAccordionProps = {
  pillars: Pillar[];
  onOpen?: (pillarId: string) => void;
  onEvidenceOpen?: (citation: Citation) => void;
  onReferencesRequest?: (citations: Citation[]) => void;
};

const MOBILE_QUERY = "(max-width: 768px)";

export function PillarAccordion({
  pillars,
  onOpen,
  onEvidenceOpen,
  onReferencesRequest,
}: PillarAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (pillars[0]) initial.add(pillars[0].id);
    return initial;
  });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile && openIds.size > 1) {
      const first = openIds.values().next().value;
      setOpenIds(new Set(first ? [first] : []));
    }
  }, [isMobile, openIds]);

  useEffect(() => {
    if (!pillars.length) return;
    const first = pillars[0]?.id;
    if (!openIds.size && first) setOpenIds(new Set([first]));
  }, [pillars, openIds]);

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        const isOpen = prev.has(id);

        if (isMobile) {
          next.clear();
          if (!isOpen) next.add(id);
        } else {
          if (isOpen) next.delete(id);
          else next.add(id);
        }

        return next;
      });
      onOpen?.(id);
    },
    [isMobile, onOpen]
  );

  const openIdList = useMemo(() => Array.from(openIds), [openIds]);

  return (
    <div className="space-y-3" data-open={openIdList.join(",")}>
      {pillars.map((pillar) => {
        const isOpen = openIds.has(pillar.id);
        return (
          <article
            key={pillar.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => toggle(pillar.id)}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-expanded={isOpen}
              aria-controls={`pillar-panel-${pillar.id}`}
            >
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60">{pillar.id}</p>
                <h2 className="text-lg font-semibold text-white sm:text-xl">{pillar.title}</h2>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-white transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                aria-hidden="true"
              />
            </button>

            <div
              id={`pillar-panel-${pillar.id}`}
              hidden={!isOpen}
              className="space-y-4 border-t border-white/10 bg-black/30 px-4 pb-5 pt-4 text-white"
              style={{ contentVisibility: "auto", containIntrinsicSize: "600px 400px" }}
            >
              <section className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Ganhos rápidos na Saúde:</h3>
                <ul className="space-y-2 text-sm leading-relaxed text-white/80">
                  {pillar.quickWins.map((win, index) => (
                    <li key={`${pillar.id}-quick-${index}`} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-2 w-2 flex-none rounded-full bg-emerald-300" aria-hidden="true" />
                      <span className="flex-1">{win}</span>
                      {pillar.citations?.[0] && (
                        <EvidenceChip
                          label="Evidência"
                          citationId={pillar.citations[0].id}
                          onClick={() => {
                            const citation = pillar.citations?.[0];
                            if (citation) onEvidenceOpen?.(citation);
                            if (pillar.citations) onReferencesRequest?.(pillar.citations);
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              {pillar.weeklyGoal && (
                <section className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-emerald-100">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-200">Meta da semana</h3>
                  <p className="mt-1 text-sm text-emerald-50">{pillar.weeklyGoal}</p>
                </section>
              )}

              {pillar.citations && pillar.citations.length > 1 && (
                <button
                  type="button"
                  onClick={() => onReferencesRequest?.(pillar.citations ?? [])}
                  className="text-xs font-medium text-white/80 underline underline-offset-4 transition hover:text-white"
                >
                  Ver todas as referências
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
