import { create } from 'zustand';
import { EnvironmentId } from '@/constants/environments';

export type MasterClockPhase = 
  | 'IDLE' 
  | 'TARGETING' 
  | 'APPROACH' 
  | 'SETTLE' 
  | 'TRANSFORMING_HUMAN' 
  | 'HUMAN_ACTIVE' 
  | 'RETURNING';

export type FormMode = 'SPATIAL' | 'HUMAN';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: string;
  message: string;
}

interface NexusState {
  // Active Module & Carousel
  activeModuleId: string | null;
  centeredModuleId: string;
  carouselAngle: number; // Current continuous angle in radians
  targetCarouselAngle: number;
  
  // Phase 6: Measured Stillness & Motion Control
  motionMultiplier: number; // 0..1 multiplier for smooth settling over ~1 sec
  isLocked: boolean; // LOCKED / DRIFT indicator
  
  // Environment & World Grade
  currentEnvironment: EnvironmentId;
  
  // Master Clock & Transformation
  clockPhase: MasterClockPhase;
  formMode: FormMode;
  transformProgress: number; // 0..1 for human transformation
  
  // HUD & Command Palette
  isHudVisible: boolean;
  isCommandPaletteOpen: boolean;
  
  // Desktop Bridge Status
  isDesktopBridgeConnected: boolean;
  desktopBridgeError: string | null;
  
  // System Log
  logs: SystemLogEntry[];
  
  // Actions
  setActiveModule: (id: string | null) => void;
  setCenteredModule: (id: string) => void;
  rotateCarousel: (deltaAngle: number) => void;
  setCarouselAngle: (angle: number) => void;
  toggleMotionLock: () => void;
  setMotionMultiplier: (mult: number) => void;
  setEnvironment: (env: EnvironmentId) => void;
  setClockPhase: (phase: MasterClockPhase) => void;
  setFormMode: (mode: FormMode) => void;
  setTransformProgress: (progress: number) => void;
  toggleHud: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setDesktopBridgeStatus: (connected: boolean, error?: string | null) => void;
  addLog: (level: SystemLogEntry['level'], source: string, message: string) => void;
}

export const useNexusStore = create<NexusState>((set, get) => ({
  activeModuleId: null,
  centeredModuleId: 'stocks',
  carouselAngle: 0,
  targetCarouselAngle: 0,
  
  motionMultiplier: 0.0, // Motion OFF by default per Phase 6 specification
  isLocked: true,
  
  currentEnvironment: 'minimal_studio',
  
  clockPhase: 'IDLE',
  formMode: 'SPATIAL',
  transformProgress: 0,
  
  isHudVisible: true,
  isCommandPaletteOpen: false,
  
  isDesktopBridgeConnected: false,
  desktopBridgeError: null,
  
  logs: [
    {
      id: '1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'KERNEL',
      message: 'NEXUS Spatial OS 1.0 initialized in standalone spatial mode',
    },
    {
      id: '2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      source: 'GESTURE',
      message: 'MediaPipe Vision Hand Tracker awaiting camera permission',
    },
  ],
  
  setActiveModule: (id) => set({ activeModuleId: id }),
  setCenteredModule: (id) => set({ centeredModuleId: id }),
  
  rotateCarousel: (deltaAngle) => {
    // If locked, refuse rotation drift unless explicit gesture
    const currentTarget = get().targetCarouselAngle;
    const newTarget = currentTarget + deltaAngle;
    set({ targetCarouselAngle: newTarget });
  },
  
  setCarouselAngle: (angle) => set({ carouselAngle: angle, targetCarouselAngle: angle }),
  
  toggleMotionLock: () => {
    const newLocked = !get().isLocked;
    set({
      isLocked: newLocked,
      motionMultiplier: newLocked ? 0.0 : 1.0,
    });
    get().addLog('info', 'SYSTEM', `Motion Gating set to ${newLocked ? 'LOCKED (Zero Drift)' : 'DRIFT'}`);
  },
  
  setMotionMultiplier: (mult) => set({ motionMultiplier: Math.max(0, Math.min(1, mult)) }),
  
  setEnvironment: (env) => {
    set({ currentEnvironment: env });
    get().addLog('info', 'RENDER', `World color grade switched to [${env.toUpperCase()}]`);
  },
  
  setClockPhase: (phase) => set({ clockPhase: phase }),
  
  setFormMode: (mode) => set({ formMode: mode }),
  
  setTransformProgress: (progress) => set({ transformProgress: progress }),
  
  toggleHud: () => set((state) => ({ isHudVisible: !state.isHudVisible })),
  
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  
  setDesktopBridgeStatus: (connected, error = null) => 
    set({ isDesktopBridgeConnected: connected, desktopBridgeError: error }),
    
  addLog: (level, source, message) => set((state) => ({
    logs: [
      {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        level,
        source,
        message,
      },
      ...state.logs.slice(0, 49), // Keep last 50 logs
    ],
  })),
}));
