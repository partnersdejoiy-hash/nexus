'use client';

import React from 'react';

const EVENTS = [
  { time: '10:00 AM', title: 'Architecture Review: NEXUS Phase 7', location: 'Spatial Hologram Room 1', tag: 'WORK' },
  { time: '01:30 PM', title: 'Gemini 1.5 Streaming API Integration', location: 'Virtual Workspace', tag: 'CODE' },
  { time: '04:00 PM', title: 'Spatial Computing Demo to Design Team', location: 'Main Lab', tag: 'PRESENTATION' },
];

export const CalendarModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-blue-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📅 TEMPORAL MATRIX & CALENDAR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Schedule timeline, upcoming events & AI agenda sync</p>
        </div>
        <span className="rounded bg-blue-950 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-700">
          TODAY: MON, SEP 28
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {EVENTS.map((evt, i) => (
          <div key={i} className="rounded-xl glass-panel p-4 flex items-center justify-between border border-blue-500/20">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-cyan-400 w-20">{evt.time}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{evt.title}</h4>
                <p className="text-xs text-slate-400">{evt.location}</p>
              </div>
            </div>
            <span className="rounded bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-blue-300 border border-slate-700">
              {evt.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
