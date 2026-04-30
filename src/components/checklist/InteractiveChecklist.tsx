'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Search, Filter, Download } from 'lucide-react';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  status: 'complete' | 'partial' | 'pending';
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  actionItems?: string[];
  estimatedTime?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  icon?: string;
  items: ChecklistItem[];
  collapsible?: boolean;
}

interface InteractiveChecklistProps {
  title: string;
  subtitle?: string;
  sections: ChecklistSection[];
  storageKey: string;
  showFilters?: boolean;
  showSearch?: boolean;
}

export function InteractiveChecklist({
  title,
  subtitle,
  sections,
  storageKey,
  showFilters = true,
  showSearch = true,
}: InteractiveChecklistProps) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(sections.map(s => s.id)));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'partial' | 'pending'>('all');

  // Carregar estado salvo do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCompletedItems(new Set(data.completedItems || []));
        setExpandedSections(new Set(data.expandedSections || sections.map(s => s.id)));
      } catch (e) {
        console.error('Erro ao carregar estado:', e);
      }
    }
  }, [storageKey, sections]);

  // Salvar estado no localStorage
  useEffect(() => {
    const data = {
      completedItems: Array.from(completedItems),
      expandedSections: Array.from(expandedSections),
    };
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [completedItems, expandedSections, storageKey]);

  const toggleItem = (itemId: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    const allItemIds = sections.flatMap(s => s.items.map(i => i.id));
    const allCompleted = allItemIds.every(id => completedItems.has(id));
    
    if (allCompleted) {
      setCompletedItems(new Set());
    } else {
      setCompletedItems(new Set(allItemIds));
    }
  };

  // Filtrar itens
  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'complete' && completedItems.has(item.id)) ||
        (statusFilter === 'partial' && item.status === 'partial' && !completedItems.has(item.id)) ||
        (statusFilter === 'pending' && item.status === 'pending' && !completedItems.has(item.id));
      
      return matchesSearch && matchesStatus;
    }),
  })).filter(section => section.items.length > 0);

  // Calcular estatísticas
  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const completedCount = completedItems.size;
  const completionPercentage = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  const getStatusColor = (status: ChecklistItem['status'], isCompleted: boolean) => {
    if (isCompleted) return 'bg-green-500';
    if (status === 'complete') return 'bg-green-500';
    if (status === 'partial') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (status: ChecklistItem['status'], isCompleted: boolean) => {
    if (isCompleted) return 'Concluído';
    if (status === 'complete') return 'Implementado';
    if (status === 'partial') return 'Parcial';
    return 'Pendente';
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
              {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
            </div>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
              <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>{completedCount} de {totalItems} itens concluídos</span>
              <button
                onClick={toggleAll}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                {completedCount === totalItems ? 'Desmarcar todos' : 'Marcar todos'}
              </button>
            </div>
          </div>

          {/* Filters */}
          {(showSearch || showFilters) && (
            <div className="flex flex-wrap gap-4">
              {showSearch && (
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar itens..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
              {showFilters && (
                <div className="flex items-center gap-2">
                  <Filter className="text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="complete">Concluídos</option>
                    <option value="partial">Parciais</option>
                    <option value="pending">Pendentes</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {filteredSections.map((section) => {
            const sectionCompleted = section.items.every(item => completedItems.has(item.id));
            const sectionProgress = section.items.length > 0
              ? Math.round((section.items.filter(item => completedItems.has(item.id)).length / section.items.length) * 100)
              : 0;

            return (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => section.collapsible !== false && toggleSection(section.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {section.icon && <span className="text-3xl">{section.icon}</span>}
                    <div className="flex-1 text-left">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              sectionCompleted ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${sectionProgress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {section.items.filter(item => completedItems.has(item.id)).length} / {section.items.length}
                        </span>
                      </div>
                    </div>
                  </div>
                  {section.collapsible !== false && (
                    <div className="ml-4">
                      {expandedSections.has(section.id) ? (
                        <ChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Section Items */}
                {expandedSections.has(section.id) && (
                  <div className="px-6 pb-6 space-y-3">
                    {section.items.map((item) => {
                      const isCompleted = completedItems.has(item.id);
                      const statusColor = getStatusColor(item.status, isCompleted);
                      const statusText = getStatusText(item.status, isCompleted);

                      return (
                        <div
                          key={item.id}
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-200
                            ${isCompleted 
                              ? 'bg-green-50 border-green-200' 
                              : item.status === 'partial'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-white border-gray-200 hover:border-purple-300'
                            }
                          `}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="flex-shrink-0 mt-1"
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-400 hover:text-purple-600 transition-colors" />
                              )}
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className={`
                                  text-lg font-semibold
                                  ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}
                                `}>
                                  {item.title}
                                </h3>
                                <span className={`
                                  px-3 py-1 rounded-full text-xs font-medium flex-shrink-0
                                  ${statusColor} text-white
                                `}>
                                  {statusText}
                                </span>
                              </div>

                              {item.description && (
                                <p className={`
                                  text-sm mb-3
                                  ${isCompleted ? 'text-gray-400' : 'text-gray-600'}
                                `}>
                                  {item.description}
                                </p>
                              )}

                              {item.actionItems && item.actionItems.length > 0 && (
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                                  {item.actionItems.map((action, idx) => (
                                    <li key={idx}>{action}</li>
                                  ))}
                                </ul>
                              )}

                              {item.estimatedTime && (
                                <p className="text-xs text-gray-500 mt-2">
                                  ⏱️ Tempo estimado: {item.estimatedTime}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

