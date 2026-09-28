import { create } from 'zustand';

export type QualityTier = 'high' | 'medium' | 'low';

interface PerformanceState {
  fps: number;
  qualityTier: QualityTier;
  particleCount: number;
  gpuInfo: string;
  isSuspended: boolean; // Freeze tier changes during Human Form sequence!
  
  // Actions
  setFps: (fps: number) => void;
  setQualityTier: (tier: QualityTier) => void;
  setGpuInfo: (info: string) => void;
  setSuspended: (suspended: boolean) => void;
  updateAdaptiveMetrics: (fps: number) => void;
}

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
  fps: 60,
  qualityTier: 'high',
  particleCount: 15000,
  gpuInfo: 'WebGL2 Accelerated Engine',
  isSuspended: false,
  
  setFps: (fps) => set({ fps }),
  setQualityTier: (tier) => {
    if (get().isSuspended) return; // Do not alter tier while suspended!
    const count = tier === 'high' ? 15000 : tier === 'medium' ? 8000 : 4000;
    set({ qualityTier: tier, particleCount: count });
  },
  setGpuInfo: (gpuInfo) => set({ gpuInfo }),
  setSuspended: (suspended) => set({ isSuspended: suspended }),
  
  updateAdaptiveMetrics: (fps) => {
    const { isSuspended, qualityTier, setQualityTier } = get();
    set({ fps });
    
    if (isSuspended) return;
    
    // Adaptive quality tier adjustment
    if (fps < 30 && qualityTier === 'high') {
      setQualityTier('medium');
    } else if (fps < 20 && qualityTier === 'medium') {
      setQualityTier('low');
    } else if (fps > 55 && qualityTier === 'low') {
      setQualityTier('medium');
    } else if (fps > 58 && qualityTier === 'medium') {
      setQualityTier('high');
    }
  },
}));
