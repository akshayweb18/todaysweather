'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiBaseStationLine, RiCompass3Line, RiRadarLine, RiSignalTowerLine } from 'react-icons/ri';

const LOADING_STEPS = [
  "Initializing Tactical Interface...",
  "Acquiring Satellite Uplink...",
  "Synchronizing Neural Telemetry...",
  "Calibrating Atmospheric Sensors...",
  "Mapping Global Weather Matrix...",
  "Finalizing Precision Forecast..."
];

export const PremiumLoading: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#f8f9fa] overflow-hidden">
      {/* 🌌 Atmospheric Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f0f4f9] to-[#e8f0fe] -z-10" />
      <div className="absolute inset-0 opacity-30 pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      {/* 🌀 Rotating Radar Rings */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-[#0b57d0]/10 rounded-full"
            style={{
              width: `${(i + 1) * 80}px`,
              height: `${(i + 1) * 80}px`
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}

        {/* 📡 Central Pulse Core */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10 w-24 h-24 bg-white rounded-full shadow-[0_0_50px_rgba(11,87,208,0.15)] border border-[#0b57d0]/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#0b57d0]/5 rounded-full"
          />
          <RiRadarLine className="text-4xl text-[#0b57d0] animate-pulse" />
        </motion.div>

        {/* 🛰️ Orbiting Sensors */}
        {[RiCompass3Line, RiSignalTowerLine, RiBaseStationLine].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute w-10 h-10 bg-white rounded-full shadow-sm border border-[#0b57d0]/5 flex items-center justify-center text-[#0b57d0]"
            animate={{
              x: Math.cos((i * 120 * Math.PI) / 180) * 110,
              y: Math.sin((i * 120 * Math.PI) / 180) * 110,
            }}
          >
            <Icon className="text-lg" />
          </motion.div>
        ))}
      </div>

      {/* 📝 Loading Status Text */}
      <div className="mt-16 flex flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#0b57d0] drop-shadow-sm">
              System_Sync
            </span>
            <p className="text-lg font-bold text-[#1f1f1f] tracking-tight">
              {LOADING_STEPS[stepIndex]}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 📊 Progress Bar */}
        <div className="w-48 h-1 bg-[#0b57d0]/5 rounded-full overflow-hidden mt-4 relative">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[#0b57d0]"
            animate={{
              width: ["0%", "100%"],
              left: ["-100%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* 🏷️ Bottom Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-1"
      >
        <span className="text-[10px] font-black text-[#5f6368] uppercase tracking-[0.2em]">
          Tactical Intelligence Dashboard
        </span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-[#0b57d0] rounded-full animate-ping" />
          <span className="text-[9px] font-bold text-[#0b57d0] uppercase tracking-widest">
            Aether_Flux_Protocol
          </span>
        </div>
      </motion.div>
    </div>
  );
};
