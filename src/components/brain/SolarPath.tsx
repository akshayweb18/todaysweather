'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RiSunLine, RiMoonLine, RiTimerLine } from 'react-icons/ri';

interface SolarPathProps {
  sunrise: string;
  sunset: string;
}

export const SolarPath: React.FC<SolarPathProps> = ({ sunrise, sunset }) => {
  const { currentProgress, daylightDuration, solarStatus } = useMemo(() => {
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
      let status = 'Before Sunrise';

      if (nowMin < riseMin) {
        progress = 0;
        status = 'Sun will rise soon';
      } else if (nowMin > setMin) {
        progress = 1;
        status = 'Night cycle active';
      } else {
        progress = (nowMin - riseMin) / (setMin - riseMin);
        if (progress < 0.2) status = 'Early Morning';
        else if (progress < 0.4) status = 'Morning Sun';
        else if (progress < 0.6) status = 'Solar Noon / Peak';
        else if (progress < 0.8) status = 'Evening approaching';
        else status = 'Sunset soon';
      }

      return { 
        currentProgress: progress, 
        daylightDuration: `${h}h ${m}m`,
        solarStatus: status
      };
    } catch {
      return { currentProgress: 0.5, daylightDuration: '12h 0m', solarStatus: 'Solar Peak' };
    }
  }, [sunrise, sunset]);

  // SVG Path for the arc
  const arcPath = "M 10 80 Q 50 10 90 80";
  
  const t = currentProgress;
  const sunX = Math.pow(1 - t, 2) * 10 + 2 * (1 - t) * t * 50 + Math.pow(t, 2) * 90;
  const sunY = Math.pow(1 - t, 2) * 80 + 2 * (1 - t) * t * 10 + Math.pow(t, 2) * 80;

  return (
    <div className="flex flex-col gap-6 w-full py-4 px-2">
      {/* 🌞 Visual Arc Section */}
      <div className="relative h-40 w-full mb-4">
        <div className="absolute inset-x-0 bottom-0 h-px bg-[#f0f0f0] z-0" />
        
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path 
            d={arcPath} 
            fill="none" 
            stroke="#f0f0f0" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {/* Progress Arc */}
          <motion.path 
            d={arcPath} 
            fill="none" 
            stroke="url(#solarGradientUpgrade)" 
            strokeWidth="4" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentProgress }}
            transition={{ duration: 2, ease: "easeOut" }}
          />

          <defs>
            <linearGradient id="solarGradientUpgrade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Labels on the Arc */}
          <text x="10" y="90" fontSize="4" fill="#5f6368" fontWeight="bold" textAnchor="middle">RISE</text>
          <text x="50" y="5" fontSize="4" fill="#5f6368" fontWeight="bold" textAnchor="middle">NOON</text>
          <text x="90" y="90" fontSize="4" fill="#5f6368" fontWeight="bold" textAnchor="middle">SET</text>

          {/* Sun Marker with Large Glow */}
          <motion.g
            animate={{ x: sunX, y: sunY }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <circle r="12" fill="#fbbf24" opacity="0.1" />
            <circle r="8" fill="#fbbf24" opacity="0.2" className="animate-pulse" />
            <circle r="4" fill="#fbbf24" stroke="white" strokeWidth="1" className="shadow-xl" />
          </motion.g>
        </svg>

        {/* Floating Time Badges */}
        <div className="absolute -left-2 bottom-0 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-[#f0f0f0] shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-[#1f1f1f]">{sunrise}</span>
          <RiSunLine className="text-orange-400 text-xs" />
        </div>

        <div className="absolute -right-2 bottom-0 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-[#f0f0f0] shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-black text-[#1f1f1f]">{sunset}</span>
          <RiMoonLine className="text-blue-500 text-xs" />
        </div>
      </div>

      {/* 📊 Intelligence Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#f1f3f4] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-[#5f6368]">
            <RiTimerLine className="text-sm" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Total Daylight</span>
          </div>
          <span className="text-sm font-bold text-[#1f1f1f]">{daylightDuration}</span>
        </div>

        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#f1f3f4] flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 text-[#0b57d0]">
            <RiSunLine className="text-sm" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Current Status</span>
          </div>
          <span className="text-sm font-bold text-[#1f1f1f] truncate">{solarStatus}</span>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-center text-[#5f6368] italic">
        {currentProgress > 0 && currentProgress < 1 ? `Sun is at ${(currentProgress * 100).toFixed(0)}% of its daily journey.` : 'Sun is currently below the horizon.'}
      </p>
    </div>
  );
};
