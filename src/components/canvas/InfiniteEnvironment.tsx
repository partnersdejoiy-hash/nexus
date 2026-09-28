'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNexusStore } from '@/stores/useNexusStore';
import { usePerformanceStore } from '@/stores/usePerformanceStore';
import { ENVIRONMENTS } from '@/constants/environments';

export const InfiniteEnvironment: React.FC = () => {
  const currentEnvId = useNexusStore((s) => s.currentEnvironment);
  const activeModuleId = useNexusStore((s) => s.activeModuleId);
  const motionMultiplier = useNexusStore((s) => s.motionMultiplier);
  const particleCount = usePerformanceStore((s) => s.particleCount);

  const env = ENVIRONMENTS[currentEnvId] || ENVIRONMENTS.minimal_studio;

  // Weather mode detection (if weather module active)
  const isWeatherActive = activeModuleId === 'weather';
  const isStocksActive = activeModuleId === 'stocks';

  // Floating particles geometry & positions
  const particlesRef = useRef<THREE.Points>(null!);
  const lightBeam1Ref = useRef<THREE.Mesh>(null!);
  const lightBeam2Ref = useRef<THREE.Mesh>(null!);
  const marketGridRef = useRef<THREE.GridHelper>(null!);

  // Generate particle positions and colors
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const baseColor = new THREE.Color(env.particleColor);

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical distribution around orbit
      const radius = 4 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 14;

      pos[i * 3] = radius * Math.cos(theta);
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = radius * Math.sin(theta);

      // Color variation
      const c = baseColor.clone().offsetHSL((Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, [particleCount, env.particleColor]);

  // Rain particles for weather mode
  const rainCount = 2000;
  const rainPositions = useMemo(() => {
    const pos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = Math.random() * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [rainCount]);

  const rainRef = useRef<THREE.Points>(null!);

  useFrame((state, delta) => {
    // Smooth motion gating
    const time = state.clock.getElapsedTime();

    // 1. Slow particle drift (gated by motionMultiplier)
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02 * motionMultiplier;
    }

    // 2. Light beams moving sweeping angle
    if (lightBeam1Ref.current) {
      lightBeam1Ref.current.rotation.z = Math.sin(time * 0.3) * 0.2 * motionMultiplier;
    }
    if (lightBeam2Ref.current) {
      lightBeam2Ref.current.rotation.z = -Math.cos(time * 0.25) * 0.2 * motionMultiplier;
    }

    // 3. Weather Rain particles falling
    if (isWeatherActive && rainRef.current) {
      const pos = rainRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        pos[i * 3 + 1] -= delta * 12;
        if (pos[i * 3 + 1] < -6) {
          pos[i * 3 + 1] = 12;
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // 4. Market grid animated floor if Stocks module active
    if (marketGridRef.current) {
      const targetOpacity = isStocksActive ? 0.4 : 0.05;
      const mat = marketGridRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 3);
    }
  });

  return (
    <>
      {/* Volumetric Fog & Atmospheric Background */}
      <color attach="background" args={[env.fogColor]} />
      <fogExp2 attach="fog" args={[env.fogColor, env.fogDensity]} />

      {/* Atmospheric Lighting */}
      <ambientLight color={env.ambientLightColor} intensity={0.8} />
      <directionalLight
        position={[5, 10, 5]}
        color={env.directionalLightColor}
        intensity={1.5}
        castShadow={false}
      />
      <pointLight position={[0, -2, 0]} color={env.particleColor} intensity={2.0} distance={15} />

      {/* Floating Volumetric Particle Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Weather Rain Effect when Weather Module Active */}
      {isWeatherActive && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[rainPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.08}
            color="#38bdf8"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      {/* Sweeping Soft Light Beams */}
      <mesh ref={lightBeam1Ref} position={[-4, 2, -6]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 4.0, 16, 32, 1, true]} />
        <meshBasicMaterial
          color={env.lightBeamColor}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={lightBeam2Ref} position={[4, 2, -6]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 4.5, 18, 32, 1, true]} />
        <meshBasicMaterial
          color={env.particleColor}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Animated Floor Grid (Stocks / FUI Grid) */}
      <gridHelper
        ref={marketGridRef}
        args={[30, 30, '#00f0ff', '#1e293b']}
        position={[0, -4, 0]}
      />
    </>
  );
};
