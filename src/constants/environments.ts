export type EnvironmentId = 
  | 'minimal_studio' 
  | 'dark_lab' 
  | 'glass_observatory' 
  | 'industrial_deck' 
  | 'open_water' 
  | 'fog_chamber';

export interface EnvironmentPreset {
  id: EnvironmentId;
  name: string;
  fogColor: string;
  fogDensity: number;
  particleColor: string;
  lightBeamColor: string;
  ambientLightColor: string;
  directionalLightColor: string;
  bloomIntensity: number;
  contrast: number; // filmic contrast pivot
  shadowTint: string; // shadow split grade tint
  highlightTint: string; // highlight split grade tint
  description: string;
}

export const ENVIRONMENTS: Record<EnvironmentId, EnvironmentPreset> = {
  minimal_studio: {
    id: 'minimal_studio',
    name: 'Minimal Studio',
    fogColor: '#030712',
    fogDensity: 0.035,
    particleColor: '#00f0ff',
    lightBeamColor: '#38bdf8',
    ambientLightColor: '#0f172a',
    directionalLightColor: '#38bdf8',
    bloomIntensity: 1.2,
    contrast: 1.0,
    shadowTint: '#4c1d95',
    highlightTint: '#ffffff',
    description: 'Clean industrial spatial lab with precise blue-white volumetric depth',
  },
  dark_lab: {
    id: 'dark_lab',
    name: 'Dark Lab',
    fogColor: '#020408',
    fogDensity: 0.05,
    particleColor: '#8a2be2',
    lightBeamColor: '#00f0ff',
    ambientLightColor: '#090d16',
    directionalLightColor: '#00f0ff',
    bloomIntensity: 1.6,
    contrast: 1.15,
    shadowTint: '#3b0764',
    highlightTint: '#e0f2fe',
    description: 'Deep neural research vault with high contrast and dark indigo fog',
  },
  glass_observatory: {
    id: 'glass_observatory',
    name: 'Glass Observatory',
    fogColor: '#050b14',
    fogDensity: 0.025,
    particleColor: '#38bdf8',
    lightBeamColor: '#a855f7',
    ambientLightColor: '#0c1a30',
    directionalLightColor: '#e0f2fe',
    bloomIntensity: 1.4,
    contrast: 0.95,
    shadowTint: '#1e1b4b',
    highlightTint: '#f8fafc',
    description: 'Crystalline atmosphere with crystalline glare and wide reflections',
  },
  industrial_deck: {
    id: 'industrial_deck',
    name: 'Industrial Deck',
    fogColor: '#120c04',
    fogDensity: 0.04,
    particleColor: '#ff9900',
    lightBeamColor: '#ffaa00',
    ambientLightColor: '#1c1306',
    directionalLightColor: '#ffb703',
    bloomIntensity: 1.5,
    contrast: 1.2,
    shadowTint: '#451a03',
    highlightTint: '#fff7ed',
    description: 'Sodium-warm and hard lighting with industrial amber glare',
  },
  open_water: {
    id: 'open_water',
    name: 'Open Water',
    fogColor: '#02131d',
    fogDensity: 0.03,
    particleColor: '#00f0ff',
    lightBeamColor: '#0284c7',
    ambientLightColor: '#032b42',
    directionalLightColor: '#38bdf8',
    bloomIntensity: 1.3,
    contrast: 1.05,
    shadowTint: '#0f172a',
    highlightTint: '#e0f2fe',
    description: 'Negative warmth for blue hour over abyssal waters',
  },
  fog_chamber: {
    id: 'fog_chamber',
    name: 'Fog Chamber',
    fogColor: '#080e1a',
    fogDensity: 0.08,
    particleColor: '#60a5fa',
    lightBeamColor: '#93c5fd',
    ambientLightColor: '#1e293b',
    directionalLightColor: '#cbd5e1',
    bloomIntensity: 2.0,
    contrast: 0.85,
    shadowTint: '#1e1b4b',
    highlightTint: '#f1f5f9',
    description: 'Maximum atmospheric bleed with dense sub-1.0 contrast volumetric fog',
  },
};
