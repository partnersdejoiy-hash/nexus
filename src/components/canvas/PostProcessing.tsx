'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { useNexusStore } from '@/stores/useNexusStore';
import { ENVIRONMENTS } from '@/constants/environments';

export const PostProcessing: React.FC = () => {
  const currentEnvId = useNexusStore((s) => s.currentEnvironment);
  const formMode = useNexusStore((s) => s.formMode);

  const env = ENVIRONMENTS[currentEnvId] || ENVIRONMENTS.minimal_studio;

  // Phase 7 Protection: Release vignette & DOF during human form mode so bust isn't cropped!
  const isHuman = formMode === 'HUMAN';
  const vignetteOffset = isHuman ? 0.8 : 0.4;
  const bloomIntensity = isHuman ? 0.8 : env.bloomIntensity;

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new Vector2(0.0012, 0.0012)}
        radialModulation={false}
        modulationOffset={0.0}
      />
      <Vignette
        eskil={false}
        offset={vignetteOffset}
        darkness={0.7}
      />
    </EffectComposer>
  );
};
