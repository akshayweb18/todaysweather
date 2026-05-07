'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TimelinePoint {
  time: string;
  risk: number;
  label: string;
  intensity: 'low' | 'medium' | 'high';
}

const MOCK_TIMELINE: TimelinePoint[] = [
  { time: '14:00', risk: 10, label: 'Stable', intensity: 'low' },
  { time: '15:00', risk: 15, label: 'Clouding', intensity: 'low' },
  { time: '16:00', risk: 45, label: 'Storm Peak', intensity: 'medium' },
  { time: '17:00', risk: 30, label: 'Residual', intensity: 'low' },
  { time: '18:00', risk: 85, label: 'High Alert', intensity: 'high' },
];

export const PredictiveTimeline: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
        Predictive Risk Horizon
      </div>
      <div className="flex items-end gap-2 h-32 px-2">
        {MOCK_TIMELINE.map((point, index) => (
          <motion.div
            key={point.time}
            className="flex-1 flex flex-col items-center gap-2 group cursor-help"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100%', opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative w-full flex-1 flex flex-col justify-end">
              <motion.div
                className={`w-full rounded-t-lg transition-all ${
                  point.intensity === 'high' ? 'bg-red-500/50' : 
                  point.intensity === 'medium' ? 'bg-orange-500/50' : 
                  'bg-cyan-500/30'
                }`}
                style={{ height: `${point.risk}%` }}
                whileHover={{ scaleY: 1.05 }}
              />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black px-1 rounded">
                {point.risk}%
              </div>
            </div>
            <div className="text-[9px] font-mono text-slate-500">{point.time}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
