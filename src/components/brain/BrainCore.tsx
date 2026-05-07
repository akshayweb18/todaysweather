'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const BrainCore: React.FC<{ pulseRate?: number, weatherImage?: string }> = ({ pulseRate = 4, weatherImage }) => {
  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      {/* Outer Glow */}
      <motion.div
        className={`absolute w-full h-full rounded-full blur-3xl opacity-20 ${
          weatherImage?.includes('sunny') ? 'bg-orange-400' : 'bg-cyan-400'
        }`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: pulseRate,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Pulse Rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-full h-full border rounded-full ${
            weatherImage?.includes('sunny') ? 'border-orange-500/20' : 'border-cyan-500/20'
          }`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: pulseRate * 0.75,
            repeat: Infinity,
            delay: i * (pulseRate / 4),
            ease: "easeOut"
          }}
        />
      ))}

      {/* Central Core with High-End Illustration */}
      <div className="relative w-48 h-48 glass-card flex items-center justify-center overflow-hidden p-1 border-white/10">
        <motion.div
          className="absolute inset-0 z-0 opacity-40 blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {weatherImage && (
            <img 
              src={weatherImage} 
              alt="Weather State" 
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </motion.div>
        
        <motion.div
          className={`relative z-10 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center overflow-hidden border border-white/20`}
          animate={{
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: pulseRate / 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {weatherImage ? (
            <img 
              src={weatherImage} 
              alt="Neural State" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-indigo-600" />
          )}
        </motion.div>
        
        {/* Intelligence Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-full h-[1px] bg-white" />
          <div className="h-full w-[1px] bg-white" />
        </div>
      </div>
    </div>
  );
};
