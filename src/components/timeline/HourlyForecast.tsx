'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedWeatherIcon } from '@/components/brain/AnimatedWeatherIcon';
import { RiDropLine } from 'react-icons/ri';

interface HourlyData {
  dt: number;
  temp: number;
  description: string;
  rainChance: number;
}

interface HourlyForecastProps {
  items?: HourlyData[];
  timezone?: number;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ items = [], timezone = 0 }) => {
  const formatLocalTime = (dt: number) => {
    if (!dt) return '--:--';
    const date = new Date((dt + timezone) * 1000);
    return date.getUTCHours().toString().padStart(2, '0') + ':' + 
           date.getUTCMinutes().toString().padStart(2, '0');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-4 custom-scrollbar px-1 snap-x scroll-smooth">
        {items?.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="flex flex-col items-center gap-3 py-4 px-2 rounded-3xl min-w-[75px] snap-center hover:bg-[#f8f9fa] transition-colors"
          >
            <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-tighter">
              {i === 0 ? 'Now' : formatLocalTime(item.dt)}
            </span>

            <div className="relative group">
              <AnimatedWeatherIcon
                condition={item.description}
                className="w-10 h-10 group-hover:scale-110 transition-transform"
              />
              {item.rainChance > 0 && (
                <div className="absolute -bottom-1 -right-1 flex items-center text-[9px] font-black text-[#0b57d0] bg-white rounded-full px-1 border border-blue-50 shadow-sm">
                  <RiDropLine className="scale-75" />
                  {item.rainChance}%
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-[#1f1f1f]">{item.temp}°</span>
              <span className="text-[9px] font-medium text-[#5f6368] capitalize truncate w-16 text-center">
                {item.description}
              </span>
            </div>
          </motion.div>
        ))}

        {(!items || items.length === 0) && (
          <div className="flex items-center justify-center w-full py-8 text-sm text-[#5f6368] font-medium">
            Synchronizing hourly projections...
          </div>
        )}
      </div>
    </div>
  );
};
