'use client';

import React from 'react';

const GAMES = [
  { teamA: 'Real Madrid', teamB: 'FC Barcelona', scoreA: 3, scoreB: 2, status: 'FINAL', league: 'La Liga' },
  { teamA: 'Golden State Warriors', teamB: 'LA Lakers', scoreA: 112, scoreB: 108, status: 'Q4 2:15', league: 'NBA' },
  { teamA: 'Arsenal FC', teamB: 'Manchester City', scoreA: 1, scoreB: 1, status: 'HALF TIME', league: 'Premier League' },
];

export const SportsModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-emerald-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🏆 LIVE SPORTS & BROADCAST</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Live scores, standings & AI match breakdowns</p>
        </div>
        <span className="rounded bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-700">
          3 MATCHES LIVE
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {GAMES.map((game, i) => (
          <div key={i} className="rounded-xl glass-panel p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 w-24">{game.league}</span>
              <div className="flex items-center gap-3 text-sm font-bold text-white">
                <span>{game.teamA}</span>
                <span className="text-emerald-400 px-2 py-0.5 rounded bg-slate-900">{game.scoreA} - {game.scoreB}</span>
                <span>{game.teamB}</span>
              </div>
            </div>
            <span className="rounded bg-emerald-950 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-800">
              {game.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
