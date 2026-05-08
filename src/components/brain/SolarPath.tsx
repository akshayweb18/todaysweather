'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RiSunFill, RiMoonFill, RiTimeLine, RiSunLine } from 'react-icons/ri';

interface SolarPathProps {
  sunrise: string;
  sunset: string;
}

export const SolarPath: React.FC<SolarPathProps> = ({ sunrise, sunset }) => {
  const { currentProgress, daylightDuration, statusText, timeLeft } = useMemo(() => {
    try {
      const now = new Date();
      const [riseH, riseM] = (sunrise || '06:00').split(':').map(Number);
      const [setH, setM] = (sunset || '18:00').split(':').map(Number);

      const riseMin = riseH * 60 + (riseM || 0);
      const setMin = setH * 60 + (setM || 0);
      const nowMin = now.getHours() * 60 + now.getMinutes();

      const durationMin = setMin - riseMin;
      const h = Math.floor(durationMin / 60);
      const m = durationMin % 60;

      let progress = 0;
      let status = '';
      let remaining = '';

      if (nowMin < riseMin) {
        progress = 0;
        status = 'Sun is rising soon';
        const diff = riseMin - nowMin;
        remaining = `Sunrise in ${Math.floor(diff / 60)}h ${diff % 60}m`;
      } else if (nowMin > setMin) {
        progress = 1;
        status = 'Sunset has passed';
        remaining = 'Night time';
      } else {
        progress = (nowMin - riseMin) / (setMin - riseMin);
        status = 'Daylight is active';
        const diff = setMin - nowMin;
        remaining = `Sunset in ${Math.floor(diff / 60)}h ${diff % 60}m`;
      }

      return {
        currentProgress: progress,
        daylightDuration: `${h} hours ${m} mins`,
        statusText: status,
        timeLeft: remaining
      };
    } catch {
      return { currentProgress: 0.5, daylightDuration: '12 hours', statusText: 'Daylight Active', timeLeft: 'Sunset soon' };
    }
  }, [sunrise, sunset]);

  return (
    <div className="flex flex-col gap-8 w-full py-4">
      {/* 🚀 Super Simple Visual Timeline */}
      <div className="relative w-full h-32 flex flex-col justify-end px-2">
        {/* The Arc (Simple & Thin) */}
        <div className="absolute inset-x-0 bottom-8 h-24 overflow-hidden">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: currentProgress }}
              transition={{ duration: 1.5 }}
            />
          </svg>
        </div>

        {/* ☀️ Big Animated Sun Marker */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <motion.div
            className="flex flex-col items-center gap-1 mb-8"
            animate={{
              x: `${(currentProgress * 80) - 40}%`,
              y: `-${Math.sin(currentProgress * Math.PI) * 60}px`
            }}
          >
            <RiSunFill className="text-4xl text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
            <div className="bg-black/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
              YOU
            </div>
          </motion.div>
        </div>

        {/* Labels */}
        <div className="flex justify-between items-center w-full relative z-10">
          <div className="flex flex-col items-start">
            <RiSunLine className="text-orange-400 text-2xl mb-1" />
            <span className="text-sm font-black text-[#1f1f1f]">{sunrise}</span>
            <span className="text-[10px] font-bold text-[#5f6368] uppercase">Sunrise</span>
          </div>

          <div className="flex flex-col items-end">
            <RiMoonFill className="text-blue-500 text-2xl mb-1" />
            <span className="text-sm font-black text-[#1f1f1f]">{sunset}</span>
            <span className="text-[10px] font-bold text-[#5f6368] uppercase">Sunset</span>
          </div>
        </div>
      </div>

      {/* 📝 Direct Information (Easy to Understand) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Time Remaining</span>
            <span className="text-xl font-black text-amber-900">{timeLeft}</span>
          </div>
          <RiTimeLine className="text-4xl text-amber-300" />
        </div>

        <div className="bg-[#f8f9fa] rounded-3xl p-6 border border-[#f1f3f4] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-[#5f6368] uppercase">Daylight Today</span>
            <span className="text-xs font-black text-[#1f1f1f]">{daylightDuration}</span>
          </div>
          <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-[#f1f3f4]">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-300 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${currentProgress * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-[11px] font-medium text-[#5f6368] mt-1 text-center italic">
            Current status: <span className="font-bold text-[#1f1f1f] not-italic">{statusText}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
