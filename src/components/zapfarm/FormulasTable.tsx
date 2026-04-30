'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, Filter, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Formula } from '@/config/zapfarm/formulas';
import {
  FORMULAS,
  FLUXO_CORES,
  calcBom,
  calcBomTotal,
  formatReais,
} from '@/config/zapfarm/formulas';

const NIVEL_BADGE: Record<string, string> = {
  BÁSICO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  COMPLETO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  PREMIUM: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
};

function getNivelBadge(nivel: string): string {
  return NIVEL_BADGE[nivel] ?? 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
}

function getFluxoGradient(fluxo: string): string {
  const c = FLUXO_CORES[fluxo] ?? 'gray';
  const map: Record<string, string> = {
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-200/50',
    indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-200/50',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-200/50',
    green: 'from-green-500/10 to-green-600/5 border-green-200/50',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200/50',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-200/50',
    red: 'from-red-500/10 to-red-600/5 border-red-200/50',
    pink: 'from-pink-500/10 to-pink-600/5 border-pink-200/50',
    slate: 'from-slate-500/10 to-slate-600/5 border-slate-200/50',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-200/50',
    violet: 'from-violet-500/10 to-violet-600/5 border-violet-200/50',
    gray: 'from-gray-500/10 to-gray-600/5 border-gray-200/50',
  };
  return map[c] ?? map.gray;
}

interface EditableCostInputProps {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}

function EditableCostInput({ value, onChange, className }: EditableCostInputProps) {
  const [local, setLocal] = useState(String(value));
  const handleBlur = useCallback(() => {
    const n = parseFloat(local.replace(',', '.')) || 0;
    onChange(Math.max(0, n));
    setLocal(String(n));
  }, [local, onChange]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
      className={cn(
        'w-16 text-right rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm font-medium focus:ring-2 focus:ring-[color:var(--brand-600)]/30 focus:border-[color:var(--brand-600)]',
        className
      )}
    />
  );
}

interface FormulasTableProps {
  /** Se true, permite editar custos e ver BOM recalculado */
  editable?: boolean;
  /** Se true, agrupa por fluxo em accordion */
  grouped?: boolean;
  className?: string;
}

