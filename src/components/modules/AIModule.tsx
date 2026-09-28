'use client';

import React from 'react';

export const AIModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🧠 GEMINI NEURAL AI BRAIN</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Deep reasoning, spatial command processing & code synthesis</p>
        </div>
        <span className="rounded bg-purple-950 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-700">
          GEMINI 1.5 FLASH STREAMING
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl glass-panel p-4 flex flex-col gap-2">
          <h3 className="text-sm font-bold text-purple-300">ACTIVE CAPABILITIES</h3>
          <ul className="text-xs text-slate-300 flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Real-time token streaming to 3D space
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Natural language command engine parser
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Context awareness of active orbit module
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Interruption support on speech recognition
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span> Human form particle transformation choreography
            </li>
          </ul>
        </div>

        <div className="rounded-xl glass-panel p-4 flex flex-col gap-2 border border-purple-500/30">
          <h3 className="text-sm font-bold text-purple-300">VOICE COMMAND EXAMPLES</h3>
          <div className="text-xs text-slate-300 flex flex-col gap-1.5 font-mono">
            <div className="p-2 rounded bg-slate-900 border border-slate-800">"Nexus, transform into a human shape"</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">"Open Stocks and explain portfolio"</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">"Summarize today's top AI news"</div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800">"Return to spatial mode"</div>
          </div>
        </div>
      </div>
    </div>
  );
};
