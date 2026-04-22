import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  knownWords: Record<string, boolean>; // word id -> true
  learningWords: Record<string, boolean>; // word id -> true
  quizStats: {
    totalQuizzes: number;
    totalCorrect: number;
    totalQuestions: number;
    currentStreak: number;
    bestStreak: number;
    lastQuizDate: string | null;
    recentScores: number[]; // percentages
  };
  hasSeenOnboarding: boolean;
  markWordKnown: (id: string) => void;
  markWordLearning: (id: string) => void;
  recordQuizResult: (correct: number, total: number) => void;
  completeOnboarding: () => void;
  resetProgress: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      knownWords: {},
      learningWords: {},
      quizStats: {
        totalQuizzes: 0,
        totalCorrect: 0,
        totalQuestions: 0,
        currentStreak: 0,
        bestStreak: 0,
        lastQuizDate: null,
        recentScores: [],
      },
      hasSeenOnboarding: false,

      markWordKnown: (id) =>
        set((state) => {
          const newLearning = { ...state.learningWords };
          delete newLearning[id];
          return {
            knownWords: { ...state.knownWords, [id]: true },
            learningWords: newLearning,
          };
        }),

      markWordLearning: (id) =>
        set((state) => {
          const newKnown = { ...state.knownWords };
          delete newKnown[id];
          return {
            learningWords: { ...state.learningWords, [id]: true },
            knownWords: newKnown,
          };
        }),

      recordQuizResult: (correct, total) =>
        set((state) => {
          const today = new Date().toDateString();
          const lastDate = state.quizStats.lastQuizDate;
          let newStreak = state.quizStats.currentStreak;
          
          if (lastDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate === yesterday.toDateString()) {
              newStreak += 1;
            } else {
              newStreak = 1;
            }
          }

          const score = Math.round((correct / total) * 100);

          return {
            quizStats: {
              totalQuizzes: state.quizStats.totalQuizzes + 1,
              totalCorrect: state.quizStats.totalCorrect + correct,
              totalQuestions: state.quizStats.totalQuestions + total,
              currentStreak: newStreak,
              bestStreak: Math.max(newStreak, state.quizStats.bestStreak),
              lastQuizDate: today,
              recentScores: [...state.quizStats.recentScores, score].slice(-5),
            },
          };
        }),

      completeOnboarding: () => set({ hasSeenOnboarding: true }),

      resetProgress: () =>
        set({
          knownWords: {},
          learningWords: {},
          quizStats: {
            totalQuizzes: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            currentStreak: 0,
            bestStreak: 0,
            lastQuizDate: null,
            recentScores: [],
          },
          hasSeenOnboarding: false,
        }),
    }),
    {
      name: 'nihongo-n5-progress',
    }
  )
);
