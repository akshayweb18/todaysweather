'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiDashboardLine, RiArrowUpSFill, RiArrowDownSFill, RiInformationLine, RiPulseLine } from 'react-icons/ri';

interface PressureGaugeProps {
  pressure: number;
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({ pressure = 1013 }) => {
  const min = 960;
  const max = 1060;
  const range = max - min;
  const progress = Math.max(0, Math.min(1, (pressure - min) / range));
  const rotation = (progress * 180) - 90;

  const getStatus = () => {
    if (pressure < 1000) return { label: 'Low (Cloudy)', color: '#3b82f6', bg: 'bg-blue-50/50', impact: 'Expect clouds or rain soon.' };
    if (pressure > 1022) return { label: 'High (Clear)', color: '#f59e0b', bg: 'bg-orange-50/50', impact: 'Sunny and stable weather.' };
    return { label: 'Normal (Stable)', color: '#10b981', bg: 'bg-emerald-50/50', impact: 'Standard pleasant conditions.' };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col gap-12 w-full py-2">
      {/* 🧭 High-Space Barometer Gauge */}
      <div className="relative w-full h-56 flex flex-col items-center">
        {/* SVG Area (Top half) */}
        <div className="w-full h-40 relative">
          <svg viewBox="0 -5 100 65" className="w-full h-full overflow-visible z-10">
            <defs>
              <linearGradient id="pressureGradientElite" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Main Track */}
            <path
              d="M 15 50 A 35 35 0 0 1 85 50"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Active Gradient Segment */}
            <motion.path
              d="M 15 50 A 35 35 0 0 1 85 50"
              fill="none"
              stroke="url(#pressureGradientElite)"
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 2, ease: "circOut" }}
            />

            {/* Simple Markers - High Visibility Black */}
            <text x="15" y="60" fontSize="5" fill="#1e293b" fontWeight="900" textAnchor="middle">LOW</text>
            <text x="50" y="5" fontSize="5" fill="#1e293b" fontWeight="900" textAnchor="middle">NORMAL</text>
            <text x="85" y="60" fontSize="5" fill="#1e293b" fontWeight="900" textAnchor="middle">HIGH</text>

            {/* 🧭 Precision Needle */}
            <motion.g
              initial={{ rotate: -90 }}
              animate={{ rotate: rotation }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
              style={{ originX: '50px', originY: '50px' }}
            >
              <path d="M 50 50 L 50 18" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
              <circle cx="50" cy="18" r="2" fill="#1e293b" />
            </motion.g>

            {/* Hub */}
            <circle cx="50" cy="50" r="5" fill="#1e293b" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* Big Numeric Readout - Moved completely below SVG to avoid overlap */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-baseline gap-2">
            <motion.span
              key={pressure}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-black text-slate-900 tracking-tighter"
            >
              {pressure}
            </motion.span>
            <span className="text-xl font-bold text-slate-400">hPa</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <RiPulseLine className="text-emerald-500 animate-pulse text-xs" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Air Pressure Monitoring</span>
          </div>
        </div>
      </div>

      {/* 📊 Simple Explanation Board */}
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div className={`p-6 rounded-[32px] border border-white flex items-center justify-between shadow-sm transition-all ${status.bg}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atmosphere</span>
            <span className="text-xl font-black text-slate-900">{status.label}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 font-black px-4 py-1.5 rounded-full text-[10px] uppercase shadow-sm ${pressure > 1013 ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
              {pressure > 1013 ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
              <span>{pressure > 1013 ? 'Rising' : 'Falling'}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-2">{status.impact}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 flex items-start gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm">
            <RiInformationLine className="text-blue-500 text-2xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weather Hint</span>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              {pressure > 1013
                ? "Higher pressure usually means the weather will stay clear and sunny."
                : "Lower pressure often means clouds or rain are moving into your area."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
