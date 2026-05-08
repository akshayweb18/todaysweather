'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WeatherAtmosphereProps {
  condition: string;
}

const WeatherAtmosphereComponent: React.FC<WeatherAtmosphereProps> = ({ condition = 'clear' }) => {
  const c = condition.toLowerCase();
  const isRainy = c.includes('rain') || c.includes('drizzle') || c.includes('storm');
  const isCloudy = c.includes('cloud');
  const isSunny = c.includes('clear') || c.includes('sun');

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base Atmosphere Overlay */}
      <div className={`absolute inset-0 transition-colors duration-[2000ms] ${
        isRainy ? 'bg-slate-900/15' : 
        isSunny ? 'bg-blue-500/5' : 
        'bg-slate-400/10'
      }`} />

      {/* 🌧️ Cinematic Parallax Rain */}
      {isRainy && (
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ top: -100, left: `${Math.random() * 100}%` }}
              animate={{ top: '120%' }}
              transition={{ 
                duration: 0.4 + Math.random() * 0.4, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2 
              }}
              className="absolute w-[1px] h-16 bg-gradient-to-t from-blue-400/40 via-white/20 to-transparent shadow-[0_0_8px_rgba(255,255,255,0.2)]"
              style={{ transform: 'rotate(12deg) translateZ(0)', willChange: 'transform' }}
            />
          ))}
        </div>
      )}

      {/* ☀️ Radiant Sun Flare */}
      {isSunny && (
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1], 
            opacity: [0.1, 0.25, 0.1],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-60 -right-60 w-[800px] h-[800px] bg-yellow-400/10 rounded-full blur-[100px] shadow-[inset_0_0_100px_rgba(255,255,0,0.1)]"
          style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
        />
      )}

      {/* ☁️ Volumetric Drifting Clouds */}
      {isCloudy && (
        <div className="absolute inset-0 opacity-25">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ left: '-30%', top: `${15 + i * 18}%` }}
              animate={{ left: '130%' }}
              transition={{ 
                duration: 80 + Math.random() * 80, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * -15
              }}
              className="absolute w-[400px] h-48 bg-white/30 rounded-full blur-[80px] shadow-2xl"
              style={{ willChange: 'transform', transform: 'translateZ(0)' }}
            />
          ))}
        </div>
      )}

      {/* ⚡ Thunder Flash (Randomized) */}
      {isRainy && c.includes('storm') && (
        <motion.div
          animate={{ opacity: [0, 0, 0.4, 0, 0.6, 0, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 3 }}
          className="absolute inset-0 bg-white z-10"
        />
      )}
    </div>
  );
};

export const WeatherAtmosphere = React.memo(WeatherAtmosphereComponent);
