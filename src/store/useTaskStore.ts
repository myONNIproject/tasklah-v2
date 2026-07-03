import { create } from 'zustand';
import { calculateTrustScore } from '../utils/trustEngine';

export const useTaskStore = create((set) => ({
  user: {
    name: "Andrew Wong",
    role: 'doer',
    xp: 500,
    level: 1,
    trustScore: 3.5,
    stats: {
      completions: 12,
      disputes: 0,
      rating: 4.8
    }
  },
  // Simulation: When a task is completed
  completeTask: (rating: number) => set((state: any) => {
    const newXP = state.user.xp + 100;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    // Recalculate Trust
    const newTrust = calculateTrustScore({
      completionRate: 0.95,
      peerRating: rating,
      disputeFrequency: 0,
      communityStanding: 1.0
    });

    return { 
      user: { 
        ...state.user, 
        xp: newXP, 
        level: newLevel, 
        trustScore: newTrust 
      } 
    };
  }),
}));
