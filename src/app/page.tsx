'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiSearchLine,
  RiMapPin2Line,
  RiWindyLine,
  RiWaterPercentLine,
  RiSunLine,
  RiMoonLine,
  RiCompass3Line,
  RiSunFoggyLine,
  RiDropLine,
  RiDashboardLine,
  RiMenuLine,
  RiMore2Line,
  RiSettings4Line,
  RiNavigationLine
} from 'react-icons/ri';
import { AQIMeter } from '@/components/brain/AQIMeter';
import { ExtendedForecast } from '@/components/brain/ExtendedForecast';
import { HourlyForecast } from '@/components/timeline/HourlyForecast';

const InteractiveMap = dynamic(
  () => import('@/components/brain/InteractiveMap').then(mod => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-50 animate-pulse rounded-[28px]" /> }
);

const BentoCard = ({ title, icon: Icon, children, className }: any) => (
  <div className={`google-bento p-6 flex flex-col gap-4 ${className}`}>
    {title && (
      <div className="flex items-center gap-2 text-[#444746]">
        <Icon className="text-lg" />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
    )}
    {children}
  </div>
);

const WeatherAtmosphere = ({ condition }: { condition: string }) => {
  const c = condition?.toLowerCase() || 'clear';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 🌧️ Rain Animation */}
      {c.includes('rain') && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: '110vh', opacity: [0, 0.5, 0] }}
              transition={{
                duration: 1 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="absolute w-[1px] h-12 bg-blue-400/30"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      {/* ☁️ Cloud Animation */}
      {c.includes('cloud') && (
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: '110vw', opacity: [0, 0.2, 0] }}
              transition={{
                duration: 20 + Math.random() * 40,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "linear"
              }}
              className="absolute w-96 h-96 bg-white/20 blur-[100px] rounded-full"
              style={{ top: `${Math.random() * 60}%` }}
            />
          ))}
        </div>
      )}

      {/* ☀️ Solar Glow */}
      {(c.includes('clear') || c.includes('sun')) && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full"
        />
      )}

      {/* ⚡ Thunder Flash */}
      {(c.includes('storm') || c.includes('thunder')) && (
        <motion.div
          animate={{ opacity: [0, 0, 0.3, 0, 0.5, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
          className="absolute inset-0 bg-white"
        />
      )}
    </div>
  );
};

export default function GoogleWeatherApp() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('Navi Mumbai');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  const fetchSuggestions = async (q: string) => {
    if (!q || q.length < 3) {
      setSuggestions([]);
      return;
    }
    setGeoLoading(true);
    try {
      const res = await fetch(`/api/geo?q=${encodeURIComponent(q)}`);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        setSuggestions([]);
        return;
      }
      const data = await res.json();
      if (data.success) setSuggestions(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeoLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCity(val);
    fetchSuggestions(val);
  };

  const selectSuggestion = (fullName: string) => {
    setCity(fullName);
    setSuggestions([]);
    fetchWeather(fullName);
  };

  const fetchWeather = async (searchCity: string = city, lat?: number, lon?: number) => {
    setLoading(true);
    setError('');
    try {
      let url = `/api/agent?city=${encodeURIComponent(searchCity)}`;
      if (lat !== undefined && lon !== undefined) {
        url = `/api/agent?lat=${lat}&lon=${lon}`;
      }
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        const responseText = await res.text();
        throw new Error(`API returned non-JSON response (${res.status}): ${responseText.slice(0, 120)}`);
      }
      const data = await res.json();
      if (data.success) {
        console.log("Fetched Data for:", data.data.location, data.data.lat, data.data.lon);
        setWeather(data.data);
      } else {
        setError(data.error || 'Unable to fetch weather data.');
      }
    } catch (err) {
      console.error(err);
      setError('Weather service temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(city, position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied, using default.");
          fetchWeather();
        }
      );
    } else {
      fetchWeather();
    }
  }, []);

  const theme = useMemo(() => {
    const condition = weather?.mainCondition?.toLowerCase() || 'clear';
    if (condition.includes('cloud')) return 'theme-cloudy';
    if (condition.includes('rain')) return 'theme-rainy';
    if (condition.includes('thunder')) return 'theme-thunder';
    return 'theme-sunny';
  }, [weather]);

  if (!mounted) return null;

  return (
    <main className={`min-h-screen ${theme} transition-colors duration-1000 pb-10 px-4 md:px-8 relative overflow-hidden`}>
      {/* 🌪️ Atmospheric Layer */}
      <WeatherAtmosphere condition={weather?.mainCondition} />

      <div className="max-w-4xl mx-auto pt-6 space-y-6 relative z-10">

        {/* 🔍 Google Style Search Bar */}
        <header className="flex flex-col md:flex-row items-center gap-4 w-full relative">
          <div className="flex-1 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-[#f0f0f0] w-full relative">
            <div className="relative">
              <RiSearchLine className="text-[#444746] text-xl" />
              {geoLoading && (
                <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin scale-125" />
              )}
            </div>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Search city"
              className="bg-transparent border-none outline-none flex-1 text-sm font-medium text-[#1f1f1f] placeholder:text-[#444746]"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => fetchWeather(city, position.coords.latitude, position.coords.longitude),
                      (error) => console.warn("Geolocation denied.")
                    );
                  }
                }}
                className="p-2 hover:bg-[#f0f4f9] rounded-full text-[#0b57d0] transition-colors"
                title="Detect Current Location"
              >
                <RiNavigationLine className="text-xl" />
              </button>
              <div className="w-px h-6 bg-[#f0f0f0]" />
              <button
                onClick={() => fetchWeather()}
                className="ml-2 px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full text-sm font-medium shadow-sm transition-all active:scale-95"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-xl border border-[#f0f0f0] overflow-hidden z-[200]"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => selectSuggestion(s.fullName)}
                      className="w-full px-6 py-4 text-left hover:bg-[#f0f4f9] transition-all flex items-center gap-4 border-b border-[#f8f8f8] last:border-0 group"
                    >
                      <div className="p-3 bg-slate-50 rounded-full group-hover:bg-white transition-colors shadow-sm">
                        <RiMapPin2Line className="text-[#0b57d0] text-lg" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1f1f1f] text-base tracking-tight">{s.name}</span>
                        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">
                          {s.state ? `${s.state}, ` : ''}{s.country}
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-3 rounded-full shadow-sm border border-[#f0f0f0]">
            <RiMapPin2Line className="text-[#0b57d0] text-xl" />
            <div className="w-px h-6 bg-[#f0f0f0]" />
            <RiMenuLine className="text-[#444746] text-xl" />
          </div>
        </header>

        {/* 📍 Location & Current Weather Hero */}
        <section className="flex flex-col items-center text-center py-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <h1 className="text-2xl font-medium text-[#1f1f1f]">{weather?.location || city}</h1>
            <p className="text-sm text-[#444746]">
              {mounted && new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-[100px] font-medium leading-none google-temp mb-4 flex items-start">
              {weather?.temp || '--'}<span className="text-4xl mt-4">°</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/weather_icon.png" className="w-16 h-16 object-contain" alt="" />
              <span className="text-xl font-medium text-[#1f1f1f] capitalize">{weather?.description}</span>
            </div>
            <p className="text-sm font-medium text-[#444746]">
              H:{weather?.tempMax}° L:{weather?.tempMin}° • Feels like {weather?.feelsLike}°
            </p>
          </div>
        </section>

        {/* 📊 Hourly Forecast (Horizontal Scroll) */}
        <BentoCard className="overflow-hidden">
          <div className="flex items-center gap-2 text-[#444746] mb-4">
            <RiDashboardLine className="text-lg" />
            <span className="text-xs font-medium uppercase tracking-wider">Hourly forecast</span>
          </div>
          <HourlyForecast temp={weather?.temp} />
        </BentoCard>

        {/* 🛰️ Satellite Map Focus: Now a primary focal point */}
        <BentoCard title="Satellite Surveillance Map" icon={RiMapPin2Line} className="h-[450px] shadow-md border-blue-100">
          <div className="h-full rounded-2xl overflow-hidden relative group">
            <InteractiveMap
              key={weather?.location}
              lat={weather?.lat}
              lon={weather?.lon}
              city={weather?.location}
            />
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-blue-50 shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Neural_Link: Active
            </div>
          </div>
        </BentoCard>

        {/* 🍱 Bento Grid Layout (Mobile Optimized) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* 10-Day Forecast */}
          <BentoCard className="md:row-span-2">
            <ExtendedForecast days={weather?.forecast} />
          </BentoCard>

          {/* AQI Meter */}
          <BentoCard title="AQI" icon={RiDashboardLine}>
            <AQIMeter aqi={weather?.aqi || 1} />
          </BentoCard>

          {/* Metrics Grid (2x2 inside) */}
          <div className="grid grid-cols-2 gap-4">
            <BentoCard title="Wind" icon={RiWindyLine}>
              <div className="text-2xl font-medium">{weather?.windSpeed} <span className="text-sm font-normal text-[#444746]">km/h</span></div>
              <div className="text-xs text-[#444746]">Wind direction: {weather?.windDeg}°</div>
            </BentoCard>
            <BentoCard title="Humidity" icon={RiWaterPercentLine}>
              <div className="text-2xl font-medium">{weather?.humidity}%</div>
              <div className="text-xs text-[#444746]">Dew point: 12°</div>
            </BentoCard>
            <BentoCard title="UV Index" icon={RiSunFoggyLine}>
              <div className="text-2xl font-medium">4.5</div>
              <div className="text-xs text-[#444746]">Moderate</div>
            </BentoCard>
            <BentoCard title="Visibility" icon={RiCompass3Line}>
              <div className="text-2xl font-medium">{weather?.visibility} <span className="text-sm font-normal text-[#444746]">km</span></div>
              <div className="text-xs text-[#444746]">Clear sky</div>
            </BentoCard>
          </div>
        </div>

        {/* 🗺️ Map & Solar */}
        <div className="grid grid-cols-1 gap-4">
          <BentoCard title="Sunrise & Sunset" icon={RiSunLine}>
            <div className="flex justify-between items-center px-4 py-8">
              <div className="text-center flex-1">
                <RiSunLine className="text-4xl text-orange-400 mb-2 mx-auto" />
                <div className="text-2xl font-medium">{weather?.sunrise}</div>
                <div className="text-[10px] text-[#444746] uppercase tracking-widest font-bold">Sunrise</div>
              </div>
              <div className="w-px h-16 bg-[#f0f0f0]" />
              <div className="text-center flex-1">
                <RiMoonLine className="text-4xl text-blue-400 mb-2 mx-auto" />
                <div className="text-2xl font-medium">{weather?.sunset}</div>
                <div className="text-[10px] text-[#444746] uppercase tracking-widest font-bold">Sunset</div>
              </div>
            </div>
          </BentoCard>

          <BentoCard title="Pressure" icon={RiCompass3Line}>
            <div className="text-2xl font-medium">{weather?.pressure} <span className="text-sm font-normal text-[#444746]">hPa</span></div>
            <div className="text-xs text-[#444746]">Atmospheric stability: Clear</div>
          </BentoCard>
        </div>

        <footer className="pt-10 pb-6 flex flex-col items-center gap-4 border-t border-[#f0f0f0] opacity-50">
          <p className="text-xs font-medium text-[#444746]">Data from OpenWeather • v4.8</p>
          <div className="flex gap-4">
            <RiSettings4Line className="text-xl" />
            <RiMore2Line className="text-xl" />
          </div>
        </footer>
      </div>
    </main>
  );
}
