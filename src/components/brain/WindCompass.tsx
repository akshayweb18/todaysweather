'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiNavigationFill } from 'react-icons/ri';

interface WindCompassProps {
  deg: number;
  speed: number;
}

export const WindCompass: React.FC<WindCompassProps> = ({ deg = 0, speed = 0 }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 h-full relative overflow-hidden">
      {/* 🧭 3D Compass Housing */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Outer Ring with Glow */}
        <div className="absolute inset-0 border-[3px] border-slate-100 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.02)]" />

        {/* Cardinal Markers */}
        <div className="absolute inset-2 border border-slate-50 rounded-full">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pt-1 text-[11px] font-black text-slate-400">N</span>
          <span className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 pr-1 text-[11px] font-black text-slate-400">E</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pb-1 text-[11px] font-black text-slate-400">S</span>
          <span className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 pl-1 text-[11px] font-black text-slate-400">W</span>
        </div>

        {/* 🧭 3D Needle Logic */}
        <motion.div
          animate={{ rotate: deg }}
          transition={{ type: "spring", stiffness: 40, damping: 12 }}
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Main Needle Shadow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-24 bg-slate-900/5 blur-[2px] rounded-full" style={{ transform: 'rotate(5deg)' }} />

          {/* The Needle */}
          <div className="relative group cursor-pointer">
            <RiNavigationFill className="text-5xl text-[#0b57d0] drop-shadow-[0_10px_15px_rgba(11,87,208,0.3)] transition-all group-hover:scale-110" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-[#0b57d0]" />
          </div>

          {/* Tail Indicator */}
          <div className="absolute bottom-10 w-0.5 h-6 bg-slate-200 rounded-full" />
        </motion.div>

        {/* Central Hub Detail */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/40 backdrop-blur-sm rounded-full border border-white/60 pointer-events-none" />
      </div>

      {/* 📊 Speed Readout */}
      <div className="mt-8 flex flex-col items-center">
        <motion.div
          key={speed}
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black text-slate-900 tracking-tighter"
        >
          {speed} <span className="text-sm font-bold text-slate-400">km/h</span>
        </motion.div>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-[#0b57d0] rounded-full animate-ping" />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Real-Time Vectoring</span>
        </div>
      </div>
    </div>
  );
};
