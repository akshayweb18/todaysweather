'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedWeatherIcon } from './AnimatedWeatherIcon';
import { RiHistoryLine, RiDropLine, RiTempHotLine } from 'react-icons/ri';

interface ForecastDay {
  date: string;
  temp: number;
  min: number;
  max: number;
  description: string;
  icon: string;
  rainChance?: number;
}

export const ExtendedForecast: React.FC<{ days: ForecastDay[] }> = ({ days = [] }) => {
  // Defensive check for days
  const safeDays = days || [];
  
  // Find global min and max for the week to scale the bars meaningfully
  const allMins = safeDays.length > 0 ? safeDays.map(d => d.min) : [0];
  const allMaxs = safeDays.length > 0 ? safeDays.map(d => d.max) : [100];
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const globalRange = globalMax - globalMin || 1; // Prevent division by zero

  const historicalData = [
    { day: 'Yesterday', temp: 24, status: 'Clear' },
    { day: 'Wed', temp: 26, status: 'Sunny' },
    { day: 'Tue', temp: 23, status: 'Haze' },
    { day: 'Mon', temp: 21, status: 'Cloudy' },
    { day: 'Sun', temp: 25, status: 'Sunny' },
  ];

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex flex-col">
          <h3 className="text-lg font-black text-[#1f1f1f] tracking-tight">10-day forecast</h3>
          <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Extended Outlook</span>
        </div>
        <span className="text-[10px] font-bold text-[#0b57d0] uppercase tracking-tighter bg-[#e8f0fe] px-3 py-1 rounded-full border border-blue-100">Live Forecast</span>
      </div>

      <div className="space-y-1 mb-8">
        {safeDays.map((day, i) => {
          const barLeft = ((day.min - globalMin) / globalRange) * 80 + 10;
          const barWidth = ((day.max - day.min) / globalRange) * 80;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="grid grid-cols-12 items-center py-5 px-3 border-b border-[#f0f0f0] last:border-0 hover:bg-[#f8f9fa] transition-all rounded-[24px] group"
            >
              <div className="col-span-3 flex flex-col">
                <span className="text-base font-bold text-[#1f1f1f]">
                  {i === 0 ? 'Today' : day.date}
                </span>
                <span className="text-[11px] text-[#5f6368] font-bold capitalize truncate">
                  {day.description}
                </span>
              </div>

              <div className="col-span-2 flex flex-col items-center gap-1">
                <AnimatedWeatherIcon condition={day.description} className="w-10 h-10 group-hover:scale-110 transition-transform" />
                {(day.rainChance || 0) > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] font-black text-[#0b57d0]">
                    <RiDropLine className="scale-90" />
                    <span>{day.rainChance}%</span>
                  </div>
                )}
              </div>

              <div className="col-span-1.5 text-sm font-bold text-[#5f6368] text-right pr-2">
                {day.min}°
              </div>

              <div className="col-span-4 px-2">
                <div className="h-2.5 w-full bg-[#f0f0f0] rounded-full relative overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${barWidth}%`, opacity: 1 }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className="absolute h-full bg-gradient-to-r from-[#4dabf7] via-[#ffd43b] to-[#ff922b] rounded-full shadow-[0_0_12px_rgba(255,146,43,0.3)]"
                    style={{ 
                      left: `${barLeft}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 h-[40%] rounded-t-full" />
                  </motion.div>
                  
                  {i === 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute w-2.5 h-2.5 bg-white border-[3px] border-[#1f1f1f] rounded-full top-1/2 -translate-y-1/2 z-10 shadow-md"
                      style={{ left: `calc(${barLeft}% + ${barWidth * 0.4}%)` }}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-1.5 text-sm font-black text-[#1f1f1f] text-left pl-2">
                {day.max}°
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 📜 Enhanced Historical Section */}
      <div className="mt-auto pt-8 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-3 mb-5 px-1">
          <div className="p-2 bg-[#f0f4f9] rounded-xl">
            <RiHistoryLine className="text-[#0b57d0] text-lg" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-black text-[#1f1f1f] uppercase tracking-wider">Historical Intelligence</h3>
            <span className="text-[10px] font-bold text-[#5f6368]">Last 5-day retrospective</span>
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-3">
          {historicalData.map((record, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 py-4 px-2 bg-white/50 rounded-3xl border border-[#f1f3f4] shadow-sm hover:shadow-md transition-all"
            >
              <span className="text-[10px] font-black text-[#5f6368] uppercase truncate w-full text-center">{record.day}</span>
              <div className="w-8 h-8 flex items-center justify-center opacity-80">
                <AnimatedWeatherIcon condition={record.status} className="w-full h-full" />
              </div>
              <div className="flex flex-col items-center leading-tight">
                <span className="text-sm font-black text-[#1f1f1f]">{record.temp}°</span>
                <span className="text-[8px] font-bold text-[#5f6368] uppercase">{record.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <button className="mt-10 w-full py-4 bg-[#0b57d0] rounded-full text-sm font-bold text-white hover:bg-[#0842a0] shadow-lg shadow-blue-200 transition-all active:scale-95">
        Detailed Climate Archives
      </button>
    </div>
  );
};
