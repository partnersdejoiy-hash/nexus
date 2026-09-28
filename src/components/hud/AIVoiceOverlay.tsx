'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAIStore } from '@/stores/useAIStore';
import { useNexusStore } from '@/stores/useNexusStore';
import { masterClock } from '@/engine/MasterClock';
import { audioEngine } from '@/engine/AudioEngine';

export const AIVoiceOverlay: React.FC = () => {
  const status = useAIStore((s) => s.status);
  const setStatus = useAIStore((s) => s.setStatus);
  const isWakeActive = useAIStore((s) => s.isWakeActive);
  const setWakeActive = useAIStore((s) => s.setWakeActive);
  const currentStreamingText = useAIStore((s) => s.currentStreamingText);
  const appendStreamingText = useAIStore((s) => s.appendStreamingText);
  const clearStreamingText = useAIStore((s) => s.clearStreamingText);
  const addMessage = useAIStore((s) => s.addMessage);
  const setSpeechEnvelopeLevel = useAIStore((s) => s.setSpeechEnvelopeLevel);
  const interruptAI = useAIStore((s) => s.interruptAI);

  const activeModuleId = useNexusStore((s) => s.activeModuleId);
  const addLog = useNexusStore((s) => s.addLog);

  const [inputPrompt, setInputPrompt] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }

        // Check wake phrase or transform command
        const lower = transcript.toLowerCase();

        // Phase 7 Human Form transform command local match
        if (lower.includes('transform into a human shape') || lower.includes('human form')) {
          addLog('info', 'VOICE', 'Command matched: Transform into human shape');
          masterClock.triggerHumanFormTransform('HUMAN');
          return;
        } else if (lower.includes('return to spatial mode') || lower.includes('spatial mode')) {
          addLog('info', 'VOICE', 'Command matched: Return to spatial mode');
          masterClock.triggerHumanFormTransform('SPATIAL');
          return;
        }

        if (status === 'SPEAKING' || status === 'STREAMING') {
          // Interrupt AI when user speaks!
          interruptAI();
        }

        if (event.results[0].isFinal) {
          handleSendQuery(transcript);
        }
      };

      recognitionRef.current = rec;
    }
  }, [status, interruptAI, addLog]);

  // Start/Stop mic recognition on wake toggle
  useEffect(() => {
    if (isWakeActive && recognitionRef.current) {
      try {
        recognitionRef.current.start();
        audioEngine.playGestureChime('wake');
      } catch (e) {
        console.warn('SpeechRecognition start error:', e);
      }
    } else if (!isWakeActive && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  }, [isWakeActive]);

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setStatus('THINKING');
    addMessage({ role: 'user', content: queryText });
    clearStreamingText();
    audioEngine.playGestureChime('select');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          activeModule: activeModuleId,
        }),
      });

      if (!res.body) throw new Error('No body returned from AI endpoint');

      setStatus('STREAMING');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        
        try {
          const parsed = JSON.parse(chunk);
          const token = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          fullText += token;
          appendStreamingText(token);

          // Simulate speech envelope pulse for jaw hinge
          setSpeechEnvelopeLevel(Math.random() * 0.8 + 0.2);
        } catch {
          fullText += chunk;
          appendStreamingText(chunk);
        }
      }

      setStatus('SPEAKING');
      addMessage({ role: 'assistant', content: fullText });

      // TTS synthesis
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(fullText);
        utterance.rate = 1.05;

        utterance.onboundary = () => {
          setSpeechEnvelopeLevel(Math.random() * 0.9 + 0.1);
        };

        utterance.onend = () => {
          setStatus('OFFLINE');
          setSpeechEnvelopeLevel(0);
        };

        synth.speak(utterance);
      } else {
        setTimeout(() => {
          setStatus('OFFLINE');
          setSpeechEnvelopeLevel(0);
        }, 2000);
      }
    } catch (err: any) {
      addLog('error', 'AI', `Streaming error: ${err.message}`);
      setStatus('OFFLINE');
    }
  };

  if (status === 'OFFLINE' && !isWakeActive) return null;

  return (
    <div className="pointer-events-auto fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 select-none font-mono">
      <div className="rounded-2xl glass-card border border-cyan-500/40 p-5 shadow-2xl backdrop-blur-xl">
        {/* Status Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-500"></span>
            </span>
            <span className="font-bold text-sm text-cyan-300">GEMINI NEURAL BRAIN</span>
          </div>

          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              status === 'LISTENING'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/50 animate-pulse'
                : status === 'STREAMING' || status === 'SPEAKING'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                : 'bg-purple-950 text-purple-300 border border-purple-500/50'
            }`}
          >
            ● {status}
          </span>
        </div>

        {/* Floating Holographic Text Particle Assembly Container */}
        <div className="mt-4 min-h-16 max-h-48 overflow-y-auto text-sm text-slate-100 leading-relaxed font-sans">
          {currentStreamingText ? (
            <p className="animate-fade-in text-cyan-100 tracking-wide font-medium">
              {currentStreamingText}
              <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse"></span>
            </p>
          ) : (
            <p className="text-slate-400 italic">
              {status === 'LISTENING' ? 'Listening for speech or command...' : 'Processing query context...'}
            </p>
          )}
        </div>

        {/* Text Prompt Input Bar (Fallback) */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type command ('Nexus, transform into a human shape', 'Open Stocks')..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendQuery(inputPrompt);
                setInputPrompt('');
              }
            }}
            className="w-full rounded-lg bg-slate-900/80 px-3.5 py-2 text-xs text-white border border-cyan-900 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          <button
            onClick={() => {
              handleSendQuery(inputPrompt);
              setInputPrompt('');
            }}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </div>
  );
};
