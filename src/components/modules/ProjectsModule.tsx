'use client';

import React from 'react';

const PROJECTS = [
  {
    id: '1',
    title: 'NEXUS Spatial OS',
    description: 'Futuristic web operating system with WebGL2, R3F, MediaPipe hand tracking & Gemini AI',
    tech: ['Next.js 15', 'Three.js', 'React 19', 'MediaPipe', 'Tailwind v4'],
    status: 'ACTIVE DEVELOPMENT',
    github: 'https://github.com/nexus/nexus-spatial-os',
  },
  {
    id: '2',
    title: 'Neural Vision Engine',
    description: 'Low-latency hand gesture recognition pipeline with custom spatial gesture mappings',
    tech: ['Python', 'WASM', 'WebGPU', 'TensorFlow.js'],
    status: 'DEPLOYED',
    github: 'https://github.com/nexus/neural-vision',
  },
  {
    id: '3',
    title: 'Spatial Audio Synthesizer',
    description: 'Procedural sound synthesis engine for 3D UI audio feedback and ambient synth drones',
    tech: ['Web Audio API', 'DSP', 'TypeScript'],
    status: 'STABLE',
    github: 'https://github.com/nexus/spatial-audio',
  },
];

export const ProjectsModule: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-purple-900/50 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📂 SPATIAL WORKSPACES & PROJECTS</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Interactive project worlds, code repositories & prompt history</p>
        </div>
        <span className="rounded bg-purple-950 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-700">
          3 ACTIVE REPOS
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {PROJECTS.map((proj) => (
          <div key={proj.id} className="rounded-xl glass-panel p-4 flex flex-col justify-between gap-3 border border-purple-500/30">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-white text-sm">{proj.title}</h3>
                <span className="text-[9px] font-bold text-emerald-400">{proj.status}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">{proj.description}</p>

              <div className="flex flex-wrap gap-1">
                {proj.tech.map((t) => (
                  <span key={t} className="rounded bg-slate-900 px-2 py-0.5 text-[9px] text-cyan-400 border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={proj.github}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-center rounded bg-purple-950/80 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-900 transition-colors border border-purple-700"
            >
              VIEW REPOSITORY →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
