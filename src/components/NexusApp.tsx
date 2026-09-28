'use client';

import React, { useEffect } from 'react';
import { SpatialCanvas } from '@/components/canvas/SpatialCanvas';
import { HUDOverlay } from '@/components/hud/HUDOverlay';
import { HandTrackingFeed } from '@/components/hud/HandTrackingFeed';
import { CommandPalette } from '@/components/hud/CommandPalette';
import { AIVoiceOverlay } from '@/components/hud/AIVoiceOverlay';
import { ModuleContainer } from '@/components/modules/ModuleContainer';
import { useNexusStore } from '@/stores/useNexusStore';
import { masterClock } from '@/engine/MasterClock';

export default function NexusApp() {
  const rotateCarousel = useNexusStore((s) => s.rotateCarousel);
  const setActiveModule = useNexusStore((s) => s.setActiveModule);
  const toggleHud = useNexusStore((s) => s.toggleHud);

  // Global Keyboard shortcuts & fallback interaction controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere if typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        rotateCarousel(-Math.PI / 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        rotateCarousel(Math.PI / 5);
      } else if (e.key === 'Escape') {
        setActiveModule(null);
        masterClock.cancelPresentation();
      } else if (e.key.toLowerCase() === 'h') {
        toggleHud();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateCarousel, setActiveModule, toggleHud]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#020408]">
      {/* 3D WebGL Spatial Canvas */}
      <SpatialCanvas />

      {/* MediaPipe Webcam Feed & Tracker Toggle */}
      <HandTrackingFeed />

      {/* HUD Telemetry & Control Overlay */}
      <HUDOverlay />

      {/* ⌘K Command Palette (Mounted outside HUD gate) */}
      <CommandPalette />

      {/* Gemini AI Voice & Streaming Overlay */}
      <AIVoiceOverlay />

      {/* Active Module Modal Content Container */}
      <ModuleContainer />
    </main>
  );
}
