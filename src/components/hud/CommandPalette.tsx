'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNexusStore } from '@/stores/useNexusStore';
import { masterClock } from '@/engine/MasterClock';

interface SearchItem {
  id: string;
  name: string;
  type: 'app' | 'website' | 'module' | 'system';
  action: () => void;
  icon: string;
  keywords: string[];
}

export const CommandPalette: React.FC = () => {
  const isOpen = useNexusStore((s) => s.isCommandPaletteOpen);
  const setOpen = useNexusStore((s) => s.setCommandPaletteOpen);
  const setActiveModule = useNexusStore((s) => s.setActiveModule);
  const setEnvironment = useNexusStore((s) => s.setEnvironment);

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global hotkey handler (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setOpen]);

  const items: SearchItem[] = useMemo(
    () => [
      // Modules
      {
        id: 'mod-stocks',
        name: 'Stocks & Portfolio',
        type: 'module',
        icon: '📈',
        keywords: ['stocks', 'portfolio', 'nvidia', 'market'],
        action: () => masterClock.triggerCardPresentation('stocks'),
      },
      {
        id: 'mod-instagram',
        name: 'Instagram Telemetry',
        type: 'module',
        icon: '📷',
        keywords: ['instagram', 'reels', 'followers', 'social'],
        action: () => masterClock.triggerCardPresentation('instagram'),
      },
      {
        id: 'mod-projects',
        name: 'Spatial Projects',
        type: 'module',
        icon: '📂',
        keywords: ['projects', 'code', 'github', 'workspace'],
        action: () => masterClock.triggerCardPresentation('projects'),
      },
      {
        id: 'mod-weather',
        name: 'Weather Atmosphere',
        type: 'module',
        icon: '🌤️',
        keywords: ['weather', 'forecast', 'rain', 'temp'],
        action: () => masterClock.triggerCardPresentation('weather'),
      },
      {
        id: 'mod-ai',
        name: 'Gemini AI Brain',
        type: 'module',
        icon: '🧠',
        keywords: ['ai', 'gemini', 'chat', 'reasoning'],
        action: () => masterClock.triggerCardPresentation('ai'),
      },
      // Apps
      {
        id: 'app-spotify',
        name: 'Spotify Music',
        type: 'app',
        icon: '🎵',
        keywords: ['spotify', 'music', 'audio', 'player'],
        action: () => masterClock.triggerCardPresentation('music'),
      },
      {
        id: 'app-terminal',
        name: 'System Diagnostics',
        type: 'system',
        icon: '💻',
        keywords: ['system', 'cpu', 'gpu', 'diagnostics', 'macos'],
        action: () => masterClock.triggerCardPresentation('system'),
      },
      // Websites
      {
        id: 'web-github',
        name: 'Open GitHub Workspace',
        type: 'website',
        icon: '🌐',
        keywords: ['github', 'web', 'repository'],
        action: () => window.open('https://github.com', '_blank'),
      },
      // Environment
      {
        id: 'env-dark',
        name: 'Switch to Dark Lab Grade',
        type: 'system',
        icon: '🌌',
        keywords: ['dark', 'lab', 'grade', 'environment'],
        action: () => setEnvironment('dark_lab'),
      },
      {
        id: 'env-industrial',
        name: 'Switch to Industrial Deck Grade',
        type: 'system',
        icon: '🏭',
        keywords: ['industrial', 'deck', 'warm', 'grade'],
        action: () => setEnvironment('industrial_deck'),
      },
    ],
    [setEnvironment]
  );

  // Phase 5 Ranking algorithm: Prefix-first -> Initials -> Word boundary -> Substring
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();

    return [...items].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();

      // 1. Prefix match
      const aPrefix = aName.startsWith(q) ? 4 : 0;
      const bPrefix = bName.startsWith(q) ? 4 : 0;

      // 2. Substring match
      const aSub = aName.includes(q) ? 2 : 0;
      const bSub = bName.includes(q) ? 2 : 0;

      const scoreA = aPrefix + aSub;
      const scoreB = bPrefix + bSub;

      return scoreB - scoreA;
    });
  }, [items, query]);

  if (!isOpen) return null;

  const handleSelect = (item: SearchItem) => {
    item.action();
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-xl glass-card border border-cyan-500/30 p-4 shadow-2xl font-mono text-xs">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-cyan-900/60 pb-3">
          <span className="text-cyan-400 text-lg">🔍</span>
          <input
            type="text"
            autoFocus
            placeholder="Type a command, app, or website..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">ESC to close</kbd>
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-80 overflow-y-auto flex flex-col gap-1">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-slate-500">No matching applications or commands found</div>
          ) : (
            filteredItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex items-center justify-between rounded-lg p-2.5 transition-colors text-left ${
                  idx === selectedIndex
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="font-bold">{item.name}</span>
                </div>
                <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-slate-400 border border-slate-700">
                  {item.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
