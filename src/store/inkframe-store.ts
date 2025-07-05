import { create } from 'zustand';

// Types
export interface Character {
  id: string;
  name: string;
  description: string;
  arc: string;
  tone: string;
  traits: string[];
  background: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export interface FeedbackScore {
  coherence: number;
  dialogue: number;
  emotionalResonance: number;
  symbolism: number;
}

export interface FeedbackRound {
  id: string;
  timestamp: Date;
  scores: FeedbackScore;
  suggestions: string[];
  sceneText: string;
}

export interface EmotionPoint {
  position: number;
  value: number;
  sentence: string;
}

export interface SceneData {
  id: string;
  prompt: string;
  generatedText: string;
  selectedCharacters: string[];
  selectedThemes: string[];
  genre: string;
  tone: string;
  sceneType: string;
  timestamp: Date;
  emotionData: EmotionPoint[];
  feedbackHistory: FeedbackRound[];
}

interface InkframeState {
  // Current session data
  currentScene: SceneData | null;
  isGenerating: boolean;
  isAnalyzing: boolean;
  
  // Memory data
  characters: Character[];
  themes: Theme[];
  
  // Actions
  setCurrentScene: (scene: SceneData | null) => void;
  setIsGenerating: (generating: boolean) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  loadMemoryData: (characters: Character[], themes: Theme[]) => void;
  addFeedbackRound: (feedback: FeedbackRound) => void;
  updateEmotionData: (emotionData: EmotionPoint[]) => void;
}

export const useInkframeStore = create<InkframeState>((set, get) => ({
  // Initial state
  currentScene: null,
  isGenerating: false,
  isAnalyzing: false,
  characters: [],
  themes: [],
  
  // Actions
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  
  loadMemoryData: (characters, themes) => set({ characters, themes }),
  
  addFeedbackRound: (feedback) => set((state) => ({
    currentScene: state.currentScene ? {
      ...state.currentScene,
      feedbackHistory: [...state.currentScene.feedbackHistory, feedback].slice(-3) // Keep last 3
    } : null
  })),
  
  updateEmotionData: (emotionData) => set((state) => ({
    currentScene: state.currentScene ? {
      ...state.currentScene,
      emotionData
    } : null
  }))
}));