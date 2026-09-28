'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '@/stores/useNexusStore';

export const CinematicCamera: React.FC = () => {
  const motionMultiplier = useNexusStore((s) => s.motionMultiplier);
  const clockPhase = useNexusStore((s) => s.clockPhase);
  const formMode = useNexusStore((s) => s.formMode);

  const targetPos = useRef(new THREE.Vector3(0, 0, 8));

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Base position
    let baseZ = 8;
    let baseY = 0;
    let baseX = 0;

    // Phase 6 Master Clock APPROACH phase: Push camera forward along view axis
    if (clockPhase === 'APPROACH' || clockPhase === 'SETTLE') {
      baseZ = 5.2; // Push closer to centered card
      baseY = 0.2;
    } else if (formMode === 'HUMAN') {
      // Relaxed framing for human bust
      baseZ = 6.5;
      baseY = 0.4;
    }

    // Floating camera drift (ONLY if motionMultiplier > 0, zero drift when motionMultiplier === 0!)
    const driftX = Math.sin(time * 0.4) * 0.3 * motionMultiplier;
    const driftY = Math.cos(time * 0.3) * 0.2 * motionMultiplier;

    targetPos.current.set(baseX + driftX, baseY + driftY, baseZ);

    // Smoothly interpolate camera position
    state.camera.position.lerp(targetPos.current, delta * 4);
    state.camera.lookAt(0, 0, 0);
  });

  return null;
};
