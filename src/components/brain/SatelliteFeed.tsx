'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const SatelliteFeed: React.FC<{ theme?: any }> = ({ theme }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
           <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)] ${theme?.glow || 'bg-cyan-400'}`} />
           <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Satellite Uplink</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">Encryption: AES-256</span>
           <span className="text-[8px] font-mono text-slate-700 tracking-widest">| SAT_REF: 07-OMEGA</span>
        </div>
      </div>

      <div className={`relative aspect-video rounded-[48px] overflow-hidden border-2 transition-all duration-1000 shadow-[0_0_50px_rgba(0,0,0,0.5)] group ${
        theme?.color === 'orange' ? 'border-orange-500/20' : 
        theme?.color === 'blue' ? 'border-blue-500/20' : 'border-white/10'
      }`}>
        {/* The generated high-tech radar image */}
        <img 
          src="/tactical_satellite_radar_1778148592047.png" 
          alt="Satellite Radar" 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-1000 group-hover:scale-105"
        />
        
        {/* Tactical HUD Overlays */}
        <div className="absolute inset-0 pointer-events-none z-20">
           {/* Circular Radar Sweep */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] pointer-events-none">
             <motion.div 
               className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.2)_360deg)] rounded-full"
               animate={{ rotate: 360 }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
             />
           </div>

           {/* Scanning Line */}
           <motion.div 
             className="absolute top-0 left-0 w-full h-[1.5px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
             animate={{ top: ['0%', '100%'] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           />

           {/* Vignette & Noise */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
           <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

           {/* HUD Brackets */}
           <div className="absolute top-10 left-10 w-10 h-10 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl" />
           <div className="absolute top-10 right-10 w-10 h-10 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-2xl" />
           <div className="absolute bottom-10 left-10 w-10 h-10 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-2xl" />
           <div className="absolute bottom-10 right-10 w-10 h-10 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl" />

           {/* Blinking Data Points */}
           <motion.div 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="absolute top-[30%] left-[40%] w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]"
           />
           <motion.div 
             animate={{ opacity: [0, 1, 0] }}
             transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
             className="absolute top-[60%] left-[70%] w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]"
           />
        </div>

        {/* Status Indicator */}
        <div className="absolute top-6 right-6 z-30">
          <div className="bg-black/80 backdrop-blur-xl border border-cyan-500/30 px-4 py-2 rounded-2xl flex items-center gap-3">
             <div className="relative">
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-red-600 rounded-full animate-ping" />
             </div>
             <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">Surveillance Active</span>
          </div>
        </div>

        {/* Telemetry Block */}
        <div className="absolute bottom-10 left-10 z-30 flex flex-col gap-2">
           <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-[24px]">
              <div className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                 Sector Telemetry
              </div>
              <div className="text-sm font-mono text-white tracking-tighter">
                19.0330<span className="text-cyan-500 opacity-40">°N</span> / 73.0297<span className="text-cyan-500 opacity-40">°E</span>
              </div>
           </div>
           <div className="px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-xl border border-white/5 w-fit">
              <span className="text-[7px] font-mono text-slate-500 uppercase tracking-[0.3em]">Stream_State: STABLE_LINK</span>
           </div>
        </div>
      </div>
    </div>
  );
};
