'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { InfiniteEnvironment } from './InfiniteEnvironment';
import { OrbitCarousel } from './OrbitCarousel';
import { CinematicCamera } from './CinematicCamera';
import { PostProcessing } from './PostProcessing';
import { HumanFormController } from './HumanFormController';

export const SpatialCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#020408] overflow-hidden select-none">
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <CinematicCamera />
          <InfiniteEnvironment />
          <OrbitCarousel />
          <HumanFormController />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
};
