'use client';

import React, { useState, useEffect } from 'react';

export const WeatherParticles: React.FC<{ type: 'sunny' | 'rainy' }> = ({ type }) => {
  const [mounted, setMounted] = useState(false);
  const particles = Array.from({ length: 20 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map((_, i) => (
        <div 
          key={i}
          className={`particle ${type === 'rainy' ? 'rain-drop' : 'solar-particle'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};
