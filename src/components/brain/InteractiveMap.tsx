'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: L.LatLngExpression }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom(), {
      animate: true,
      duration: 1.5
    });
  }, [center, map]);
  return null;
}

export const InteractiveMap: React.FC<{ lat: number; lon: number; city: string }> = ({ lat, lon, city }) => {
  if (typeof window === 'undefined') return null;

  const center: L.LatLngExpression = [lat || 19.033, lon || 73.0297];

  return (
    <div className="w-full h-full  overflow-hidden border border-white/10 relative group shadow-[0_0_100px_rgba(0,0,0,0.5)]">
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
        zoomControl={false}
      >
        <ChangeView center={center} />
        {/* Google Satellite Hybrid Tiles - High Reliability */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          attribution='&copy; Google Maps'
        />
        <Marker position={[lat || 19.033, lon || 73.0297]}>
          <Popup>
            <span className="font-mono text-[10px]">{city} Monitoring Node</span>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Cinematic HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1000] overflow-hidden">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.8)] z-20"
        />

        {/* Circular Radar Sweep */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] opacity-20">
           <motion.div 
             className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.3)_360deg)] rounded-full"
             animate={{ rotate: 360 }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
           />
        </div>
        
        {/* Corner Brackets */}
        <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
        <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
        <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
        <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-2xl" />
      </div>

      <div className="absolute bottom-10 left-10 z-[1001]">
        <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] shadow-2xl">
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">Geolocation Node</div>
          <div className="text-lg font-black text-white tracking-tighter uppercase leading-none mb-4">
             {city} <span className="text-cyan-500 opacity-30">/ IN</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-cyan-400/70 border-t border-white/5 pt-4">
            <span>{lat?.toFixed(4)}°N</span>
            <span className="w-1 h-1 bg-white/10 rounded-full" />
            <span>{lon?.toFixed(4)}°E</span>
          </div>
        </div>
      </div>
    </div>
  );
};
