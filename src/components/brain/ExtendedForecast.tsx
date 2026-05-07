'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ForecastDay {
  date: string;
  temp: number;
  min: number;
  max: number;
  description: string;
  icon: string;
}

export const ExtendedForecast: React.FC<{ days: ForecastDay[] }> = ({ days }) => {
  return (
    <div className="flex flex-col w-full">
      <h3 className="text-sm font-medium text-[#444746] mb-4 px-1">10-day forecast</h3>
      <div className="space-y-1">
        {days?.map((day, i) => (
          <div 
            key={i}
            className="grid grid-cols-12 items-center py-3 px-1 border-b border-[#f0f0f0] last:border-0"
          >
            <div className="col-span-3 text-sm font-medium text-[#1f1f1f]">
              {i === 0 ? 'Today' : day.date}
            </div>
            <div className="col-span-2 flex justify-center">
               <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} className="w-8 h-8" alt="" />
            </div>
            <div className="col-span-2 text-sm text-[#444746] text-center">
               {day.min}°
            </div>
            <div className="col-span-3 px-2">
               <div className="h-1.5 w-full bg-[#f0f0f0] rounded-full relative overflow-hidden">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                    style={{ left: '20%', right: '20%' }}
                  />
               </div>
            </div>
            <div className="col-span-2 text-sm font-medium text-[#1f1f1f] text-right">
               {day.max}°
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full py-3 bg-[#f0f4f9] rounded-full text-sm font-medium text-[#0b57d0] hover:bg-[#e1e9f1] transition-colors">
        More for the next 10 days
      </button>
    </div>
  );
};
