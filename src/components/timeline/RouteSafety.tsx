'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiPinDistanceLine, RiCompass3Line } from 'react-icons/ri';

export const RouteSafety: React.FC = () => {
  const segments = [
    { label: 'Origin', status: 'safe' },
    { label: 'Sector A', status: 'safe' },
    { label: 'Sector B', status: 'hazard' },
    { label: 'Destination', status: 'safe' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        <span>Route Safety Monitor</span>
        <RiCompass3Line className="text-cyan-400" />
      </div>
      
      <div className="relative flex justify-between items-center px-2 py-4">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
        
        {segments.map((s, i) => (
          <div key={i} className="relative flex flex-col items-center gap-2">
            <motion.div 
              className={`w-3 h-3 rounded-full border-2 ${
                s.status === 'safe' ? 'bg-green-500 border-green-500/50' : 'bg-red-500 border-red-500/50'
              }`}
              animate={s.status === 'hazard' ? { scale: [1, 1.5, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-[8px] font-mono text-slate-500 uppercase">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
        <div className="text-[8px] text-red-400 font-bold uppercase mb-1">Hazard Detected: Sector B</div>
        <p className="text-[10px] text-slate-400 font-sans italic leading-tight">
          Micro-burst detected at 14:10. Rerouting suggested.
        </p>
      </div>
    </div>
  );
};
