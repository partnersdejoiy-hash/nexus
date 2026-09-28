'use client';

import React, { useRef, useState } from 'react';
import { gestureEngine } from '@/engine/GestureEngine';
import { useGestureStore } from '@/stores/useGestureStore';
import { useNexusStore } from '@/stores/useNexusStore';

export const HandTrackingFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const isCameraFeedActive = useGestureStore((s) => s.isCameraFeedActive);
  const isTrackingActive = useGestureStore((s) => s.isTrackingActive);
  const addLog = useNexusStore((s) => s.addLog);

  const [isLoading, setIsLoading] = useState(false);

  const toggleCamera = async () => {
    if (isTrackingActive) {
      gestureEngine.stopTracking();
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      addLog('info', 'GESTURE', 'Camera feed stopped');
    } else {
      setIsLoading(true);
      try {
        const initialized = await gestureEngine.initialize();
        if (!initialized) {
          addLog('error', 'GESTURE', 'MediaPipe HandLandmarker initialization failed');
          setIsLoading(false);
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          gestureEngine.startTracking(videoRef.current);
          addLog('info', 'GESTURE', 'MediaPipe Hand Tracker camera stream online');
        }
      } catch (err: any) {
        addLog('error', 'GESTURE', `Camera access error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pointer-events-auto fixed top-6 left-6 z-40 flex flex-col gap-2 font-mono">
      {/* Hidden/Visible Video Feed */}
      <div className={`relative overflow-hidden rounded-xl glass-card border border-cyan-500/30 transition-all ${
        isCameraFeedActive ? 'w-48 h-36' : 'w-0 h-0 border-none'
      }`}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
        <div className="absolute top-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-cyan-400 font-bold">
          ● MEDIAPIPE LIVE FEED
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleCamera}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-lg glass-panel px-3 py-1.5 text-xs font-bold transition-all ${
          isTrackingActive
            ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/60'
            : 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/60'
        }`}
      >
        <span>{isLoading ? '⏳ INIT TRACKER...' : isTrackingActive ? '📷 HAND TRACKING ACTIVE' : '📷 START HAND TRACKING'}</span>
      </button>
    </div>
  );
};
