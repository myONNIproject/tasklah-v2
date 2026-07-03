import { create } from 'zustand';

interface AppState {
  xp: number;
  level: number;
  addXP: (amount: number) => void;
}

export const useStore = create<AppState>((set) => ({
  xp: 0,
  level: 1,
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    // Every 100 XP, you level up!
    const newLevel = Math.floor(newXP / 100) + 1;
    return { xp: newXP, level: newLevel };
  }),
}));
