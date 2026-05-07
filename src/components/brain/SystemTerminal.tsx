'use client';

import React, { useEffect, useRef, useState } from 'react';

export const SystemTerminal: React.FC<{ logs: string[] }> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!mounted) return null;

  return (
    <div className="bg-black/80 backdrop-blur-md border border-white/5 rounded-xl p-4 font-mono text-[10px] h-32 overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-red-500/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-full" />
          <div className="w-1.5 h-1.5 bg-green-500/50 rounded-full" />
        </div>
        <span className="text-slate-500 uppercase tracking-tighter opacity-50">System_Kernel_Log</span>
      </div>
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-1"
      >
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-cyan-500/50">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className="text-slate-300">{log}</span>
          </div>
        ))}
        <div className="text-cyan-400 animate-pulse">_</div>
      </div>
    </div>
  );
};
