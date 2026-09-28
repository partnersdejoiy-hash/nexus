'use client';

import React from 'react';

const ARTICLES = [
  {
    title: 'Spatial Computing Operating Systems Enter Production Era',
    summary: 'Next-generation web architectures leveraging WebGL2, R3F, and MediaPipe enable fluid spatial computing in browser runtimes.',
    category: 'AI & GRAPHICS',
    time: '12m ago',
  },
  {
    title: 'Google DeepMind Unveils Next-Gen Multimodal Reasoning Models',
    summary: 'New streaming API primitives allow instant voice-to-token latency with bidirectional conversational interruption handling.',
    category: 'NEURAL RESEARCH',
    time: '1h ago',
  },
  {
    title: 'WebGPU Adoption Accelerates Across Production Frontend Architecture',
    summary: 'Real-time compute shaders and Poisson-disk blue noise particle bakes hit 60 FPS performance thresholds on modern browsers.',
    category: 'ENGINEERING',
    time: '3h ago',
  },
];

export const NewsModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-amber-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📰 GLOBAL SIGNALS & NEWS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">AI summarized breaking news & signal stack</p>
        </div>
        <span className="rounded bg-amber-950 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-700">
          SIGNAL STREAM LIVE
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {ARTICLES.map((art, i) => (
          <div key={i} className="rounded-xl glass-panel p-4 flex flex-col gap-2 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400">{art.category}</span>
              <span className="text-[10px] text-slate-500">{art.time}</span>
            </div>
            <h3 className="font-bold text-white text-sm">{art.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{art.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
