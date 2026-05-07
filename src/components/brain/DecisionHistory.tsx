'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Decision {
  id: string;
  timestamp: string;
  action: string;
  reason: string;
  impact: 'low' | 'medium' | 'high';
}

export const DecisionHistory: React.FC<{ decisions: Decision[] }> = ({ decisions }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        Autonomous Decision History
      </div>
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {decisions.map((d) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-4 rounded-2xl border-white/5 relative group hover:bg-white/5 transition-all"
            >
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
                d.impact === 'high' ? 'bg-red-500' : 
                d.impact === 'medium' ? 'bg-orange-500' : 'bg-green-500'
              }`} />
              <div className="flex justify-between items-start mb-1 pl-2">
                <span className="text-[10px] font-bold text-white uppercase">{d.action}</span>
                <span className="text-[9px] font-mono text-slate-500">{d.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-400 pl-2 leading-relaxed italic">
                "{d.reason}"
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
