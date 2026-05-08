'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiShieldCheckLine, RiInformationLine, RiLeafLine } from 'react-icons/ri';

const AQI_LEVELS = [
  {
    label: 'Good',
    color: '#00e400',
    bg: '#e6fce6',
    text: '#007a00',
    description: 'Air quality is satisfactory and poses little or no risk.',
    advice: 'Enjoy your outdoor activities.'
  },
  {
    label: 'Fair',
    color: '#ffff00',
    bg: '#ffffcc',
    text: '#808000',
    description: 'Acceptable quality; sensitive people should limit prolonged exposure.',
    advice: 'Sensitive groups should reduce effort.'
  },
  {
    label: 'Moderate',
    color: '#ff7e00',
    bg: '#fff2e6',
    text: '#b35900',
    description: 'General public not likely to be affected; sensitive groups may feel it.',
    advice: 'Limit heavy outdoor exercise.'
  },
  {
    label: 'Poor',
    color: '#ff0000',
    bg: '#ffe6e6',
    text: '#b30000',
    description: 'Everyone may begin to experience health effects.',
    advice: 'Avoid long outdoor exposure.'
  },
  {
    label: 'Very Poor',
    color: '#8f3f97',
    bg: '#f4e6f5',
    text: '#632c69',
    description: 'Health warnings of emergency conditions.',
    advice: 'Stay indoors as much as possible.'
  },
];

export const AQIMeter: React.FC<{ aqi: number }> = ({ aqi }) => {
  const safeAqi = Math.min(5, Math.max(1, Math.round(aqi || 1)));
  const level = AQI_LEVELS[safeAqi - 1] || AQI_LEVELS[0];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 🏷️ Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <RiLeafLine className="text-[#0b57d0]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#5f6368]">Air Quality</span>
        </div>
        <span className="text-[10px] font-bold text-[#0b57d0] bg-[#e8f0fe] px-2 py-0.5 rounded-full uppercase">Real-Time Data</span>
      </div>

      {/* 📊 Visual Gauge Row */}
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50" cy="50" r="40"
              stroke="#f0f0f0" strokeWidth="12" fill="none"
            />
            <motion.circle
              cx="50" cy="50" r="40"
              stroke={level.color} strokeWidth="12" fill="none"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * safeAqi) / 5 }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#1f1f1f] leading-none">{safeAqi}</span>
            <span className="text-[8px] font-bold text-[#5f6368] uppercase">AQI</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span 
            className="text-2xl font-bold tracking-tight"
            style={{ color: level.text }}
          >
            {level.label}
          </span>
          <div 
            className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase w-fit tracking-wide"
            style={{ backgroundColor: level.bg, color: level.text }}
          >
            Level {safeAqi} of 5
          </div>
        </div>
      </div>

      {/* 📝 Detailed Insight */}
      <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#f1f3f4] space-y-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <RiInformationLine className="text-[#0b57d0]" />
          </div>
          <p className="text-xs font-medium text-[#1f1f1f] leading-relaxed">
            {level.description}
          </p>
        </div>
        
        <div className="flex flex-col gap-3 py-2 border-t border-white/50">
          <div className="flex items-center gap-2">
            <RiShieldCheckLine className="text-[#0b57d0] text-sm shrink-0" />
            <span className="text-[11px] font-bold text-[#0b57d0] uppercase tracking-wider">Health Advice</span>
          </div>
          <p className="text-[11px] font-medium text-[#0b57d0] leading-normal flex-wrap break-words">
            {level.advice}
          </p>
        </div>
      </div>

      {/* 📏 Comparative Scale */}
      <div className="grid grid-cols-5 gap-1.5 px-1">
        {AQI_LEVELS.map((item, index) => (
          <div 
            key={index} 
            className={`h-1.5 rounded-full transition-all duration-500 ${safeAqi === index + 1 ? 'scale-y-150' : 'opacity-20'}`}
            style={{ backgroundColor: item.color }}
          />
        ))}
      </div>
    </div>
  );
};
