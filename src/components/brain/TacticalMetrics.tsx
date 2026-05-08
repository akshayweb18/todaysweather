'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiWindyLine, RiWaterPercentLine, RiSunFoggyLine, RiCompass3Line } from 'react-icons/ri';

interface MetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: any;
  subValue?: string;
  color: string;
  animate?: any;
  animateDuration?: number;
}

const MetricCard = ({ label, value, unit, icon: Icon, subValue, color, animate, animateDuration }: MetricProps) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white/60 backdrop-blur-xl p-4 rounded-[28px] border border-white/60 shadow-sm flex flex-col gap-3 group transition-all"
  >
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-xl bg-${color}-50 text-${color}-500 group-hover:scale-110 transition-transform`}>
        <motion.div 
          animate={animate}
          transition={animateDuration ? { duration: animateDuration, repeat: Infinity, ease: "linear" } : {}}
        >
          <Icon className="text-xl" />
        </motion.div>
      </div>
      <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">{label}</span>
    </div>
    
    <div className="flex flex-col">
      <div className="text-2xl font-bold text-[#1f1f1f] tracking-tight">
        {value} <span className="text-sm font-medium text-[#5f6368]">{unit}</span>
      </div>
      {subValue && (
        <span className="text-[10px] font-medium text-[#5f6368]">{subValue}</span>
      )}
    </div>
  </motion.div>
);

export const TacticalMetrics = ({ weather }: { weather: any }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <MetricCard 
        label="Wind" 
        value={weather?.windSpeed || 0} 
        unit="km/h" 
        icon={RiWindyLine}
        subValue={`Direction: ${weather?.windDeg || 0}°`}
        color="blue"
        animate={{ x: [-2, 2, -2] }}
      />
      <MetricCard 
        label="Humidity" 
        value={weather?.humidity || 0} 
        unit="%" 
        icon={RiWaterPercentLine}
        subValue="Dew point: 12°"
        color="cyan"
        animate={{ y: [0, -3, 0] }}
      />
      <MetricCard 
        label="UV Index" 
        value="4.5" 
        icon={RiSunFoggyLine}
        subValue="Moderate"
        color="orange"
        animate={{ scale: [1, 1.1, 1] }}
      />
      <MetricCard 
        label="Visibility" 
        value={weather?.visibility || 0} 
        unit="km" 
        icon={RiCompass3Line}
        subValue="Clear sky"
        color="emerald"
        animate={{ rotate: 360 }}
        animateDuration={20}
      />
    </div>
  );
};
