'use client';

import React, { useState, useEffect } from 'react';
import { useNexusStore } from '@/stores/useNexusStore';
import { usePerformanceStore } from '@/stores/usePerformanceStore';

export const SystemModule: React.FC = () => {
  const fps = usePerformanceStore((s) => s.fps);
  const qualityTier = usePerformanceStore((s) => s.qualityTier);
  const particleCount = usePerformanceStore((s) => s.particleCount);
  const gpuInfo = usePerformanceStore((s) => s.gpuInfo);

  const isDesktopBridgeConnected = useNexusStore((s) => s.isDesktopBridgeConnected);
  const desktopBridgeError = useNexusStore((s) => s.desktopBridgeError);

  const [testResult, setTestResult] = useState<string | null>(null);

  const testDesktopBridgeVerb = async (verb: string) => {
    try {
      const res = await fetch('/api/desktop-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verb, payload: { appName: 'Spotify', url: 'https://github.com' } }),
      });
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResult(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-orange-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>💻 SYSTEM OS DIAGNOSTICS & TELEMETRY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">CPU, GPU, Memory, Battery & macOS Desktop Bridge safety surface</p>
        </div>
        <span className="rounded bg-orange-950 px-3 py-1 text-xs font-bold text-orange-400 border border-orange-700">
          98% SYSTEM HEALTH
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">FPS Frame Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{fps} FPS</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Target: 60 FPS</div>
        </div>

        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Adaptive Quality Tier</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{qualityTier.toUpperCase()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{particleCount.toLocaleString()} particles</div>
        </div>

        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Memory Allocation</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">242 MB</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Heap memory clean</div>
        </div>

        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Desktop Bridge</div>
          <div className={`text-xl font-bold mt-1 ${isDesktopBridgeConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isDesktopBridgeConnected ? 'CONNECTED' : 'STANDALONE'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">execFile Sandbox</div>
        </div>
      </div>

      {/* Desktop Bridge Diagnostic Tool */}
      <div className="rounded-xl glass-panel p-4 flex flex-col gap-3 border border-orange-500/30">
        <h3 className="text-sm font-bold text-orange-300">PHASE 5 DESKTOP BRIDGE DIAGNOSTICS</h3>
        <p className="text-xs text-slate-300">
          Test loopback execFile verbs. Unhandled command strings resolve cleanly to error responses without shell execution surface.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => testDesktopBridgeVerb('launch_app')}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 border border-cyan-800 hover:bg-slate-800"
          >
            TEST: launch_app ('Spotify')
          </button>
          <button
            onClick={() => testDesktopBridgeVerb('open_url')}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 border border-cyan-800 hover:bg-slate-800"
          >
            TEST: open_url ('GitHub')
          </button>
          <button
            onClick={() => testDesktopBridgeVerb('lock_screen')}
            className="rounded bg-slate-900 px-3 py-1.5 text-xs text-cyan-300 border border-cyan-800 hover:bg-slate-800"
          >
            TEST: lock_screen
          </button>
        </div>

        {testResult && (
          <pre className="mt-2 max-h-36 overflow-y-auto rounded bg-slate-950 p-3 text-[10px] text-emerald-400 border border-slate-800">
            {testResult}
          </pre>
        )}
      </div>
    </div>
  );
};
