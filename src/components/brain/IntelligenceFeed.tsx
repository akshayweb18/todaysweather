'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedItem {
  id: string;
  agent: string;
  message: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
}

export const IntelligenceFeed: React.FC<{ items: FeedItem[] }> = ({ items }) => {
  return (
    <div className="flex flex-col gap-3 h-[400px] overflow-hidden">
      <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-2 opacity-60">
        Live Intelligence Stream
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-3 rounded-xl border-l-2 border-cyan-500/50"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded uppercase">
                  {item.agent}
                </span>
                <span className="text-[9px] opacity-40 font-mono">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {item.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
