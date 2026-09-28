import { create } from 'zustand';

export type AIStatus = 
  | 'OFFLINE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'STREAMING'
  | 'INTERRUPTED';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  moduleContext?: string;
}

interface AIState {
  status: AIStatus;
  isWakeActive: boolean;
  messages: AIMessage[];
  currentStreamingText: string;
  
  // Speech & Spatial Audio level
  speechEnvelopeLevel: number; // 0..1 inferred speech level for mouth hinge & visualizer
  isMicActive: boolean;
  transcriptText: string;
  
  // Actions
  setStatus: (status: AIStatus) => void;
  setWakeActive: (active: boolean) => void;
  addMessage: (message: Omit<AIMessage, 'id' | 'timestamp'>) => void;
  appendStreamingText: (token: string) => void;
  setStreamingText: (text: string) => void;
  clearStreamingText: () => void;
  setSpeechEnvelopeLevel: (level: number) => void;
  setMicActive: (active: boolean) => void;
  setTranscriptText: (text: string) => void;
  interruptAI: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  status: 'OFFLINE',
  isWakeActive: false,
  messages: [
    {
      id: '1',
      role: 'system',
      content: 'NEXUS Neural AI Brain initialized. Say "Nexus" or perform circle gesture to wake.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  currentStreamingText: '',
  speechEnvelopeLevel: 0,
  isMicActive: false,
  transcriptText: '',
  
  setStatus: (status) => set({ status }),
  setWakeActive: (active) => set({ isWakeActive: active, status: active ? 'LISTENING' : 'OFFLINE' }),
  
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  })),
  
  appendStreamingText: (token) => set((state) => ({
    currentStreamingText: state.currentStreamingText + token,
    status: 'STREAMING',
  })),
  
  setStreamingText: (text) => set({ currentStreamingText: text }),
  clearStreamingText: () => set({ currentStreamingText: '' }),
  
  setSpeechEnvelopeLevel: (level) => set({ speechEnvelopeLevel: Math.max(0, Math.min(1, level)) }),
  setMicActive: (active) => set({ isMicActive: active }),
  setTranscriptText: (text) => set({ transcriptText: text }),
  
  interruptAI: () => {
    if (get().status === 'SPEAKING' || get().status === 'STREAMING') {
      set({ status: 'INTERRUPTED', speechEnvelopeLevel: 0 });
      setTimeout(() => set({ status: 'OFFLINE' }), 1200);
    }
  },
}));
