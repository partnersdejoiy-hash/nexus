export interface NexusModule {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  accentColor: string;
  isWarning?: boolean;
  warningMessage?: string;
  badge?: string;
}

export const NEXUS_MODULES: NexusModule[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Telemetry & Media',
    description: 'Followers, reach, reels growth & AI engagement trends',
    icon: 'Camera',
    accentColor: '#E1306C',
    badge: 'LIVE DATA',
  },
  {
    id: 'stocks',
    name: 'Stocks',
    category: 'Market Intelligence',
    description: 'Portfolio, performance, live prices & 3D market grid',
    icon: 'TrendingUp',
    accentColor: '#00F0FF',
    badge: '+14.2%',
  },
  {
    id: 'projects',
    name: 'Projects',
    category: 'Spatial Workspaces',
    description: 'Interactive sub-worlds, code repos & prompt history',
    icon: 'FolderGit2',
    accentColor: '#8A2BE2',
    badge: '4 ACTIVE',
  },
  {
    id: 'sports',
    name: 'Sports',
    category: 'Live Broadcast',
    description: 'Fixtures, live scores, standings & AI voice breakdown',
    icon: 'Trophy',
    accentColor: '#00FF87',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'Temporal Matrix',
    description: 'Schedule timeline, upcoming events & AI agenda sync',
    icon: 'Calendar',
    accentColor: '#3B82F6',
  },
  {
    id: 'weather',
    name: 'Weather',
    category: 'Atmospheric Controls',
    description: 'Live atmospheric simulation (Rain, Fog, Clouds, Sun)',
    icon: 'CloudSun',
    accentColor: '#06B6D4',
  },
  {
    id: 'ai',
    name: 'AI Brain',
    category: 'Neural Engine',
    description: 'Gemini reasoning, code synthesis & knowledge vector search',
    icon: 'Cpu',
    accentColor: '#A855F7',
    badge: 'GEMINI 1.5',
  },
  {
    id: 'news',
    name: 'News',
    category: 'Global Signals',
    description: 'AI summarized breaking news & stacked signal cards',
    icon: 'Newspaper',
    accentColor: '#F59E0B',
  },
  {
    id: 'music',
    name: 'Music',
    category: 'Spatial Audio',
    description: 'Ambient synthesizer, track waveforms & audio stream',
    icon: 'Music',
    accentColor: '#EC4899',
  },
  {
    id: 'system',
    name: 'System OS',
    category: 'Hardware Diagnostics',
    description: 'CPU, GPU, Memory, Battery & macOS Desktop Bridge status',
    icon: 'Activity',
    accentColor: '#FF6B00',
    isWarning: false,
    warningMessage: 'Bridge status check: Local loopback active',
    badge: '98% HEALTH',
  },
];
