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
  RiNavigationLine,
  RiCloseLine
} from 'react-icons/ri';
const AQIMeter = dynamic(() => import('@/components/brain/AQIMeter').then(mod => mod.AQIMeter), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const ExtendedForecast = dynamic(() => import('@/components/brain/ExtendedForecast').then(mod => mod.ExtendedForecast), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const HourlyForecast = dynamic(() => import('@/components/timeline/HourlyForecast').then(mod => mod.HourlyForecast), {
  ssr: false,
  loading: () => <div className="h-32 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const ClimateAnalytics = dynamic(() => import('@/components/brain/ClimateAnalytics').then(mod => mod.ClimateAnalytics), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const TacticalMetrics = dynamic(() => import('@/components/brain/TacticalMetrics').then(mod => mod.TacticalMetrics), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const SolarPath = dynamic(() => import('@/components/brain/SolarPath').then(mod => mod.SolarPath), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const PressureGauge = dynamic(() => import('@/components/brain/PressureGauge').then(mod => mod.PressureGauge), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const WindCompass = dynamic(() => import('@/components/brain/WindCompass').then(mod => mod.WindCompass), {
  ssr: false,
  loading: () => <div className="h-48 w-full bg-slate-100 animate-pulse rounded-[28px]" />
});
const WeatherAtmosphere = dynamic(() => import('@/components/brain/WeatherAtmosphere').then(mod => mod.WeatherAtmosphere), {
  ssr: false
});
const AnimatedWeatherIcon = dynamic(() => import('@/components/brain/AnimatedWeatherIcon').then(mod => mod.AnimatedWeatherIcon), {
  ssr: false,
  loading: () => <div className="w-20 h-20 bg-slate-100 animate-pulse rounded-full" />
});



const InteractiveMap = dynamic(
  () => import('@/components/brain/InteractiveMap').then(mod => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-50 animate-pulse rounded-[28px]" /> }
);




const BentoCard = ({ title, icon: Icon, children, className, loading }: any) => (
  <motion.div
    whileHover={loading ? {} : { y: -4 }}
    className={`bg-white/75 backdrop-blur-2xl p-8 flex flex-col gap-6 rounded-[40px] border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.06)] ${className}`}
  >
    {title && (
      <div className="flex items-center gap-3 text-[#444746]">
        {Icon && <Icon className="text-2xl" />}
        <span className="text-sm font-bold uppercase tracking-[0.15em]">{title}</span>
      </div>
    )}
    {loading ? (
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded-full w-2/3 animate-pulse" />
        <div className="h-24 bg-slate-100 rounded-[24px] w-full animate-pulse" />
        <div className="flex gap-2">
          <div className="h-4 bg-slate-200 rounded-full w-1/4 animate-pulse" />
          <div className="h-4 bg-slate-200 rounded-full w-1/4 animate-pulse" />
        </div>
      </div>
    ) : children}
  </motion.div>
);

const MainSkeleton = () => (
  <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto py-10">
    <div className="h-10 w-48 bg-white/70 rounded-full animate-pulse border border-white/40 shadow-sm" />
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="h-28 w-64 bg-slate-200/50 rounded-3xl animate-pulse" />
      <div className="h-12 w-80 bg-white/50 rounded-full animate-pulse" />
      <div className="h-48 w-48 bg-blue-50/50 rounded-full animate-pulse blur-xl" />
    </div>
    <div className="w-full space-y-6">
      <div className="h-40 w-full bg-white/75 rounded-[40px] animate-pulse" />
      <div className="h-96 w-full bg-slate-900/10 rounded-[40px] animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-96 bg-white/75 rounded-[40px] animate-pulse" />
        <div className="h-40 bg-white/75 rounded-[40px] animate-pulse" />
        <div className="h-40 bg-white/75 rounded-[40px] animate-pulse" />
      </div>
    </div>
  </div>
);



export default function GoogleWeatherApp() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Start as true to prevent initial placeholder flicker

  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const fetchSuggestions = async (q: string) => {
    if (!q || q.length < 2) {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (city.trim().length >= 2) {
        fetchSuggestions(city);
      } else {
        setSuggestions([]);
      }
    }, 300); // Reduced debounce time for snappier feel
    return () => clearTimeout(timer);
  }, [city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSuggestions([]);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const selectSuggestion = (s: any) => {
    setCity(s.fullName);
    setSuggestions([]);
    fetchWeather('', s.lat, s.lon); // Fetch by exact coordinates
  };

  const fetchWeather = async (searchCity: string = city, lat?: number, lon?: number) => {
    // If absolutely nothing is provided, fallback to a default location
    const finalCity = searchCity || (lat === undefined ? 'Navi Mumbai' : '');

    if (!finalCity && (lat === undefined || lon === undefined)) {
      return;
    }

    setLoading(true);
    setError('');
    try {
      let url = `/api/agent?city=${encodeURIComponent(searchCity)}`;
      if (lat !== undefined && lon !== undefined) {
        url = `/api/agent?lat=${lat}&lon=${lon}`;
      }
      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          setWeather(data.data);
          setError('');
        } else {
          setError(data.error || 'Location not found.');
        }
      } else if (!res.ok) {
        const responseText = await res.text();
        throw new Error(`Server Error (${res.status}): ${responseText.slice(0, 50)}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Weather service temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    // 🌍 Immediate GPS Targeting
    const fetchFallbackLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city) {
          console.log("[IP-Geo] Fallback location acquired:", data.city);
          fetchWeather(data.city);
          return;
        }
      } catch (err) {
        console.warn("[IP-Geo] Fallback failed, using hardcoded default.");
      }
      fetchWeather('Navi Mumbai');
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("[GPS] Precision targeting acquired:", position.coords);
          fetchWeather('', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("[GPS] Location denied or failed, attempting IP-based fallback.");
          fetchFallbackLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout for better satellite lock
          maximumAge: 0   // Ensure fresh data
        }
      );

    } else {
      fetchFallbackLocation();
    }
  }, []);

  const theme = useMemo(() => {
    const condition = weather?.mainCondition?.toLowerCase() || 'clear';
    if (condition.includes('cloud')) return 'theme-cloudy';
    if (condition.includes('rain')) return 'theme-rainy';
    if (condition.includes('thunder')) return 'theme-thunder';
    return 'theme-sunny';
  }, [weather]);

  // Removed blocking mounted check to allow shell to render faster


  return (
    <main className="min-h-screen bg-[#f8f9fa] text-[#1f1f1f] font-sans selection:bg-[#0b57d0]/10 selection:text-[#0b57d0] overflow-x-hidden relative">
      {/* 🌌 Cosmic Background Layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-[#f0f4f9] to-[#e8f0fe] -z-20" />
      <div className="fixed inset-0 opacity-30 pointer-events-none -z-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

      {/* 🌪️ Live Weather Atmosphere */}
      <WeatherAtmosphere condition={weather?.mainCondition || 'clear'} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto pt-4 md:pt-6 px-4 md:px-0 space-y-6 relative z-10"
      >



        {/* 🔍 Google Style Search Bar */}
        <header className="flex flex-col md:flex-row items-center gap-4 w-full relative z-[100]">

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center flex-nowrap gap-2 bg-white/80 backdrop-blur-md px-3 md:px-6 py-3 rounded-full shadow-sm border border-[#f0f0f0] w-full relative"
          >
            <div className="relative">
              <RiSearchLine className="text-[#444746] text-lg md:text-xl shrink-0" />
              {geoLoading && (
                <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin scale-125" />
              )}
            </div>
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              placeholder="Search city"
              className="bg-transparent border-none outline-none flex-1 min-w-0 text-sm font-medium text-[#1f1f1f] placeholder:text-[#444746]"
            />
            {city && (
              <button
                onClick={() => {
                  setCity('');
                  setSuggestions([]);
                }}
                className="p-1 hover:bg-[#f0f4f9] rounded-full text-[#444746] transition-colors shrink-0"
                title="Clear Search"
              >
                <RiCloseLine className="text-xl" />
              </button>
            )}
            <div className="flex items-center gap-1 md:gap-2 w-auto justify-end shrink-0">
              <button
                onClick={() => {
                  if ("geolocation" in navigator) {
                    setGeoLoading(true);
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        fetchWeather('', position.coords.latitude, position.coords.longitude);
                        setGeoLoading(false);
                      },
                      (error) => {
                        console.warn("Geolocation denied.");
                        setGeoLoading(false);
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                      }
                    );

                  }
                }}
                className={`p-2 hover:bg-[#f0f4f9] rounded-full text-[#0b57d0] transition-all shrink-0 ${geoLoading ? 'animate-spin' : ''}`}
                title="Detect Current Location"
              >
                <RiNavigationLine className="text-xl" />
              </button>
              <div className="w-px h-6 bg-[#f0f0f0] hidden md:block" />
              <button
                onClick={() => fetchWeather()}
                className="ml-1 md:ml-2 h-10 w-10 md:w-auto md:px-6 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white rounded-full text-sm font-medium shadow-sm transition-all active:scale-95 whitespace-nowrap flex items-center justify-center md:justify-start gap-0 md:gap-2"
              >
                <RiSearchLine className="text-lg md:hidden" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-xl border border-[#f0f0f0] overflow-hidden z-[200]"
                >
                  {suggestions.map((s, i) => {
                    const matchIndex = s.name.toLowerCase().indexOf(city.toLowerCase());
                    const before = s.name.substring(0, matchIndex);
                    const match = s.name.substring(matchIndex, matchIndex + city.length);
                    const after = s.name.substring(matchIndex + city.length);

                    return (
                      <button
                        key={i}
                        onClick={() => selectSuggestion(s)}
                        className="w-full px-6 py-4 text-left hover:bg-[#f0f4f9] transition-all flex items-center gap-4 border-b border-[#f8f8f8] last:border-0 group"
                      >
                        <div className="p-3 bg-slate-50 rounded-full group-hover:bg-[#0b57d0] transition-all shadow-sm">
                          <RiMapPin2Line className="text-[#0b57d0] text-lg group-hover:text-white" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <div className="text-base tracking-tight text-slate-700 font-semibold truncate">
                            {matchIndex !== -1 ? (
                              <>
                                {before}
                                <span className="text-[#0b57d0] font-black">{match}</span>
                                {after}
                              </>
                            ) : (
                              <span className="text-slate-900 font-black">{s.name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {s.country && (
                              <span className="text-[10px] text-[#0b57d0] font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100/50">
                                {s.country}
                              </span>
                            )}
                            {s.state && (
                              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate">
                                {s.state}
                              </span>
                            )}
                            {!s.state && s.countryFull && (
                              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate">
                                {s.countryFull}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </header>

        {/* ⚠️ Error Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-100 p-4 rounded-[24px] flex items-center gap-3 text-red-600 shadow-sm"
            >
              <div className="p-2 bg-white rounded-full text-red-500 shadow-sm">
                <RiCloseLine className="text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider">Search Failure</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <MainSkeleton />
        ) : weather ? (
          <>
            <section className="flex flex-col items-center text-center py-6 md:py-10 relative">


              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-3 mb-6 px-8 py-3 bg-white/70 backdrop-blur-md rounded-full border border-white/40 shadow-md"
              >
                <RiMapPin2Line className="text-[#0b57d0] text-lg" />
                <h1 className="text-lg font-black text-[#1f1f1f] tracking-tight">{weather?.location || city}</h1>
              </motion.div>

              <div className="flex flex-col items-center relative">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-[80px] md:text-[110px] font-black tracking-tighter leading-none text-[#1f1f1f] mb-4 flex items-start -ml-4 drop-shadow-xl"
                >
                  {weather?.temp || '--'}<span className="text-4xl md:text-5xl mt-4 md:mt-6 font-bold text-[#0b57d0]">°</span>
                </motion.div>
                <div className="flex flex-col items-center gap-2 mb-6 md:mb-8">
                  <span className="text-4xl font-black text-[#1f1f1f] capitalize tracking-tighter">{weather?.description}</span>
                  <p className="text-lg font-bold text-[#5f6368] bg-white/50 px-6 py-2 rounded-full border border-white/30 shadow-sm">
                    H:{weather?.tempMax}° L:{weather?.tempMin}° • Feels like {weather?.feelsLike}°
                  </p>
                </div>
                <div className="relative group scale-100 md:scale-110">
                  <div className="absolute inset-0 bg-[#0b57d0]/20 blur-[80px] rounded-full group-hover:bg-[#0b57d0]/30 transition-all" />
                  <AnimatedWeatherIcon condition={weather?.mainCondition} className="w-40 h-40 md:w-48 md:h-48 relative z-10" />
                </div>
              </div>
            </section>

            {/* 📊 Hourly Forecast (Horizontal Scroll) */}
            <BentoCard className="overflow-hidden">
              <div className="flex items-center gap-2 text-[#444746] mb-4">
                <RiDashboardLine className="text-lg" />
                <span className="text-xs font-medium uppercase tracking-wider">Hourly forecast</span>
              </div>
              <HourlyForecast items={weather?.hourly} timezone={weather?.timezone} />
            </BentoCard>

            {/* 🛰️ Satellite Surveillance Map - Primary Tactical View */}
            <div id="weather-map" className="-mx-4 md:mx-0 mb-6 scroll-mt-24">
              <div className="bg-slate-900 md:rounded-[40px] overflow-hidden border-y md:border border-white/10 shadow-2xl relative h-[450px] md:h-[500px]">
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-1 pointer-events-none">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Satellite_Live</span>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight drop-shadow-lg">Surveillance Radar</h3>
                </div>
                <InteractiveMap
                  lat={weather?.lat}
                  lon={weather?.lon}
                  city={weather?.location}
                />
              </div>
            </div>

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

              <TacticalMetrics weather={weather} />

              {/* Wind Orientation Compass - Full Width Tactical View */}
              <BentoCard title="Wind Orientation" icon={RiCompass3Line} className="md:col-span-2">
                <WindCompass deg={weather?.windDeg} speed={weather?.windSpeed} />
              </BentoCard>
            </div>

            <div id="solar-telemetry" className="grid grid-cols-1 gap-4 scroll-mt-24">
              <BentoCard title="Sunrise & Sunset" icon={RiSunLine} className="md:col-span-1">
                <SolarPath
                  sunrise={weather?.sunrise}
                  sunset={weather?.sunset}
                  rawSunrise={weather?.rawSunrise}
                  rawSunset={weather?.rawSunset}
                  dt={weather?.dt}
                  timezone={weather?.timezone}
                />
              </BentoCard>

              <BentoCard title="Climate Analytics" icon={RiCompass3Line}>
                <ClimateAnalytics
                  currentTemp={weather?.temp}
                  feelsLike={weather?.feelsLike}
                  humidity={weather?.humidity}
                  condition={weather?.description || weather?.mainCondition}
                />
              </BentoCard>

              <BentoCard title="Barometric Pressure" icon={RiDashboardLine}>
                <PressureGauge pressure={weather?.pressure} />
              </BentoCard>
            </div>
          </>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-[#5f6368] font-bold">Please search for a location to view weather data.</p>
          </div>
        ) : null}

      </motion.div>

      <footer className="w-full py-8 border-t border-slate-200/50 relative z-20 mt-12 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm font-black text-slate-900 tracking-tight">
              Weather App Developed by <span className="bg-gradient-to-r from-[#0b57d0] to-[#0842a0] bg-clip-text text-transparent">Akshay Chaudhari</span>
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Tactical Intelligence • © 2026
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-[#0b57d0] group"
              title="Return to Dashboard"
            >
              <RiDashboardLine className="text-xl group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('weather-map')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-[#0b57d0] group"
              title="Open Satellite Surveillance"
            >
              <RiCompass3Line className="text-xl group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('solar-telemetry')?.scrollIntoView({ behavior: 'smooth' })}
              className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-[#0b57d0] group"
              title="Solar Status"
            >
              <RiSunLine className="text-xl group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
