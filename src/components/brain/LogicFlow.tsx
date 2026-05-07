'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LogicFlow: React.FC<{ activeAgent: string }> = ({ activeAgent }) => {
  const steps = [
    { id: 'Analyst', label: 'Data Interpretation' },
    { id: 'Strategist', label: 'Risk Assessment' },
    { id: 'Executive', label: 'Decision Engine' },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-8 relative">
      {/* Connector Lines */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
      
      {steps.map((step, i) => (
        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
          <motion.div 
            className={`w-4 h-4 rounded-full border-2 shadow-[0_0_15px_rgba(34,211,238,0.5)] ${
              activeAgent === step.id ? 'bg-cyan-400 border-cyan-400' : 'bg-slate-800 border-white/20'
            }`}
            animate={activeAgent === step.id ? { scale: [1, 1.4, 1], opacity: [1, 0.8, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <div className="flex flex-col items-center">
            <span className={`text-[8px] font-bold uppercase tracking-widest ${
              activeAgent === step.id ? 'text-cyan-400' : 'text-slate-500'
            }`}>
              {step.id}
            </span>
            <span className="text-[7px] text-slate-600 font-mono mt-0.5">{step.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
