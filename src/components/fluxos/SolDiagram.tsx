'use client';

import Link from 'next/link';
import { useResponsive } from '@/hooks/useResponsive';
import { LABEL_SOL } from '@/lib/fluxos-mejoy/dados';
import type { FluxoEntry } from '@/lib/fluxos-mejoy/types';

interface SolDiagramProps {
  fluxos: FluxoEntry[];
}

const CENTER = 220;
const RADIUS = 165;
const SUN_RADIUS = 56;
const DOT_RADIUS = 26;

function getPosition(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

function getLabel(fluxo: FluxoEntry): string {
  return LABEL_SOL[fluxo.slug] ?? fluxo.nome ?? fluxo.labelCurto;
}

export default function SolDiagram({ fluxos }: SolDiagramProps) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <div className="flex flex-wrap justify-center gap-2 px-2">
        {fluxos.map((f) => {
          const Icon = f.icone;
          const label = getLabel(f);
          return (
            <Link
              key={f.slug}
              href={`/fluxos/${f.slug}`}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: f.cor }}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[120px]">{label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  const total = fluxos.length;

  return (
    <div className="flex justify-center overflow-hidden">
      <svg
        viewBox="0 0 440 440"
        className="h-auto w-full max-w-[440px]"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Diagrama do sol: MeJoy no centro, 11 produtos nos raios"
      >
        {/* Raios */}
        {fluxos.map((_, i) => {
          const pos = getPosition(i, total);
          return (
            <line
              key={`ray-${i}`}
              x1={CENTER}
              y1={CENTER}
              x2={pos.x}
              y2={pos.y}
              stroke="rgba(251, 191, 36, 0.3)"
              strokeWidth="2"
            />
          );
        })}

        {/* Sol central */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={SUN_RADIUS}
          fill="url(#solGradient)"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <text
          x={CENTER}
          y={CENTER}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontSize: 20, fill: '#1f2937', fontFamily: 'system-ui', fontWeight: 700 }}
        >
          MeJoy
        </text>

        {/* Produtos nos raios */}
        {fluxos.map((f, i) => {
          const pos = getPosition(i, total);
          const label = getLabel(f);
          return (
            <g key={f.slug}>
              <a
                href={`/fluxos/${f.slug}`}
                className="cursor-pointer"
                style={{ outline: 'none' }}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={DOT_RADIUS}
                  fill={f.cor}
                  stroke="#fff"
                  strokeWidth="2.5"
                  className="transition-opacity hover:opacity-90"
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#fff"
                  style={{
                    fontSize: 10,
                    fontFamily: 'system-ui',
                    fontWeight: 600,
                    pointerEvents: 'none',
                  }}
                >
                  {label}
                </text>
              </a>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
