import { create } from 'zustand';

export const useZyniqStore = create((set, get) => ({
  // UI State
  currentScreen: 'main', // 'main', 'orb', 'blueprint', 'result', 'final'
  isExploring: false,
  hoveredOrb: null,
  selectedOrb: null,
  
  // User Data
  userData: {},
  exploredOrbs: new Set(),
  initialBlueprint: null,
  
  // Audio
  audioContext: null,
  masterGain: null,
  
  // Progress
  progress: 0,
  
  // Actions
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  setIsExploring: (exploring) => set({ isExploring: exploring }),
  setHoveredOrb: (orb) => set({ hoveredOrb: orb }),
  setSelectedOrb: (orb) => set({ selectedOrb: orb }),
  
  addUserData: (key, value) => set((state) => ({
    userData: { ...state.userData, [key]: value }
  })),
  
  addExploredOrb: (orbId) => set((state) => {
    const newExploredOrbs = new Set(state.exploredOrbs);
    newExploredOrbs.add(orbId);
    const progress = (newExploredOrbs.size / 5) * 100; // 5 total orbs
    return {
      exploredOrbs: newExploredOrbs,
      progress
    };
  }),
  
  setInitialBlueprint: (blueprint) => set({ initialBlueprint: blueprint }),
  
  initializeAudio: () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3;
      masterGain.connect(audioContext.destination);
      
      set({ audioContext, masterGain });
      
      // Play ambient sound
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, audioContext.currentTime);
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      osc.connect(gain).connect(masterGain);
      osc.start();
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  },
  
  playSound: (type) => {
    const { audioContext, masterGain } = get();
    if (!audioContext || !masterGain) return;
    
    const now = audioContext.currentTime;
    
    if (type === 'hover') {
      const osc = audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      osc.connect(gain).connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'connect') {
      const osc1 = audioContext.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(50, now);
      osc1.frequency.exponentialRampToValueAtTime(150, now + 0.2);
      const gain1 = audioContext.createGain();
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      osc1.connect(gain1).connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.3);
    }
  },
  
  resetState: () => set({
    currentScreen: 'main',
    isExploring: false,
    hoveredOrb: null,
    selectedOrb: null,
    userData: {},
    exploredOrbs: new Set(),
    initialBlueprint: null,
    progress: 0
  })
}));