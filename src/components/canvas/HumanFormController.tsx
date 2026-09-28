'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useNexusStore } from '@/stores/useNexusStore';
import { useAIStore } from '@/stores/useAIStore';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { useGestureStore } from '@/stores/useGestureStore';

const NUM_FIGURE_PARTICLES = 12000;

export const HumanFormController: React.FC = () => {
  const formMode = useNexusStore((s) => s.formMode);
  const transformProgress = useNexusStore((s) => s.transformProgress);
  const clockPhase = useNexusStore((s) => s.clockPhase);
  const speechEnvelopeLevel = useAIStore((s) => s.speechEnvelopeLevel);
  const pointerPos = useGestureStore((s) => s.pointerPosition);

  const particlesRef = useRef<THREE.Points>(null!);
  const headGroupRef = useRef<THREE.Group>(null!);
  const jawMeshRef = useRef<THREE.Mesh>(null!);
  const eyeLeftRef = useRef<THREE.Mesh>(null!);
  const eyeRightRef = useRef<THREE.Mesh>(null!);
  const handMeshRef = useRef<THREE.Group>(null!);

  // Freeze adaptive performance tier during transform sequence (Phase 7 Protection)
  const setSuspended = usePerformanceStore((s) => s.setSuspended);

  // Generate GPU SDF Bust Surface Points (Head, Neck, Shoulders, Chest)
  const { figurePositions, initialPositions, colors } = useMemo(() => {
    const figPos = new Float32Array(NUM_FIGURE_PARTICLES * 3);
    const initPos = new Float32Array(NUM_FIGURE_PARTICLES * 3);
    const cols = new Float32Array(NUM_FIGURE_PARTICLES * 3);

    const baseBlue = new THREE.Color('#38bdf8');
    const shadowBlue = new THREE.Color('#1e1b4b');

    for (let i = 0; i < NUM_FIGURE_PARTICLES; i++) {
      // 1. Target Figure Position (Human Bust SDF: Head sphere + Neck cylinder + Shoulders ellipsoid)
      let x = 0, y = 0, z = 0;
      const partType = Math.random();

      if (partType < 0.45) {
        // Head sphere (r = 0.65, centered at y = 1.4)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.65 + (Math.random() - 0.5) * 0.05;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = 1.4 + r * Math.cos(phi);
        z = r * Math.sin(phi) * Math.sin(theta);
      } else if (partType < 0.65) {
        // Neck (r = 0.35, y = 0.5 to 0.9)
        const angle = Math.random() * Math.PI * 2;
        const r = 0.35 + (Math.random() - 0.5) * 0.03;
        x = r * Math.cos(angle);
        y = 0.5 + Math.random() * 0.4;
        z = r * Math.sin(angle);
      } else {
        // Shoulders & Chest (Ellipsoid: rx = 1.8, ry = 0.8, rz = 0.9, centered at y = 0.0)
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        x = 1.7 * Math.sin(phi) * Math.cos(theta);
        y = -0.2 + 0.7 * Math.cos(phi);
        z = 0.85 * Math.sin(phi) * Math.sin(theta);
      }

      figPos[i * 3] = x;
      figPos[i * 3 + 1] = y;
      figPos[i * 3 + 2] = z;

      // Initial card orbit positions (burst outward from center orbit)
      const orbitR = 4.5 + Math.random() * 2.5;
      const angle = Math.random() * Math.PI * 2;
      initPos[i * 3] = orbitR * Math.cos(angle);
      initPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      initPos[i * 3 + 2] = orbitR * Math.sin(angle);

      // Color (Blue in shadow, lighter cyan where key lands, NO bright rim)
      const lightFacing = Math.max(0, (z + 0.5) / 1.5);
      const col = shadowBlue.clone().lerp(baseBlue, lightFacing);
      cols[i * 3] = col.r;
      cols[i * 3 + 1] = col.g;
      cols[i * 3 + 2] = col.b;
    }

    return { figurePositions: figPos, initialPositions: initPos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    // Freeze adaptive quality tier during transformation
    if (clockPhase === 'TRANSFORMING_HUMAN' || clockPhase === 'RETURNING') {
      setSuspended(true);
    } else {
      setSuspended(false);
    }

    if (formMode !== 'HUMAN' && transformProgress === 0) return;

    const time = state.clock.getElapsedTime();

    // 1. Morph particles between Card Orbit (0) -> Core -> Human Bust (1)
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const currentPos = posAttr.array as Float32Array;

      for (let i = 0; i < NUM_FIGURE_PARTICLES; i++) {
        const i3 = i * 3;
        // Staggered crown-first to chest-last assembly
        const stagger = (figurePositions[i3 + 1] + 1) / 3; // normalized height
        const localProgress = Math.max(0, Math.min(1, (transformProgress - stagger * 0.3) / 0.7));

        // Smooth cubic lerp
        const p = localProgress * localProgress * (3 - 2 * localProgress);

        currentPos[i3] = THREE.MathUtils.lerp(initialPositions[i3], figurePositions[i3], p);
        currentPos[i3 + 1] = THREE.MathUtils.lerp(initialPositions[i3 + 1], figurePositions[i3 + 1], p);
        currentPos[i3 + 2] = THREE.MathUtils.lerp(initialPositions[i3 + 2], figurePositions[i3 + 2], p);
      }
      posAttr.needsUpdate = true;
    }

    // 2. Alive Idle Motion: Chest Breathing + Rigid Head Turn toward cursor
    if (headGroupRef.current && formMode === 'HUMAN') {
      // Rigid head turn towards screen pointer
      const targetRotY = pointerPos.x * 0.35;
      const targetRotX = -pointerPos.y * 0.2;
      headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetRotY, delta * 4);
      headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, targetRotX, delta * 4);
    }

    // 3. 5-Step Mechanical Jaw Hinge Mouth Movement (Phase 7 Spec)
    if (jawMeshRef.current && formMode === 'HUMAN') {
      // Discretize speech envelope into 5 distinct steps
      const steps = 5;
      const discreteEnvelope = Math.floor(speechEnvelopeLevel * steps) / steps;
      
      // Hinge rotation about ear axis (chin swings open)
      const targetJawRotX = discreteEnvelope * 0.25;
      jawMeshRef.current.rotation.x = THREE.MathUtils.lerp(jawMeshRef.current.rotation.x, targetJawRotX, delta * 15);
    }

    // 4. Glowing Eye Points Settle Last
    const eyeOpacity = Math.max(0, (transformProgress - 0.8) / 0.2);
    if (eyeLeftRef.current) (eyeLeftRef.current.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;
    if (eyeRightRef.current) (eyeRightRef.current.material as THREE.MeshBasicMaterial).opacity = eyeOpacity;

    // 5. Presenting SDF Hand (rises from frame when speaking or presenting panel)
    if (handMeshRef.current) {
      const isPresenting = speechEnvelopeLevel > 0.05 || clockPhase === 'HUMAN_ACTIVE';
      const targetHandY = isPresenting ? -0.8 : -2.5;
      handMeshRef.current.position.y = THREE.MathUtils.lerp(handMeshRef.current.position.y, targetHandY, delta * 5);
    }
  });

  if (formMode !== 'HUMAN' && transformProgress === 0) return null;

  return (
    <group position={[0, -0.5, 0]}>
      {/* 1. Opaque Sphere Impostor Particles for Digital Bust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(figurePositions), 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={true}
        />
      </points>

      {/* 2. Head & Jaw Group */}
      <group ref={headGroupRef} position={[0, 1.4, 0]}>
        {/* Glowing Eyes */}
        <mesh ref={eyeLeftRef} position={[-0.22, 0.1, 0.58]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0} />
        </mesh>
        <mesh ref={eyeRightRef} position={[0.22, 0.1, 0.58]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={0} />
        </mesh>

        {/* 5-Step Mechanical Jaw Hinge Mesh */}
        <mesh ref={jawMeshRef} position={[0, -0.25, 0.4]}>
          <boxGeometry args={[0.35, 0.04, 0.2]} />
          <meshBasicMaterial color="#00f0ff" transparent opacity={speechEnvelopeLevel > 0.02 ? 0.9 : 0.2} />
        </mesh>
      </group>

      {/* 3. Holographic Presenting SDF Hand */}
      <group ref={handMeshRef} position={[0, -2.5, 1.2]}>
        <mesh position={[0.6, 0, 0]}>
          <boxGeometry args={[0.7, 0.1, 0.8]} />
          <meshPhysicalMaterial
            color="#060f1e"
            roughness={0.2}
            transmission={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Presented Holographic Panel text */}
        <Text
          position={[0.6, 0.15, 0]}
          fontSize={0.08}
          color="#00f0ff"
          anchorX="center"
          anchorY="middle"
        >
          ● NEXUS INTELLIGENCE PRESENTING
        </Text>
      </group>
    </group>
  );
};
