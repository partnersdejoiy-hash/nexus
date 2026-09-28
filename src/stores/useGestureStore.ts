import { create } from 'zustand';

export type GestureType = 
  | 'NONE'
  | 'PINCH'
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'PULL'
  | 'PUSH'
  | 'PALM_STILL'
  | 'CIRCLE'
  | 'OPEN_HAND'
  | 'CLOSED_HAND';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface GestureState {
  isTrackingActive: boolean;
  handLandmarks: HandLandmark[] | null;
  pointerPosition: { x: number; y: number }; // Normalized -1..1
  
  // Gestures
  activeGesture: GestureType;
  gestureConfidence: number; // 0..1
  trackingFps: number;
  
  // Detailed tracking parameters
  isPinching: boolean;
  pinchDistance: number;
  isPalmStill: boolean;
  isCircleGestureDetected: boolean;
  
  // Camera feed active flag
  isCameraFeedActive: boolean;
  
  // Actions
  setTrackingActive: (active: boolean) => void;
  setHandLandmarks: (landmarks: HandLandmark[] | null) => void;
  setPointerPosition: (x: number, y: number) => void;
  setActiveGesture: (gesture: GestureType, confidence?: number) => void;
  setTrackingMetrics: (fps: number, confidence: number) => void;
  setPinchState: (isPinching: boolean, distance: number) => void;
  setCameraFeedActive: (active: boolean) => void;
}

export const useGestureStore = create<GestureState>((set) => ({
  isTrackingActive: false,
  handLandmarks: null,
  pointerPosition: { x: 0, y: 0 },
  
  activeGesture: 'NONE',
  gestureConfidence: 0,
  trackingFps: 0,
  
  isPinching: false,
  pinchDistance: 1.0,
  isPalmStill: false,
  isCircleGestureDetected: false,
  
  isCameraFeedActive: false,
  
  setTrackingActive: (active) => set({ isTrackingActive: active }),
  setHandLandmarks: (landmarks) => set({ handLandmarks: landmarks }),
  setPointerPosition: (x, y) => set({ pointerPosition: { x, y } }),
  setActiveGesture: (gesture, confidence = 0.95) => set({ activeGesture: gesture, gestureConfidence: confidence }),
  setTrackingMetrics: (fps, confidence) => set({ trackingFps: fps, gestureConfidence: confidence }),
  setPinchState: (isPinching, distance) => set({ isPinching, pinchDistance: distance }),
  setCameraFeedActive: (active) => set({ isCameraFeedActive: active }),
}));
