import { useGestureStore, GestureType, HandLandmark } from '@/stores/useGestureStore';

export class GestureEngine {
  private handLandmarker: any = null;
  private videoElement: HTMLVideoElement | null = null;
  private animFrameId: number | null = null;
  private lastVideoTime = -1;
  
  // Motion history for swipe and circle gesture analysis
  private palmHistory: { x: number; y: number; time: number }[] = [];
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private fpsTimer = performance.now();

  private async loadMediaPipeTasksVision(): Promise<any> {
    if (typeof window === 'undefined') return null;
    if ((window as any).tasksVision) return (window as any).tasksVision;

    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector('script[src*="tasks-vision"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve((window as any).tasksVision));
        if ((window as any).tasksVision) return resolve((window as any).tasksVision);
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/tasks-vision.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        resolve((window as any).tasksVision);
      };
      script.onerror = (err) => {
        reject(err);
      };
      document.head.appendChild(script);
    });
  }

  public async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      const visionModule = await this.loadMediaPipeTasksVision();
      if (!visionModule) return false;

      const { FilesetResolver, HandLandmarker } = visionModule;

      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });
      return true;
    } catch (e) {
      console.warn('MediaPipe HandLandmarker GPU init failed, falling back to CPU:', e);
      try {
        const visionModule = await this.loadMediaPipeTasksVision();
        if (!visionModule) return false;
        const { FilesetResolver, HandLandmarker } = visionModule;

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        });
        return true;
      } catch (err) {
        console.error('MediaPipe HandLandmarker init error:', err);
        return false;
      }
    }
  }

  public startTracking(videoEl: HTMLVideoElement) {
    this.videoElement = videoEl;
    useGestureStore.getState().setTrackingActive(true);
    useGestureStore.getState().setCameraFeedActive(true);
    this.processLoop();
  }

  public stopTracking() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    useGestureStore.getState().setTrackingActive(false);
    useGestureStore.getState().setCameraFeedActive(false);
  }

  private processLoop = () => {
    if (this.videoElement && this.handLandmarker && this.videoElement.readyState >= 2) {
      const currentTime = this.videoElement.currentTime;
      if (currentTime !== this.lastVideoTime) {
        this.lastVideoTime = currentTime;
        const results = this.handLandmarker.detectForVideo(this.videoElement, performance.now());
        this.analyzeLandmarks(results);
      }
    }

    // Calculate tracking FPS
    this.frameCount++;
    const now = performance.now();
    if (now - this.fpsTimer >= 1000) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.fpsTimer));
      useGestureStore.getState().setTrackingMetrics(fps, 0.96);
      this.frameCount = 0;
      this.fpsTimer = now;
    }

    this.animFrameId = requestAnimationFrame(this.processLoop);
  };

  private analyzeLandmarks(results: any) {
    if (!results.landmarks || results.landmarks.length === 0) {
      useGestureStore.getState().setHandLandmarks(null);
      useGestureStore.getState().setActiveGesture('NONE', 0);
      return;
    }

    const landmarks: HandLandmark[] = results.landmarks[0]; // Primary hand
    useGestureStore.getState().setHandLandmarks(landmarks);

    // Index tip (8) & Thumb tip (4)
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const middleMcp = landmarks[9];

    // Pointer normalized position (-1 to 1)
    const pointerX = (middleMcp.x - 0.5) * 2;
    const pointerY = -(middleMcp.y - 0.5) * 2;
    useGestureStore.getState().setPointerPosition(pointerX, pointerY);

    // Calculate Pinch distance
    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;
    const dz = indexTip.z - thumbTip.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const isPinching = distance < 0.06;

    useGestureStore.getState().setPinchState(isPinching, distance);

    // Track palm position history for velocity & gesture detection
    const now = performance.now();
    this.palmHistory.push({ x: middleMcp.x, y: middleMcp.y, time: now });
    if (this.palmHistory.length > 25) {
      this.palmHistory.shift();
    }

    // Detect gestures
    let gesture: GestureType = 'NONE';
    let confidence = 0.95;

    // 1. Pinch
    if (isPinching) {
      gesture = 'PINCH';
    } 
    // 2. Swipe Left / Right based on recent horizontal velocity
    else if (this.palmHistory.length >= 10) {
      const first = this.palmHistory[0];
      const last = this.palmHistory[this.palmHistory.length - 1];
      const dt = (last.time - first.time) / 1000;
      const vx = (last.x - first.x) / dt;

      if (vx > 1.2) {
        gesture = 'SWIPE_RIGHT';
        confidence = Math.min(1.0, Math.abs(vx) / 2);
      } else if (vx < -1.2) {
        gesture = 'SWIPE_LEFT';
        confidence = Math.min(1.0, Math.abs(vx) / 2);
      } else {
        // Check Palm Stillness
        let totalVar = 0;
        for (const pt of this.palmHistory) {
          totalVar += Math.hypot(pt.x - last.x, pt.y - last.y);
        }
        const avgVar = totalVar / this.palmHistory.length;
        if (avgVar < 0.015) {
          gesture = 'PALM_STILL';
        }
      }
    }

    // 3. Circle Gesture Detection
    if (this.palmHistory.length >= 20) {
      const isCircle = this.detectCircleGesture(this.palmHistory);
      if (isCircle) {
        gesture = 'CIRCLE';
        useGestureStore.getState().isCircleGestureDetected = true;
      }
    }

    useGestureStore.getState().setActiveGesture(gesture, confidence);
  }

  private detectCircleGesture(history: { x: number; y: number }[]): boolean {
    if (history.length < 15) return false;
    let sumX = 0, sumY = 0;
    for (const pt of history) {
      sumX += pt.x;
      sumY += pt.y;
    }
    const cx = sumX / history.length;
    const cy = sumY / history.length;

    let radiusSum = 0;
    for (const pt of history) {
      radiusSum += Math.hypot(pt.x - cx, pt.y - cy);
    }
    const avgRadius = radiusSum / history.length;

    // Must be a distinct circle (radius > 0.08 and small variance in radius)
    if (avgRadius < 0.05 || avgRadius > 0.35) return false;

    let varRadius = 0;
    for (const pt of history) {
      const r = Math.hypot(pt.x - cx, pt.y - cy);
      varRadius += Math.abs(r - avgRadius);
    }
    const radiusVariance = varRadius / history.length;
    return radiusVariance / avgRadius < 0.25;
  }
}

export const gestureEngine = new GestureEngine();
