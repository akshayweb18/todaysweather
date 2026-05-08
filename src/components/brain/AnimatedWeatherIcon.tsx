'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedWeatherIconProps {
  condition: string;
  className?: string;
}

export const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ condition, className = "w-16 h-16" }) => {
  const c = condition?.toLowerCase() || 'clear';

  // ☀️ SUNNY / CLEAR
  if (c.includes('clear') || c.includes('sun')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <motion.svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.circle
            cx="50" cy="50" r="22"
            fill="#FCD34D"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {[...Array(8)].map((_, i) => (
              <rect
                key={i}
                x="47" y="10" width="6" height="15" rx="3"
                fill="#FBBF24"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
          </motion.g>
        </motion.svg>
        <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full -z-10" />
      </div>
    );
  }

  // 🌧️ RAIN
  if (c.includes('rain') || c.includes('drizzle')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path 
            d="M30 65 Q30 50 45 50 Q50 35 65 35 Q80 35 80 50 Q90 50 90 65 Q90 80 60 80 Q30 80 30 65" 
            fill="#94A3B8" 
          />
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={i}
              d="M40 85 Q40 95 35 95 Q30 95 30 85 Q30 75 35 75 Q40 75 40 85"
              fill="#60A5FA"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 15, opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
              style={{ transform: `translateX(${i * 15}px)` }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // ☁️ CLOUDY
  if (c.includes('cloud')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <motion.svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M25 65 Q25 50 40 50 Q45 35 60 35 Q75 35 75 50 Q85 50 85 65 Q85 80 55 80 Q25 80 25 65"
            fill="#CBD5E1"
            animate={{ x: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M10 70 Q10 60 25 60 Q30 50 45 50 Q60 50 60 60 Q75 60 75 70 Q75 80 45 80 Q10 80 10 70"
            fill="#94A3B8"
            animate={{ x: [3, -3, 3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </div>
    );
  }

  // ⛈️ THUNDERSTORM
  if (c.includes('thunder') || c.includes('storm')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path 
            d="M30 60 Q30 45 45 45 Q50 30 65 30 Q80 30 80 45 Q90 45 90 60 Q90 75 60 75 Q30 75 30 60" 
            fill="#475569" 
          />
          <motion.path
            d="M50 70 L40 90 L55 90 L45 110"
            stroke="#FDE047"
            strokeWidth="5"
            strokeLinejoin="round"
            fill="none"
            animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 2.5 }}
          />
        </svg>
      </div>
    );
  }

  // 🌫️ HAZE / MIST / FOG (Redesigned for Premium Google Aesthetic)
  if (c.includes('mist') || c.includes('fog') || c.includes('haze')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <motion.svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Subtle Background Cloud */}
          <motion.path
            d="M20 60 Q20 45 35 45 Q40 30 55 30 Q70 30 70 45 Q80 45 80 60 Q80 75 50 75 Q20 75 20 60"
            fill="#CBD5E1"
            opacity="0.3"
            animate={{ x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Smooth, Rounded Haze Lines */}
          {[
            { w: 60, y: 50, d: 4 },
            { w: 40, y: 62, d: 5 },
            { w: 50, y: 74, d: 6 },
          ].map((line, i) => (
            <motion.rect
              key={i}
              x={(100 - line.w) / 2}
              y={line.y}
              width={line.w}
              height="6"
              rx="3"
              fill="#94A3B8"
              animate={{ x: [((100 - line.w) / 2) - 10, ((100 - line.w) / 2) + 10, ((100 - line.w) / 2) - 10] }}
              transition={{ duration: line.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </motion.svg>
      </div>
    );
  }

  // ❄️ SNOW
  if (c.includes('snow')) {
    return (
      <div className={`relative ${className} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30 60 Q30 45 45 45 Q50 30 65 30 Q80 30 80 45 Q90 45 90 60 Q90 75 60 75 Q30 75 30 60" fill="#CBD5E1" />
          {[...Array(4)].map((_, i) => (
            <motion.circle
              key={i}
              cx={35 + i * 12} cy="80" r="3"
              fill="white"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 15, opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // DEFAULT
  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse blur-sm" />
    </div>
  );
};
