'use client';

import React from 'react';
import { useNexusStore } from '@/stores/useNexusStore';
import { InstagramModule } from './InstagramModule';
import { StocksModule } from './StocksModule';
import { ProjectsModule } from './ProjectsModule';
import { SportsModule } from './SportsModule';
import { CalendarModule } from './CalendarModule';
import { WeatherModule } from './WeatherModule';
import { AIModule } from './AIModule';
import { NewsModule } from './NewsModule';
import { MusicModule } from './MusicModule';
import { SystemModule } from './SystemModule';

export const ModuleContainer: React.FC = () => {
  const activeModuleId = useNexusStore((s) => s.activeModuleId);
  const setActiveModule = useNexusStore((s) => s.setActiveModule);

  if (!activeModuleId) return null;

  const renderModuleContent = () => {
    switch (activeModuleId) {
      case 'instagram':
        return <InstagramModule />;
      case 'stocks':
        return <StocksModule />;
      case 'projects':
        return <ProjectsModule />;
      case 'sports':
        return <SportsModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'weather':
        return <WeatherModule />;
      case 'ai':
        return <AIModule />;
      case 'news':
        return <NewsModule />;
      case 'music':
        return <MusicModule />;
      case 'system':
        return <SystemModule />;
      default:
        return null;
    }
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl glass-card border border-cyan-500/40 p-6 shadow-2xl font-mono text-slate-200">
        {/* Close Button */}
        <button
          onClick={() => setActiveModule(null)}
          className="absolute top-4 right-4 rounded-lg bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700"
        >
          ✕ CLOSE [ESC]
        </button>

        {/* Render Active Module */}
        {renderModuleContent()}
      </div>
    </div>
  );
};
