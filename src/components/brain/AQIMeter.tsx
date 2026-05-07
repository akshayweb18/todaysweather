'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AQI_LEVELS = [
  {
    label: 'Good',
    color: '#10b981',
    description: 'Air is clean for most people.',
    impact: 'Low risk',
    recommendation: 'Outdoor activity is fine.'
  },
  {
    label: 'Fair',
    color: '#f59e0b',
    description: 'Air is acceptable, minor discomfort possible.',
    impact: 'Mild risk for sensitive groups',
    recommendation: 'If sensitive, reduce long outdoor exposure.'
  },
  {
    label: 'Moderate',
    color: '#f97316',
    description: 'Air can irritate sensitive people.',
    impact: 'Noticeable risk',
    recommendation: 'Avoid heavy exercise outdoors.'
  },
  {
    label: 'Poor',
    color: '#ef4444',
    description: 'Air quality is unhealthy for many people.',
    impact: 'High risk',
    recommendation: 'Limit outdoor time. Consider a mask.'
  },
  {
    label: 'Very Poor',
    color: '#7f1d1d',
    description: 'Serious health concern for everyone.',
    impact: 'Very high risk',
    recommendation: 'Stay indoors and use air filtration if possible.'
  },
];

export const AQIMeter: React.FC<{ aqi: number }> = ({ aqi }) => {
  const safeAqi = Math.min(5, Math.max(1, Math.round(aqi || 1)));
  const level = AQI_LEVELS[safeAqi - 1] || AQI_LEVELS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Air Quality Index</span>
        <div className="px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest border border-white/10 bg-white/5">
          Real-time
        </div>
      </div>

      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(safeAqi / 5) * 100}%` }}
          className="h-full"
          style={{ backgroundColor: level.color }}
        />
      </div>

      <div className="flex justify-between items-end">
        <div>
          <div className="text-4xl font-bold text-white mb-1 tracking-tighter">
            {level.label}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {level.description}
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            <span className="text-slate-300 font-semibold">Risk:</span> {level.impact}
          </p>
          <p className="text-[10px] text-cyan-300/80 mt-1">
            <span className="font-semibold">Do now:</span> {level.recommendation}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-slate-700 uppercase mb-1">Index</div>
          <div className="text-2xl font-bold text-white tabular-nums">{safeAqi}<span className="text-xs opacity-30 ml-1">/5</span></div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center">
        {AQI_LEVELS.map((item, index) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <div
              className="w-full h-1.5 rounded-full"
              style={{ backgroundColor: item.color, opacity: safeAqi === index + 1 ? 1 : 0.35 }}
            />
            <span className="text-[8px] text-slate-500 font-mono">{index + 1}</span>
          </div>
        ))}
      </div>

      <p className="text-[9px] text-slate-500">
        Scale note: this widget uses the OpenWeather AQI scale <span className="text-slate-300">1 to 5</span> (not 0 to 500).
      </p>
    </div>
  );
};
