'use client';

import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

type ScoreComparisonChartProps = {
  current: number;
  potential: number;
};

export default function ScoreComparisonChart({
  current,
  potential,
}: ScoreComparisonChartProps) {
  const data = {
    labels: ['Atual', 'Potencial', 'Faltante'],
    datasets: [
      {
        data: [current, potential - current, 100 - potential],
        backgroundColor: ['#00D084', '#00D084', '#000000'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}%`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className="bg-black/40 backdrop-blur-md border border-brand 
      rounded-3xl shadow-xl p-5 sm:p-6 flex flex-col items-center 
      gap-4 w-full max-w-xs hover:scale-[1.02] transition"
    >
      <h2 className="text-lg sm:text-xl font-bold text-brand text-center">
        🔍 Saúde Atual x Potencial
      </h2>

      <div className="w-40 h-40 sm:w-52 sm:h-52">
        <Doughnut data={data} options={options} />
      </div>

      <div className="flex justify-center gap-4 text-xs sm:text-sm text-white/70">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-brand" />
          Atual
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-brand" />
          Potencial
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-muted" />
          Faltante
        </div>
      </div>
    </div>
  );
}