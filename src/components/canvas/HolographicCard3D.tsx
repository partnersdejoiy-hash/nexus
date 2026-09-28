'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { NexusModule } from '@/constants/modules';
import { useNexusStore } from '@/stores/useNexusStore';
import { masterClock } from '@/engine/MasterClock';

interface HolographicCard3DProps {
  moduleItem: NexusModule;
  index: number;
  angleOffset: number;
  orbitRadius: number;
}

export const HolographicCard3D: React.FC<HolographicCard3DProps> = ({
  moduleItem,
  index,
  angleOffset,
  orbitRadius,
}) => {
  const meshRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
  const borderMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);

  const carouselAngle = useNexusStore((s) => s.carouselAngle);
  const activeModuleId = useNexusStore((s) => s.activeModuleId);
  const motionMultiplier = useNexusStore((s) => s.motionMultiplier);

  const [hovered, setHovered] = useState(false);

  const isSelected = activeModuleId === moduleItem.id;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const currentAngle = angleOffset + carouselAngle;

    // 1. Position on orbit ring + subtle floating drift
    const floatY = Math.sin(time * 1.5 + index * 0.7) * 0.12 * motionMultiplier;
    const targetX = Math.sin(currentAngle) * orbitRadius;
    const targetZ = Math.cos(currentAngle) * orbitRadius;

    // Interpolate position
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, delta * 8);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, floatY, delta * 8);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 8);

    // Face toward user center
    meshRef.current.lookAt(0, meshRef.current.position.y, 12);

    // 2. Gold at the Center calculation (Phase 6 Rules)
    // Distance/Angle to front center (z = orbitRadius)
    const forwardVec = new THREE.Vector3(0, 0, 1);
    const cardPosNormalized = meshRef.current.position.clone().normalize();
    const alignmentDot = cardPosNormalized.dot(forwardVec);
    
    // Earned Gold power curve fade
    let goldFactor = Math.pow(Math.max(0, alignmentDot), 4);

    // Rule 1: Gold MUST NOT read as Warning Orange (~18° apart).
    // A warned card is NEVER allowed to go gold — gate the gold term entirely on the warning flag!
    if (moduleItem.isWarning) {
      goldFactor = 0;
    }

    // Rule 2: Gold MUST be drawn dimmer than blue (border multiplier <= 1.0)
    // Interpolate border color between Cyan (#00f0ff), Gold (#d4af37), and Warning (#ff6b00)
    let targetColor = new THREE.Color('#00f0ff');
    if (moduleItem.isWarning) {
      targetColor = new THREE.Color('#ff6b00');
    } else if (goldFactor > 0.1) {
      targetColor = new THREE.Color('#d4af37').lerp(new THREE.Color('#00f0ff'), 1 - goldFactor);
    }

    if (borderMaterialRef.current) {
      borderMaterialRef.current.color.lerp(targetColor, delta * 5);
    }

    // Hover / Active scaling
    const targetScale = isSelected ? 1.3 : hovered ? 1.08 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    masterClock.triggerCardPresentation(moduleItem.id);
  };

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      {/* Glass Pane Box Mesh */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 2.4, 0.08]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#060f1e"
          metalness={0.1}
          roughness={0.1}
          transmission={0.85}
          thickness={0.5}
          transparent
          opacity={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          ior={1.5}
        />
      </mesh>

      {/* Futuristic Animated Glow Border Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.84, 2.44, 0.04]} />
        <meshBasicMaterial
          ref={borderMaterialRef}
          color="#00f0ff"
          wireframe
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.4}
        />
      </mesh>

      {/* Front 3D Holographic Typography */}
      <group position={[0, 0, 0.05]}>
        {/* Category Header */}
        <Text
          position={[0, 0.85, 0]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.15}
        >
          {moduleItem.category.toUpperCase()}
        </Text>

        {/* Module Title */}
        <Text
          position={[0, 0.55, 0]}
          fontSize={0.18}
          color={moduleItem.isWarning ? '#ff6b00' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {moduleItem.name}
        </Text>

        {/* Optional Badge */}
        {moduleItem.badge && (
          <Text
            position={[0, 0.25, 0]}
            fontSize={0.07}
            color={moduleItem.accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {`[ ${moduleItem.badge} ]`}
          </Text>
        )}

        {/* Description Snippet */}
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.08}
          color="#cbd5e1"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          textAlign="center"
        >
          {moduleItem.description}
        </Text>

        {/* FUI Action Hint */}
        <Text
          position={[0, -0.85, 0]}
          fontSize={0.07}
          color={hovered ? '#00f0ff' : '#64748b'}
          anchorX="center"
          anchorY="middle"
        >
          {isSelected ? '● ACTIVE WORKSPACE' : hovered ? 'PINCH / TAP TO FOCUS' : 'ORBIT SLOT'}
        </Text>
      </group>
    </group>
  );
};
