// src/components/zapfarm/report/ReportAIBadge.tsx
// Badge de transparência sobre uso de IA no relatório

'use client';

export function ReportAIBadge() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200/50 py-3 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-lg">🤖</span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              Relatório gerado com apoio de Inteligência Artificial
            </span>
          </div>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-gray-600">
            Revisado e validado por equipe médica especializada
          </span>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-gray-600 italic">
            Não substitui consulta médica presencial
          </span>
        </div>
      </div>
    </div>
  );
}

