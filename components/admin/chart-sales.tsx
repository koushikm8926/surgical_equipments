'use client';

import React from 'react';

interface DataPoint {
  date: string;
  amount: number;
}

interface SalesChartProps {
  data: DataPoint[];
  height?: number;
}

export function SalesChart({ data, height = 200 }: SalesChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
        Insufficient data for trend visualization
      </div>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount), 100);
  const padding = 20;
  const chartWidth = 500;
  const chartHeight = height;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - (d.amount / maxAmount) * (chartHeight - padding * 2) - padding;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `${points} ${chartWidth},${chartHeight} 0,${chartHeight}`;

  return (
    <div className="w-full h-full min-h-[200px]">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            y1={p * chartHeight}
            x2={chartWidth}
            y2={p * chartHeight}
            stroke="#e2e8f0"
            strokeWidth="0.5"
            strokeDasharray="4 4"
          />
        ))}

        {/* Area */}
        <polyline
          points={areaPoints}
          fill="url(#chartGradient)"
          className="transition-all duration-500"
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-primary, #2563eb)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />

        {/* Points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * chartWidth;
          const y = chartHeight - (d.amount / maxAmount) * (chartHeight - padding * 2) - padding;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="var(--color-primary, #2563eb)"
              strokeWidth="2"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${d.date}: ${d.amount}`}</title>
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
