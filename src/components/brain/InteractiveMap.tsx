'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Child component to update map view safely
const ChangeView = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  React.useEffect(() => {
    if (map) {
      try {
        map.setView(center, map.getZoom(), { animate: true });
      } catch (err) {
        console.warn("Leaflet View update deferred:", err);
      }
    }
  }, [center, map]);
  return null;
};

export const InteractiveMap: React.FC<{ lat: number; lon: number; city: string }> = ({ lat, lon, city }) => {
  const [mounted, setMounted] = React.useState(false);
  const [activeLayer, setActiveLayer] = React.useState<string | null>(null);
  const [opacity, setOpacity] = React.useState(0.6);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Unique key to prevent container reuse issues
  const mapKey = React.useMemo(() => `map-${lat}-${lon}`, [lat, lon]);

  if (!mounted) return <div className="w-full h-full bg-[#0a0a0a] animate-pulse" />;

  const center: L.LatLngExpression = [lat || 19.033, lon || 73.0297];

  return (
    <div className="w-full h-full overflow-hidden border border-white/10 relative group shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
      <MapContainer
        key={mapKey}
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
        scrollWheelZoom={false}
      >
        <ChangeView center={center} />
        {/* Google Satellite Hybrid Tiles */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='&copy; Google Maps'
        />
        {activeLayer && (
          <TileLayer
            key={`${activeLayer}-${opacity}`}
            url={`/api/map/${activeLayer}/{z}/{x}/{y}`}
            opacity={opacity}
          />
        )}
        <Marker position={center}>
          <Popup>
            <div className="p-2 min-w-[120px]">
              <div className="text-[10px] font-black uppercase text-slate-500 mb-1">Target_Loc</div>
              <div className="text-xs font-bold text-slate-900">{city}</div>
              <div className="text-[8px] font-mono text-cyan-600 mt-2">LAT: {lat?.toFixed(4) || '0.0000'} LON: {lon?.toFixed(4) || '0.0000'}</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1000] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />
        
        {/* Scanning Line */}
        <motion.div
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.5)] z-20"
        />

        {/* Circular Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] opacity-10">
          <motion.div
            className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.2)_360deg)] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Tactical Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="w-1 h-px bg-cyan-500/60" />
          <div className="w-px h-1 bg-cyan-500/60" />
        </div>
      </div>

      {/* Interactive HUD Controls */}
      <div className="absolute top-8 left-8 z-[1001] flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-1 ml-1">Overlay_Matrix</div>
          <div className="flex flex-col gap-1.5">
            {[
              { id: null, label: 'Visual Spectrum', color: 'bg-slate-400' },
              { id: 'clouds', label: 'Cloud Density', color: 'bg-blue-300' },
              { id: 'precipitation', label: 'Precipitation', color: 'bg-cyan-400' },
              { id: 'temp', label: 'Thermal Map', color: 'bg-orange-400' },
              { id: 'wind', label: 'Wind Velocity', color: 'bg-emerald-400' },
            ].map((layer) => (
              <button
                key={layer.id || 'none'}
                onClick={() => setActiveLayer(layer.id)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all backdrop-blur-xl border ${activeLayer === layer.id
                  ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-105 z-10'
                  : 'bg-black/30 text-white/50 border-white/5 hover:bg-black/50 hover:text-white hover:border-white/20'
                  } flex items-center gap-3`}
              >
                <div className={`w-2 h-2 rounded-full ${layer.color} ${activeLayer === layer.id ? 'animate-ping' : 'opacity-40'}`} />
                {layer.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Intensity Controller */}
      <AnimatePresence>
        {activeLayer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-8 z-[1001] bg-black/50 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl min-w-[200px]"
          >
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.1em] text-white/50 mb-3">
              <span>Intensity_Sync</span>
              <span className="text-cyan-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Telemetry Legend */}
      <AnimatePresence>
        {activeLayer && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-8 right-8 z-[1001] bg-black/70 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl min-w-[180px]"
          >
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/60 mb-4 flex items-center gap-2">
              <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              Sensor_Readout
            </div>
            <div className="flex flex-col gap-3">
              {activeLayer === 'temp' && (
                <>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> Critical Heat</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-orange-400 rounded-sm shadow-[0_0_8px_rgba(251,146,60,0.5)]" /> Optimal Range</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> Thermal Floor</div>
                </>
              )}
              {activeLayer === 'precipitation' && (
                <>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-purple-600 rounded-sm shadow-[0_0_8px_rgba(147,51,234,0.5)]" /> High Density</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-cyan-500 rounded-sm shadow-[0_0_8px_rgba(6,182,212,0.5)]" /> Light Scatter</div>
                </>
              )}
              {activeLayer === 'clouds' && (
                <>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-white/80 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.3)]" /> Cumulus Base</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-white/20 rounded-sm" /> Clear Vista</div>
                </>
              )}
              {activeLayer === 'wind' && (
                <>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-emerald-600 rounded-sm shadow-[0_0_8px_rgba(5,150,105,0.5)]" /> High Velocity</div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-white/90"><div className="w-3 h-3 bg-emerald-300 rounded-sm shadow-[0_0_8px_rgba(110,231,183,0.5)]" /> Surface Air</div>
                </>
              )}
            </div>
            <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-cyan-400/40 tracking-tighter">
              <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full" /> LIVE</span>
              <span>UTC+{new Date().getTimezoneOffset() / -60}:00</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
