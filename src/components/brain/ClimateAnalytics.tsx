'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RiShirtLine, RiWalkLine, RiHeartPulseLine, RiTempHotLine, RiUmbrellaLine, RiSunLine, RiMistLine } from 'react-icons/ri';

interface ClimateAnalyticsProps {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  condition?: string;
  uvIndex?: number;
}

export const ClimateAnalytics: React.FC<ClimateAnalyticsProps> = ({
  currentTemp,
  feelsLike,
  humidity,
  condition = '',
  uvIndex = 4,
}) => {
  const c = condition.toLowerCase();

  // 👕 "Human-First" Clothing Intelligence
  const getClothingAdvice = () => {
    // Priority 1: Precipitation (Rain/Storm)
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
      return { 
        title: 'Umbrella Required', 
        desc: 'Carry an umbrella & wear a waterproof jacket to stay dry.', 
        icon: <RiUmbrellaLine className="text-blue-500" />,
        color: 'bg-blue-50'
      };
    }
    
    // Priority 2: High Heat
    if (currentTemp > 34) {
      return { 
        title: 'Extreme Heat Gear', 
        desc: 'Wear ultra-light, loose cotton clothes. Keep a hat handy.', 
        icon: <RiSunLine className="text-orange-500" />,
        color: 'bg-orange-50'
      };
    }

    // Priority 3: Moderate Heat
    if (currentTemp > 26) {
      return { 
        title: 'Summer Attire', 
        desc: 'Light t-shirt & shorts are ideal. Avoid dark colors.', 
        icon: <RiShirtLine className="text-amber-500" />,
        color: 'bg-amber-50'
      };
    }

    // Priority 4: Pleasant
    if (currentTemp > 18) {
      return { 
        title: 'Comfort Layers', 
        desc: 'Perfect weather for a light hoodie or casual cotton layers.', 
        icon: <RiShirtLine className="text-emerald-500" />,
        color: 'bg-emerald-50'
      };
    }

    // Priority 5: Chilly
    if (currentTemp > 10) {
      return { 
        title: 'Jacket Weather', 
        desc: 'A sweater or medium jacket is needed to stay warm.', 
        icon: <RiShirtLine className="text-indigo-500" />,
        color: 'bg-indigo-50'
      };
    }

    // Priority 6: Cold
    return { 
      title: 'Heavy Protection', 
      desc: 'Wear a heavy coat, scarf & gloves. It is freezing outside.', 
      icon: <RiMistLine className="text-blue-800" />,
      color: 'bg-slate-100'
    };
  };

  // 🏃 Smart Lifestyle Activity
  const getActivityAdvice = () => {
    if (c.includes('storm') || c.includes('thunder')) return { status: 'Alert: Stay Indoors', detail: 'Lightning and heavy rain risk.', safe: false };
    if (c.includes('rain')) return { status: 'Indoor Workout Only', detail: 'Slippery roads and wet atmosphere.', safe: false };
    if (currentTemp > 38) return { status: 'Heat Warning', detail: 'High risk of heatstroke outdoors.', safe: false };
    if (humidity > 80) return { status: 'Muggy Conditions', detail: 'Air feels heavy; stay hydrated.', safe: true };
    if (currentTemp >= 16 && currentTemp <= 26 && !c.includes('rain')) return { status: 'Peak Fitness Window', detail: 'Ideal for running or outdoor sports.', safe: true };
    return { status: 'Standard Activity', detail: 'Standard weather for daily tasks.', safe: true };
  };

  const clothing = getClothingAdvice();
  const activity = getActivityAdvice();

  // ⚡ High-Priority Instruction
  const getQuickAction = () => {
    if (c.includes('rain')) return { text: 'Umbrella Needed', icon: <RiUmbrellaLine /> };
    if (uvIndex && uvIndex > 6) return { text: 'Sunscreen On', icon: <RiSunLine /> };
    if (currentTemp > 35) return { text: 'Stay Hydrated', icon: <RiHeartPulseLine /> };
    if (currentTemp < 15) return { text: 'Wear Layers', icon: <RiShirtLine /> };
    return { text: 'Conditions Clear', icon: <RiWalkLine /> };
  };

  const action = getQuickAction();

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* ⚡ "In-A-Glance" Action Badge - Normalized to White Glass */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-xl text-amber-500">{action.icon}</div>
          <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{action.text}</span>
        </div>
        <div className="text-[9px] font-bold text-slate-400 uppercase">Action Required</div>
      </div>

      {/* 🧥 Master Clothing Card */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-6 rounded-[32px] border border-white flex flex-col gap-4 shadow-sm ${clothing.color}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
            {clothing.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Attire</span>
            <span className="text-lg font-black text-slate-900 leading-tight">{clothing.title}</span>
          </div>
        </div>
        <p className="text-xs font-bold text-slate-600 leading-relaxed bg-white/40 p-3 rounded-2xl border border-white/60">
          {clothing.desc}
        </p>
      </motion.div>

      {/* 🏃 Actionable Activity Hub */}
      <div className="grid grid-cols-1 gap-4">
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/60 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${activity.safe ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
              <RiWalkLine />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lifestyle_Logic</span>
              <span className="text-sm font-black text-slate-900 leading-tight">{activity.status}</span>
              <span className="text-[9px] font-bold text-slate-500 mt-0.5">{activity.detail}</span>
            </div>
          </div>
        </motion.div>

        {/* 🧪 Health & Environment Probe - Normalized to White Glass */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white/60 backdrop-blur-xl p-5 rounded-[28px] border border-white/60 flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl text-cyan-600 shadow-inner">
               <RiHeartPulseLine />
             </div>
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment_Probe</span>
               <span className="text-sm font-black text-slate-900">
                 {humidity > 70 ? 'High Humidity Alert' : humidity < 30 ? 'Dry Atmosphere' : 'Stable Bio-Climate'}
               </span>
               <span className="text-[9px] font-bold text-slate-500">
                 {humidity > 70 ? 'Drink more water' : 'Optimal for respiratory health'}
               </span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
