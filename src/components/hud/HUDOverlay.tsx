'use client';

import React, { useEffect, useState } from 'react';
import { useNexusStore } from '@/stores/useNexusStore';
import { useGestureStore } from '@/stores/useGestureStore';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useAIStore } from '@/stores/useAIStore';
import { ENVIRONMENTS, EnvironmentId } from '@/constants/environments';
import { masterClock } from '@/engine/MasterClock';

export const HUDOverlay: React.FC = () => {
  const isHudVisible = useNexusStore((s) => s.isHudVisible);
  const isLocked = useNexusStore((s) => s.isLocked);
  const toggleMotionLock = useNexusStore((s) => s.toggleMotionLock);
  const currentEnvironment = useNexusStore((s) => s.currentEnvironment);
  const setEnvironment = useNexusStore((s) => s.setEnvironment);
  const formMode = useNexusStore((s) => s.formMode);
  const logs = useNexusStore((s) => s.logs);
  const isDesktopBridgeConnected = useNexusStore((s) => s.isDesktopBridgeConnected);

  const activeGesture = useGestureStore((s) => s.activeGesture);
  const gestureConfidence = useGestureStore((s) => s.gestureConfidence);
  const trackingFps = useGestureStore((s) => s.trackingFps);
  const isTrackingActive = useGestureStore((s) => s.isTrackingActive);

  const fps = usePerformanceStore((s) => s.fps);
  const qualityTier = usePerformanceStore((s) => s.qualityTier);
  const gpuInfo = usePerformanceStore((s) => s.gpuInfo);

  const isWakeActive = useAIStore((s) => s.isWakeActive);
  const setWakeActive = useAIStore((s) => s.setWakeActive);

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isHudVisible) return null;

  const handleTransformToggle = () => {
    const targetMode = formMode === 'SPATIAL' ? 'HUMAN' : 'SPATIAL';
    masterClock.triggerHumanFormTransform(targetMode);
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-6 select-none font-mono text-xs text-slate-300">
      {/* TOP BAR */}
      <div className="flex items-start justify-between">
        {/* TOP LEFT: System Telemetry */}
        <div className="pointer-events-auto flex flex-col gap-1.5 rounded-lg glass-panel p-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
            </span>
            <span className="font-bold text-white tracking-widest">NEXUS OS 1.0</span>
            <span className="rounded bg-cyan-950/80 px-1.5 py-0.5 text-[10px] text-cyan-400 border border-cyan-800">
              {formMode}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
            <span>FPS: <strong className="text-cyan-300">{fps}</strong></span>
            <span>TIER: <strong className="text-cyan-300">{qualityTier.toUpperCase()}</strong></span>
            <span>GPU: <strong className="text-slate-300">{gpuInfo}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span>TRACKING:</span>
            <span className={isTrackingActive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {isTrackingActive ? `ACTIVE (${trackingFps} FPS)` : 'MOUSE FALLBACK'}
            </span>
            <span className="mx-1">•</span>
            <span>DESKTOP BRIDGE:</span>
            <span className={isDesktopBridgeConnected ? 'text-emerald-400' : 'text-slate-500'}>
              {isDesktopBridgeConnected ? 'ONLINE' : 'STANDALONE'}
            </span>
          </div>
        </div>

        {/* TOP RIGHT: Clock, Environment & Motion Lock */}
        <div className="pointer-events-auto flex flex-col items-end gap-2">
          {/* Time & Date */}
          <div className="rounded-lg glass-panel px-4 py-2 text-right">
            <div className="text-lg font-bold tracking-wider text-white">{timeStr}</div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest">{dateStr}</div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-2">
            {/* Motion Lock Switch */}
            <button
              onClick={toggleMotionLock}
              className={`rounded border px-2.5 py-1 text-[11px] font-bold transition-all ${
                isLocked
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300 shadow-sm'
                  : 'border-cyan-500/50 bg-cyan-950/60 text-cyan-300'
              }`}
            >
              {isLocked ? '🔒 LOCKED (ZERO DRIFT)' : '🌊 DRIFT ACTIVE'}
            </button>

            {/* Transform Human Form Button */}
            <button
              onClick={handleTransformToggle}
              className="rounded border border-purple-500/50 bg-purple-950/60 px-2.5 py-1 text-[11px] font-bold text-purple-300 hover:bg-purple-900/80 transition-all"
            >
              {formMode === 'SPATIAL' ? '🤖 TRANSFORM HUMAN' : '🌌 SPATIAL ORBIT'}
            </button>

            {/* AI Wake Button */}
            <button
              onClick={() => setWakeActive(!isWakeActive)}
              className={`rounded border px-2.5 py-1 text-[11px] font-bold transition-all ${
                isWakeActive
                  ? 'border-amber-500 bg-amber-950 text-amber-300 animate-pulse'
                  : 'border-cyan-500/50 bg-slate-900 text-cyan-400'
              }`}
            >
              {isWakeActive ? '🎙️ LISTENING...' : '🎙️ WAKE NEXUS'}
            </button>
          </div>

          {/* Environment Switcher */}
          <div className="flex items-center gap-1.5 rounded-lg glass-panel p-1.5">
            <span className="text-[10px] text-slate-400 mr-1">GRADE:</span>
            {(Object.keys(ENVIRONMENTS) as EnvironmentId[]).map((envId) => (
              <button
                key={envId}
                onClick={() => setEnvironment(envId)}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  currentEnvironment === envId
                    ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ENVIRONMENTS[envId].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex items-end justify-between">
        {/* BOTTOM LEFT: System Log Feed */}
        <div className="pointer-events-auto max-h-36 w-80 overflow-y-auto rounded-lg glass-panel p-3 text-[10px]">
          <div className="mb-1 font-bold text-slate-400 uppercase tracking-wider border-b border-cyan-900/50 pb-1">
            KERNEL LOG FEED
          </div>
          <div className="flex flex-col gap-1">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="flex items-start gap-1.5 leading-tight">
                <span className="text-slate-500">{log.timestamp}</span>
                <span
                  className={
                    log.level === 'warn' || log.level === 'error'
                      ? 'text-amber-400 font-bold'
                      : 'text-cyan-400'
                  }
                >
                  [{log.source}]
                </span>
                <span className="text-slate-300 truncate">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM RIGHT: Gesture Feedback */}
        <div className="pointer-events-auto rounded-lg glass-panel p-3.5 text-right">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">GESTURE ENGINE</div>
          <div className="text-sm font-bold text-cyan-300 mt-0.5">
            {activeGesture !== 'NONE' ? activeGesture : 'WAITING FOR GESTURE...'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            CONFIDENCE: <span className="text-emerald-400 font-bold">{(gestureConfidence * 100).toFixed(0)}%</span>
          </div>
          <div className="text-[9px] text-slate-500 mt-1">
            [ ⌘K ] Launcher • [ Key Arrows ] Orbit Rotate
          </div>
        </div>
      </div>
    </div>
  );
};
