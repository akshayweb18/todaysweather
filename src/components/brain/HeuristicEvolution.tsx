'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeuristicEvolution: React.FC = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center text-[9px] uppercase tracking-widest text-slate-500 font-bold">
        <span>Heuristic Evolution</span>
        <span className="text-cyan-400">v4.2.1</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="flex justify-between text-[8px] font-mono text-slate-400 opacity-60">
        <span>Learning Rate: 0.0042</span>
        <span>Confidence: 98.4%</span>
      </div>
    </div>
  );
};
