'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiSunLine, RiCloudLine, RiRainyLine, RiMistLine } from 'react-icons/ri';

interface ForecastItem {
  time: string;
  temp: number;
  icon: React.ReactNode;
}

export const HourlyForecast: React.FC<{ temp?: number }> = ({ temp = 22 }) => {
  const forecast: ForecastItem[] = [
    { time: 'Now', temp: temp, icon: <RiSunLine className="text-yellow-400" /> },
    { time: '14:00', temp: temp + 1, icon: <RiSunLine className="text-yellow-400" /> },
    { time: '15:00', temp: temp + 2, icon: <RiCloudLine className="text-slate-400" /> },
    { time: '16:00', temp: temp + 1, icon: <RiRainyLine className="text-blue-400" /> },
    { time: '17:00', temp: temp - 1, icon: <RiMistLine className="text-slate-500" /> },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        Neural Hourly Projection
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar px-1">
        {forecast.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center gap-3 glass p-4 rounded-3xl min-w-[80px] border-white/5 hover:bg-white/10 transition-colors"
          >
            <span className="text-[10px] font-mono text-slate-500">{item.time}</span>
            <div className="text-2xl">{item.icon}</div>
            <span className="text-sm font-bold text-white">{item.temp}°</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
