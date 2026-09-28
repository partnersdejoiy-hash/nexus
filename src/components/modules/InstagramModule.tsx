'use client';

import React, { useState } from 'react';

export const InstagramModule: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('IGAA_DEMO_TOKEN_784920');

  // Token Prefix Detection (Phase 5 requirement)
  const tokenType = tokenInput.startsWith('IGAA')
    ? 'Instagram Basic Display (graph.instagram.com /me)'
    : tokenInput.startsWith('EAA')
    ? 'Facebook Graph API (graph.facebook.com /business)'
    : 'Unknown Token Format';

  // Back-accumulated follower curve calculation from daily deltas (Phase 5 requirement)
  const currentTotalFollowers = 48250;
  const dailyDeltas = [+120, +240, +180, +310, +450, +290, +520]; // Last 7 days deltas

  // Back-accumulate historical running total curve
  const historicalCurve = React.useMemo(() => {
    let running = currentTotalFollowers;
    const curve = [running];
    for (let i = dailyDeltas.length - 1; i >= 0; i--) {
      running -= dailyDeltas[i];
      curve.unshift(running);
    }
    return curve;
  }, [currentTotalFollowers, dailyDeltas]);

  return (
    <div className="flex flex-col gap-6">
      {/* Module Header */}
      <div className="flex items-center justify-between border-b border-pink-900/40 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📷 INSTAGRAM TELEMETRY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live account growth, reel performance & AI trend insights</p>
        </div>
        <span className="rounded bg-pink-950 px-3 py-1 text-xs font-bold text-pink-400 border border-pink-700">
          TOKEN DETECTED: {tokenInput.substring(0, 4)}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Followers</div>
          <div className="text-2xl font-bold text-white mt-1">48,250</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">↑ +14.2% this week</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Weekly Reach</div>
          <div className="text-2xl font-bold text-white mt-1">214.8K</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">↑ +32.5% vs avg</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Avg Engagement</div>
          <div className="text-2xl font-bold text-white mt-1">6.8%</div>
          <div className="text-[10px] text-cyan-400 mt-0.5">Top 5% in category</div>
        </div>
        <div className="rounded-xl glass-panel p-4">
          <div className="text-[10px] text-slate-400 uppercase">Reels Plays</div>
          <div className="text-2xl font-bold text-white mt-1">890.4K</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">↑ +41% video reach</div>
        </div>
      </div>

      {/* Back-Accumulated Follower Historical Curve (Phase 5) */}
      <div className="rounded-xl glass-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-200">HISTORICAL FOLLOWER ACCUMULATION CURVE</h3>
          <span className="text-[10px] text-slate-400">Calculated from endpoint daily deltas</span>
        </div>
        <div className="h-40 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800 pb-2">
          {historicalCurve.map((val, idx) => {
            const heightPct = ((val - 45000) / (49000 - 45000)) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[9px] text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val.toLocaleString()}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-pink-600 to-cyan-400 rounded-t transition-all group-hover:brightness-125"
                  style={{ height: `${Math.max(15, heightPct)}%` }}
                />
                <span className="text-[9px] text-slate-500">Day -{7 - idx}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Token & Endpoint Diagnostics */}
      <div className="rounded-xl glass-panel p-4 flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-300">API Token & Endpoint Resolution</div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 rounded bg-slate-900 px-3 py-1.5 text-xs text-slate-200 border border-slate-700"
          />
          <span className="text-xs text-cyan-400 font-bold">{tokenType}</span>
        </div>
      </div>
    </div>
  );
};
