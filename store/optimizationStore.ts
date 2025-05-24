import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { deviceInfo } from '@/constants/mockData';

interface OptimizationState {
  lastOptimized: string;
  optimizationHistory: {
    date: string;
    type: 'storage' | 'battery' | 'performance' | 'full';
    spaceFreed?: number; // MB
    batteryImprovement?: number; // %
    performanceImprovement?: number; // %
  }[];
  isOptimizing: boolean;
  optimizationProgress: number;
  batteryOptimized: boolean;
  storageOptimized: boolean;
  performanceOptimized: boolean;
  
  // Actions
  startOptimization: (type: 'storage' | 'battery' | 'performance' | 'full') => void;
  completeOptimization: (type: 'storage' | 'battery' | 'performance' | 'full', results: any) => void;
  resetOptimizationStatus: () => void;
  updateOptimizationProgress: (progress: number) => void;
}

export const useOptimizationStore = create<OptimizationState>()(
  persist(
    (set) => ({
      lastOptimized: deviceInfo.lastOptimized,
      optimizationHistory: [],
      isOptimizing: false,
      optimizationProgress: 0,
      batteryOptimized: false,
      storageOptimized: false,
      performanceOptimized: false,
      
      startOptimization: (type) => {
        set({ 
          isOptimizing: true, 
          optimizationProgress: 0 
        });
      },
      
      completeOptimization: (type, results) => {
        const now = new Date().toISOString();
        
        set((state) => {
          const newHistory = [
            {
              date: now,
              type,
              ...results
            },
            ...state.optimizationHistory
          ];
          
          const updates: any = {
            isOptimizing: false,
            optimizationProgress: 100,
            lastOptimized: 'Just now',
            optimizationHistory: newHistory,
          };
          
          // Set the specific optimization flag
          if (type === 'storage' || type === 'full') {
            updates.storageOptimized = true;
          }
          if (type === 'battery' || type === 'full') {
            updates.batteryOptimized = true;
          }
          if (type === 'performance' || type === 'full') {
            updates.performanceOptimized = true;
          }
          
          return updates;
        });
      },
      
      resetOptimizationStatus: () => {
        set({
          batteryOptimized: false,
          storageOptimized: false,
          performanceOptimized: false,
        });
      },
      
      updateOptimizationProgress: (progress) => {
        set({ optimizationProgress: progress });
      },
    }),
    {
      name: 'optimization-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);