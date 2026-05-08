'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiDashboardLine, RiArrowUpSFill, RiArrowDownSFill, RiInformationLine } from 'react-icons/ri';

interface PressureGaugeProps {
  pressure: number; // in hPa
}

export const PressureGauge: React.FC<PressureGaugeProps> = ({ pressure = 1013 }) => {
  // Normalize pressure (standard range 950 to 1050)
  const min = 960;
  const max = 1060;
  const range = max - min;
  const progress = Math.max(0, Math.min(1, (pressure - min) / range));
  
  // Needle rotation: -90deg to 90deg
  const rotation = (progress * 180) - 90;

  const getStatus = () => {
    if (pressure < 1000) return { label: 'Low Pressure', color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Possible precipitation' };
    if (pressure > 1022) return { label: 'High Pressure', color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Clear sky stable' };
    return { label: 'Normal', color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Typical conditions' };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col gap-8 w-full py-2">
      {/* 🧭 Analog Gauge Section */}
      <div className="relative w-full h-40 flex items-center justify-center">
        <svg viewBox="0 0 100 60" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="pressureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background Track */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="#f1f5f9" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          
          {/* Active Gradient Track */}
          <motion.path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="url(#pressureGradient)" 
            strokeWidth="8" 
            strokeLinecap="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          {/* Range Labels */}
          <text x="10" y="58" fontSize="3" fill="#94a3b8" fontWeight="bold" textAnchor="middle">960</text>
          <text x="50" y="8" fontSize="3" fill="#94a3b8" fontWeight="bold" textAnchor="middle">NORMAL</text>
          <text x="90" y="58" fontSize="3" fill="#94a3b8" fontWeight="bold" textAnchor="middle">1060</text>

          {/* Center Hub */}
          <circle cx="50" cy="50" r="4" fill="#1e293b" />
          
          {/* 🧭 The Needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            style={{ originX: '50px', originY: '50px' }}
          >
            <path d="M 50 50 L 50 15" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="15" r="1.5" fill="#1e293b" />
          </motion.g>
        </svg>

        {/* Big Numeric Readout */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black text-slate-900 tracking-tighter"
          >
            {pressure}
          </motion.span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Millibars (hPa)</span>
        </div>
      </div>

      {/* 📊 Trend & Info Intelligence */}
      <div className="grid grid-cols-1 gap-4">
        <div className={`p-5 rounded-[28px] border border-white/50 flex items-center justify-between shadow-sm transition-colors ${status.bg}`}>
          <div className="flex flex-col gap-1">
            <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>Atmospheric State</span>
            <span className="text-lg font-black text-slate-900">{status.label}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1 font-black ${pressure > 1013 ? 'text-orange-500' : 'text-blue-500'}`}>
              {pressure > 1013 ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
              <span className="text-xs uppercase">Trend</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">{status.desc}</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-[28px] p-5 border border-slate-100 flex items-start gap-4">
          <div className="p-2 bg-white rounded-xl shadow-sm">
            <RiInformationLine className="text-blue-500 text-xl" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Insight</span>
            <p className="text-xs font-bold text-slate-600 leading-relaxed">
              {pressure > 1020 
                ? "High pressure can occasionally cause headaches for sensitive individuals."
                : "Low pressure is often associated with changing weather patterns and clouds."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
