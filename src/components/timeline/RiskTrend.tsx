'use client';

import React from 'react';

export const RiskTrend: React.FC<{ data: number[] }> = ({ data }) => {
  const max = Math.max(...data, 100);
  
  return (
    <div className="flex items-end gap-1 h-12 w-full px-1">
      {data.map((val, i) => (
        <div 
          key={i}
          className="flex-1 bg-cyan-500/20 rounded-t-[1px] transition-all hover:bg-cyan-400/50"
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
};