export default function FormulasTable({
  editable = true,
  grouped = true,
  className,
}: FormulasTableProps) {
  const [search, setSearch] = useState('');
  const [fluxoFilter, setFluxoFilter] = useState<string>('');
  const [nivelFilter, setNivelFilter] = useState<string>('');
  const [expandedFluxos, setExpandedFluxos] = useState<Set<string>>(() =>
    new Set(FORMULAS.map((f) => f.fluxo))
  );

  // Estado editável: clone das fórmulas para permitir mutação
  const [formulas, setFormulas] = useState<Formula[]>(() =>
    FORMULAS.map((f) => ({
      ...f,
      componentes: f.componentes.map((c) => ({ ...c })),
    }))
  );

  const updateCost = useCallback(
    (formulaId: string, compIndex: number, custoReais: number) => {
      setFormulas((prev) =>
        prev.map((f) => {
          if (f.id !== formulaId) return f;
          const comps = [...f.componentes];
          comps[compIndex] = { ...comps[compIndex], custoReais };
          return { ...f, componentes: comps };
        })
      );
    },
    []
  );

  const fluxos = useMemo(() => Array.from(new Set(formulas.map((f) => f.fluxo))), [formulas]);

  const filtered = useMemo(() => {
    return formulas.filter((f) => {
      const matchSearch =
        !search ||
        [f.sku, f.produto, f.fluxo].some((s) =>
          s.toLowerCase().includes(search.toLowerCase())
        );
      const matchFluxo = !fluxoFilter || f.fluxo === fluxoFilter;
      const matchNivel = !nivelFilter || f.nivel === nivelFilter;
      return matchSearch && matchFluxo && matchNivel;
    });
  }, [formulas, search, fluxoFilter, nivelFilter]);

  const byFluxo = useMemo(() => {
    const map = new Map<string, Formula[]>();
    for (const f of filtered) {
      const list = map.get(f.fluxo) ?? [];
      list.push(f);
      map.set(f.fluxo, list);
    }
    return map;
  }, [filtered]);

  const totalBom = useMemo(() => calcBomTotal(formulas), [formulas]);
  const filteredBom = useMemo(() => calcBomTotal(filtered), [filtered]);

  const toggleFluxo = (fluxo: string) => {
    setExpandedFluxos((prev) => {
      const next = new Set(prev);
      if (next.has(fluxo)) next.delete(fluxo);
      else next.add(fluxo);
      return next;
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filtros e busca */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por SKU, produto ou fluxo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[color:var(--brand-600)]/30 focus:border-[color:var(--brand-600)]"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={fluxoFilter}
            onChange={(e) => setFluxoFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="">Todos os fluxos</option>
            {fluxos.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={nivelFilter}
            onChange={(e) => setNivelFilter(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
          >
            <option value="">Todos os níveis</option>
            <option value="BÁSICO">Básico</option>
            <option value="COMPLETO">Completo</option>
            <option value="PREMIUM">Premium</option>
            <option value="2,5 mg/mL">2,5 mg/mL</option>
            <option value="5 mg/mL">5 mg/mL</option>
            <option value="20 mg/mL">20 mg/mL</option>
          </select>
        </div>
      </div>

      {/* Totais */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="rounded-lg bg-brand-50 dark:bg-brand-900/20 px-4 py-2 font-semibold text-brand-800 dark:text-brand-200">
          BOM total (33 SKUs): {formatReais(totalBom)}
        </div>
        {filtered.length !== formulas.length && (
          <div className="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-2 text-gray-700 dark:text-gray-300">
            Filtrado ({filtered.length}): {formatReais(filteredBom)}
          </div>
        )}
        {editable && (
          <span className="text-xs text-gray-500 self-center">
            Clique nos valores de custo para editar — BOM recalculado automaticamente
          </span>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        {grouped ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {Array.from(byFluxo.entries()).map(([fluxo, items]) => {
              const isExpanded = expandedFluxos.has(fluxo);
              const fluxoTotal = items.reduce((s, f) => s + calcBom(f), 0);
              return (
                <div
                  key={fluxo}
                  className={cn(
                    'bg-gradient-to-r',
                    getFluxoGradient(fluxo),
                    'border-b border-gray-100 dark:border-gray-700'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleFluxo(fluxo)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      {fluxo}
                    </span>
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      {items.length} SKU(s) · {formatReais(fluxoTotal)}
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 overflow-x-auto">
                      <table className="min-w-[700px] w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            <th className="py-2 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                              Nível
                            </th>
                            <th className="py-2 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                              SKU
                            </th>
                            <th className="py-2 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                              Produto
                            </th>
                            <th className="py-2 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                              Forma
                            </th>
                            <th className="py-2 pr-4 text-left font-medium text-gray-600 dark:text-gray-400">
                              Componentes
                            </th>
                            <th className="py-2 text-right font-medium text-gray-600 dark:text-gray-400">
                              BOM
                            </th>
                            <th className="py-2 pl-2 text-left font-medium text-gray-600 dark:text-gray-400 w-24">
                              Obs
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((f) => (
                            <FormulaRow
                              key={f.id}
                              formula={f}
                              editable={editable}
                              showFluxo={false}
                              onUpdateCost={updateCost}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Fluxo
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Nível
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  SKU
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Produto
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Componentes
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  BOM
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Obs
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <FormulaRow
                  key={f.id}
                  formula={f}
                  editable={editable}
                  showFluxo
                  onUpdateCost={updateCost}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

interface FormulaRowProps {
  formula: Formula;
  editable: boolean;
  showFluxo?: boolean;
  onUpdateCost: (formulaId: string, compIndex: number, custoReais: number) => void;
}

function FormulaRow({ formula, editable, showFluxo = false, onUpdateCost }: FormulaRowProps) {
  const bom = calcBom(formula);
  return (
    <tr className="border-b border-gray-100 last:border-0 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
      {showFluxo && (
        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formula.fluxo}</td>
      )}
      <td className="py-3 pr-4">
        <span
          className={cn(
            'inline-flex px-2 py-0.5 rounded text-xs font-medium',
            getNivelBadge(formula.nivel)
          )}
        >
          {formula.nivel}
        </span>
      </td>
      <td className="py-3 pr-4 font-mono text-gray-700 dark:text-gray-300">{formula.sku}</td>
      <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{formula.produto}</td>
      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{formula.forma}</td>
      <td className="py-3 pr-4">
        <div className="space-y-1 max-w-xs">
          {formula.componentes.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <span>
                {c.nome} {c.dose}
              </span>
              {editable ? (
                <span className="flex items-center gap-1">
                  ·
                  <EditableCostInput
                    value={c.custoReais}
                    onChange={(v) => onUpdateCost(formula.id, i, v)}
                  />
                </span>
              ) : (
                <span className="font-medium">{formatReais(c.custoReais)}</span>
              )}
            </div>
          ))}
        </div>
      </td>
      <td className="py-3 text-right font-bold text-gray-900 dark:text-white">
        {formatReais(bom)}
      </td>
      <td className="py-3 pl-2">
        {formula.obs ? (
          <span
            className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 text-xs"
            title={formula.obs}
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[120px]">{formula.obs}</span>
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
    </tr>
  );
}
