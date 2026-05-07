'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const AgentHealth: React.FC = () => {
  const agents = [
    { name: 'Analyst', load: 12 },
    { name: 'Strategist', load: 8 },
    { name: 'Executive', load: 45 },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
        Neural Load Balance
      </div>
      <div className="space-y-3">
        {agents.map((agent) => (
          <div key={agent.name} className="flex flex-col gap-1">
            <div className="flex justify-between text-[8px] font-mono text-slate-400">
              <span>{agent.name}</span>
              <span>{agent.load}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-500/50"
                initial={{ width: 0 }}
                animate={{ width: `${agent.load}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
