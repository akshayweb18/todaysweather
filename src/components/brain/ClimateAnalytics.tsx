'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiShirtLine, RiWalkLine, RiHeartPulseLine, RiTempHotLine } from 'react-icons/ri';

interface ClimateAnalyticsProps {
  currentTemp: number;
  feelsLike: number;
  high: number;
  low: number;
  humidity: number;
}

export const ClimateAnalytics: React.FC<ClimateAnalyticsProps> = ({
  currentTemp,
  feelsLike,
  high,
  low,
  humidity,
}) => {
  // Logic for Clothing Advice
  const getClothing = () => {
    if (currentTemp > 30) return { text: 'Light cotton clothes', icon: '👕' };
    if (currentTemp > 20) return { text: 'T-shirt & comfortable pants', icon: '👕' };
    if (currentTemp > 15) return { text: 'Light jacket or hoodie', icon: '🧥' };
    return { text: 'Warm jacket & layers', icon: '🧥' };
  };

  // Logic for Activity
  const getActivity = () => {
    if (humidity > 80 && currentTemp > 25) return 'Avoid heavy outdoor exercise';
    if (currentTemp > 35) return 'Stay indoors, stay cool';
    return 'Perfect for outdoor walks';
  };

  const clothing = getClothing();
  const activity = getActivity();

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <RiHeartPulseLine className="text-[#d93025]" />
          <span className="text-xs font-bold text-[#1f1f1f] uppercase tracking-wider">Health & Comfort</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* 👕 Clothing Suggestion */}
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center gap-4 shadow-sm group hover:bg-white/80 transition-colors">
          <div className="text-3xl group-hover:scale-110 transition-transform">{clothing.icon}</div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-tighter">What to wear</span>
            <span className="text-sm font-bold text-[#1f1f1f]">{clothing.text}</span>
          </div>
        </div>

        {/* 🏃 Activity Suggestion */}
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center gap-4 shadow-sm group hover:bg-white/80 transition-colors">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 transition-colors">
            <RiWalkLine className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-tighter">Daily Activity</span>
            <span className="text-sm font-bold text-[#1f1f1f]">{activity}</span>
          </div>
        </div>

        {/* 🌡️ Thermal Sensation */}
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/60 flex items-center gap-4 shadow-sm group hover:bg-white/80 transition-colors">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
            <RiTempHotLine className="text-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-tighter">Thermal Feel</span>
            <span className="text-sm font-bold text-[#1f1f1f]">
              {Math.abs(currentTemp - feelsLike) > 3 ? 'Significant variance detected' : 'Temperatures feel consistent'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
