'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const NexusApp = dynamic(() => import('@/components/NexusApp'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#020408] font-mono text-cyan-400">
      <div className="flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
        </span>
        <span className="text-sm font-bold tracking-widest text-slate-100">INITIALIZING NEXUS SPATIAL KERNEL...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return <NexusApp />;
}
