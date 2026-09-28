'use client';

import React, { useState } from 'react';
import { audioEngine } from '@/engine/AudioEngine';

export const MusicModule: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAmbientSynth = () => {
    if (isPlaying) {
      audioEngine.stopAmbientPad();
      setIsPlaying(false);
    } else {
      audioEngine.startAmbientPad();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-pink-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎵 SPATIAL AUDIO & MUSIC SYNTH</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Procedural ambient synth pad generator & audio waveforms</p>
        </div>
        <span className="rounded bg-pink-950 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-700">
          WEB AUDIO API DSP
        </span>
      </div>

      <div className="rounded-xl glass-panel p-6 flex flex-col items-center justify-center gap-4 text-center border border-pink-500/30">
        <div className="text-4xl">🎶</div>
        <div>
          <h3 className="text-lg font-bold text-white">NEXUS ATMOSPHERIC SYNTH DRONE</h3>
          <p className="text-xs text-slate-400 mt-1">Dual oscillator (55Hz/110.5Hz) soft lowpass filtered drone</p>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="flex items-center gap-1.5 h-12 my-2">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 65, 35].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-gradient-to-t from-pink-500 to-cyan-400 transition-all ${
                isPlaying ? 'animate-pulse' : 'opacity-40'
              }`}
              style={{ height: isPlaying ? `${h}%` : '20%' }}
            />
          ))}
        </div>

        <button
          onClick={toggleAmbientSynth}
          className={`rounded-xl px-6 py-2.5 text-xs font-bold transition-all ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
          }`}
        >
          {isPlaying ? '⏸ PAUSE AMBIENT SYNTH' : '▶ PLAY AMBIENT SYNTH DRONE'}
        </button>
      </div>
    </div>
  );
};
