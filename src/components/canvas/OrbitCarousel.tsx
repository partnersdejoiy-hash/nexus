'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NEXUS_MODULES } from '@/constants/modules';
import { HolographicCard3D } from './HolographicCard3D';
import { useNexusStore } from '@/stores/useNexusStore';

const ORBIT_RADIUS = 5.2;

export const OrbitCarousel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const carouselAngle = useNexusStore((s) => s.carouselAngle);
  const targetCarouselAngle = useNexusStore((s) => s.targetCarouselAngle);
  const setCarouselAngle = useNexusStore((s) => s.setCarouselAngle);
  const setCenteredModule = useNexusStore((s) => s.setCenteredModule);
  const formMode = useNexusStore((s) => s.formMode);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Smooth spring interpolation toward target carousel angle
    const diff = targetCarouselAngle - carouselAngle;
    if (Math.abs(diff) > 0.0001) {
      const nextAngle = THREE.MathUtils.lerp(carouselAngle, targetCarouselAngle, delta * 6);
      setCarouselAngle(nextAngle);
    }

    // Determine which card is nearest center front (angle = 0 relative to camera)
    const numCards = NEXUS_MODULES.length;
    const step = (Math.PI * 2) / numCards;
    
    // Normalize current angle to [0, 2pi]
    const normalizedAngle = ((carouselAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const closestIdx = Math.round(normalizedAngle / step) % numCards;
    const centerCard = NEXUS_MODULES[(numCards - closestIdx) % numCards];

    if (centerCard) {
      setCenteredModule(centerCard.id);
    }
  });

  // If in Human Form mode, hide orbit ring (cards dissolved into human body)
  if (formMode === 'HUMAN') {
    return null;
  }

  return (
    <group ref={groupRef}>
      {NEXUS_MODULES.map((moduleItem, index) => {
        const numCards = NEXUS_MODULES.length;
        const angleOffset = (index / numCards) * Math.PI * 2;

        return (
          <HolographicCard3D
            key={moduleItem.id}
            moduleItem={moduleItem}
            index={index}
            angleOffset={angleOffset}
            orbitRadius={ORBIT_RADIUS}
          />
        );
      })}
    </group>
  );
};
