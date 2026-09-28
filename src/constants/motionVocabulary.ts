export const MOTION_VOCABULARY = {
  // Spring presets for React Spring / Framer Motion / R3F interpolation
  arriving: { tension: 220, friction: 24, mass: 0.8 },
  leaving: { tension: 300, friction: 30, mass: 0.6 },
  acknowledging: { tension: 400, friction: 18, mass: 0.5 },
  reporting: { tension: 180, friction: 22, mass: 1.0 },
  drifting: { tension: 40, friction: 15, mass: 2.0 },
  orbitSpring: { tension: 160, friction: 20, mass: 1.1 },

  // Durations in milliseconds for master clock phases
  targetingDurationMs: 400,
  approachDurationMs: 800,
  settleDurationMs: 1200,

  // Boot sequence choreography timing beat
  bootBeatMs: 1500,
} as const;
