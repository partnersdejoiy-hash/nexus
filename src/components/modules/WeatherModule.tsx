'use client';

import React from 'react';
import { useNexusStore } from '@/stores/useNexusStore';

export const WeatherModule: React.FC = () => {
  const setEnvironment = useNexusStore((s) => s.setEnvironment);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-cyan-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🌤️ ATMOSPHERIC CONTROLS & WEATHER</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live weather telemetry & dynamic 3D room atmospheric morphing</p>
        </div>
        <span className="rounded bg-cyan-950 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-700">
          LOCATION: SAN FRANCISCO (18°C)
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Temperature</div>
          <div className="text-2xl font-bold text-white mt-1">18°C</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Feels like 17°C</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Humidity</div>
          <div className="text-2xl font-bold text-white mt-1">74%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Light volumetric mist</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Wind Velocity</div>
          <div className="text-2xl font-bold text-white mt-1">12 km/h</div>
          <div className="text-[10px] text-slate-400 mt-0.5">NW Vector</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Precipitation</div>
          <div className="text-2xl font-bold text-white mt-1">20%</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Rain particles enabled</div>
        </div>
      </div>

      {/* Atmospheric World Grade Override Trigger */}
      <div className="rounded-xl glass-panel p-4 flex flex-col gap-3">
        <h3 className="text-sm font-bold text-slate-200">MORPH 3D ATMOSPHERIC ROOM ENVIRONMENT</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setEnvironment('fog_chamber')}
            className="rounded-lg bg-slate-900 p-3 text-left hover:border-cyan-500 border border-slate-700 transition-all"
          >
            <div className="text-xs font-bold text-cyan-300">🌫️ FOG CHAMBER</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Maximum atmospheric bleed fog</div>
          </button>
          <button
            onClick={() => setEnvironment('open_water')}
            className="rounded-lg bg-slate-900 p-3 text-left hover:border-cyan-500 border border-slate-700 transition-all"
          >
            <div className="text-xs font-bold text-cyan-300">🌊 OPEN WATER</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Negative warmth blue hour</div>
          </button>
          <button
            onClick={() => setEnvironment('minimal_studio')}
            className="rounded-lg bg-slate-900 p-3 text-left hover:border-cyan-500 border border-slate-700 transition-all"
          >
            <div className="text-xs font-bold text-cyan-300">☀️ CLEAR STUDIO</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Clean high clarity lighting</div>
          </button>
        </div>
      </div>
    </div>
  );
};
