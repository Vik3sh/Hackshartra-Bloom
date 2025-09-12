import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface LessonProgress {
  completedLessons: string[];
  completedModules: string[];
  currentModule: string | null;
  currentLesson: string | null;
  unlockedModules: string[];
  unlockedLessons: string[];
  moduleProgress: { [moduleId: string]: number }; // percentage completion
  lessonProgress: { [lessonId: string]: number }; // percentage completion
}

interface LessonProgressionContextType {
  lessonProgress: LessonProgress;
  completeLesson: (lessonId: string, moduleId: string) => void;
  completeModule: (moduleId: string) => void;
  unlockNextLesson: (moduleId: string) => void;
  unlockNextModule: () => void;
  canAccessLesson: (lessonId: string, moduleId: string) => boolean;
  canAccessModule: (moduleId: string) => boolean;
  getModuleProgress: (moduleId: string) => number;
  getLessonProgress: (lessonId: string) => number;
  resetProgress: () => void;
}

const LessonProgressionContext = createContext<LessonProgressionContextType | undefined>(undefined);

interface LessonProgressionProviderProps {
  children: ReactNode;
}

// Define lesson and module dependencies based on actual lesson IDs
const LESSON_DEPENDENCIES = {
  'climate-1': { prerequisites: [], unlocks: ['climate-2'] },
  'climate-2': { prerequisites: ['climate-1'], unlocks: ['climate-3'] },
  'climate-3': { prerequisites: ['climate-2'], unlocks: ['climate-4'] },
  'climate-4': { prerequisites: ['climate-3'], unlocks: ['climate-5'] },
  'climate-5': { prerequisites: ['climate-4'], unlocks: ['waste-1'] },
  
  'waste-1': { prerequisites: ['climate-5'], unlocks: ['waste-2'] },
  'waste-2': { prerequisites: ['waste-1'], unlocks: ['waste-3'] },
  'waste-3': { prerequisites: ['waste-2'], unlocks: ['waste-4'] },
  'waste-4': { prerequisites: ['waste-3'], unlocks: ['waste-5'] },
  'waste-5': { prerequisites: ['waste-4'], unlocks: ['energy-1'] },
  
  'energy-1': { prerequisites: ['waste-5'], unlocks: ['energy-2'] },
  'energy-2': { prerequisites: ['energy-1'], unlocks: ['energy-3'] },
  'energy-3': { prerequisites: ['energy-2'], unlocks: ['energy-4'] },
  'energy-4': { prerequisites: ['energy-3'], unlocks: ['energy-5'] },
  'energy-5': { prerequisites: ['energy-4'], unlocks: ['conservation-1'] },
  
  'conservation-1': { prerequisites: ['energy-5'], unlocks: ['conservation-2'] },
  'conservation-2': { prerequisites: ['conservation-1'], unlocks: ['conservation-3'] },
  'conservation-3': { prerequisites: ['conservation-2'], unlocks: ['conservation-4'] },
  'conservation-4': { prerequisites: ['conservation-3'], unlocks: ['conservation-5'] },
  'conservation-5': { prerequisites: ['conservation-4'], unlocks: [] },
};

const MODULE_DEPENDENCIES = {
  'climate-change': { prerequisites: [], unlocks: ['waste-management'] },
  'waste-management': { prerequisites: ['climate-change'], unlocks: ['renewable-energy'] },
  'renewable-energy': { prerequisites: ['waste-management'], unlocks: ['conservation'] },
  'conservation': { prerequisites: ['renewable-energy'], unlocks: [] },
};

const MODULE_LESSONS = {
  'climate-change': ['climate-1', 'climate-2', 'climate-3', 'climate-4', 'climate-5'],
  'waste-management': ['waste-1', 'waste-2', 'waste-3', 'waste-4', 'waste-5'],
  'renewable-energy': ['energy-1', 'energy-2', 'energy-3', 'energy-4', 'energy-5'],
  'conservation': ['conservation-1', 'conservation-2', 'conservation-3', 'conservation-4', 'conservation-5'],
};

export const LessonProgressionProvider: React.FC<LessonProgressionProviderProps> = ({ children }) => {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>(() => {
    const saved = localStorage.getItem('lessonProgress');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      completedLessons: [],
      completedModules: [],
      currentModule: 'climate-change',
      currentLesson: 'climate-1',
      unlockedModules: ['climate-change'],
      unlockedLessons: ['climate-1'],
      moduleProgress: {},
      lessonProgress: {},
    };
  });

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  const completeLesson = (lessonId: string, moduleId: string) => {
    setLessonProgress(prev => {
      const newProgress = { ...prev };
      
      // Add to completed lessons if not already completed
      if (!newProgress.completedLessons.includes(lessonId)) {
        newProgress.completedLessons.push(lessonId);
      }
      
      // Set lesson progress to 100%
      newProgress.lessonProgress[lessonId] = 100;
      
      // Update module progress
      const moduleLessons = MODULE_LESSONS[moduleId] || [];
      const completedModuleLessons = moduleLessons.filter(lesson => 
        newProgress.completedLessons.includes(lesson)
      );
      newProgress.moduleProgress[moduleId] = (completedModuleLessons.length / moduleLessons.length) * 100;
      
      // Unlock next lesson in the same module
      const lessonDeps = LESSON_DEPENDENCIES[lessonId];
      if (lessonDeps?.unlocks) {
        lessonDeps.unlocks.forEach(unlockedLesson => {
          if (!newProgress.unlockedLessons.includes(unlockedLesson)) {
            newProgress.unlockedLessons.push(unlockedLesson);
          }
        });
      }
      
      // Update current lesson
      const nextLesson = lessonDeps?.unlocks?.[0];
      if (nextLesson) {
        newProgress.currentLesson = nextLesson;
      }
      
      // Check if module is completed
      if (newProgress.moduleProgress[moduleId] === 100) {
        completeModule(moduleId);
      }
      
      return newProgress;
    });
  };

  const completeModule = (moduleId: string) => {
    setLessonProgress(prev => {
      const newProgress = { ...prev };
      
      if (!newProgress.completedModules.includes(moduleId)) {
        newProgress.completedModules.push(moduleId);
      }
      
      // Unlock next module
      const moduleDeps = MODULE_DEPENDENCIES[moduleId];
      if (moduleDeps?.unlocks) {
        moduleDeps.unlocks.forEach(unlockedModule => {
          if (!newProgress.unlockedModules.includes(unlockedModule)) {
            newProgress.unlockedModules.push(unlockedModule);
          }
        });
      }
      
      // Update current module
      const nextModule = moduleDeps?.unlocks?.[0];
      if (nextModule) {
        newProgress.currentModule = nextModule;
        // Set first lesson of new module as current
        const firstLesson = MODULE_LESSONS[nextModule]?.[0];
        if (firstLesson) {
          newProgress.currentLesson = firstLesson;
        }
      }
      
      return newProgress;
    });
  };

  const unlockNextLesson = (moduleId: string) => {
    // This is handled automatically in completeLesson
  };

  const unlockNextModule = () => {
    // This is handled automatically in completeModule
  };

  const canAccessLesson = (lessonId: string, moduleId: string): boolean => {
    // Check if module is unlocked
    if (!lessonProgress.unlockedModules.includes(moduleId)) {
      return false;
    }
    
    // Check prerequisites first
    const lessonDeps = LESSON_DEPENDENCIES[lessonId];
    if (lessonDeps?.prerequisites && lessonDeps.prerequisites.length > 0) {
      // If there are prerequisites, check if they're completed
      return lessonDeps.prerequisites.every(prereq => 
        lessonProgress.completedLessons.includes(prereq)
      );
    }
    
    // If no prerequisites, check if lesson is unlocked OR if it's the first lesson in a module
    if (lessonProgress.unlockedLessons.includes(lessonId)) {
      return true;
    }
    
    // Special case: first lesson of each module should be accessible
    const isFirstLessonInModule = (
      (moduleId === 'climate-change' && lessonId === 'climate-1') ||
      (moduleId === 'waste-management' && lessonId === 'waste-1') ||
      (moduleId === 'renewable-energy' && lessonId === 'energy-1') ||
      (moduleId === 'conservation' && lessonId === 'conservation-1')
    );
    
    return isFirstLessonInModule;
  };

  const canAccessModule = (moduleId: string): boolean => {
    // Check if module is unlocked
    if (!lessonProgress.unlockedModules.includes(moduleId)) {
      return false;
    }
    
    // Check prerequisites
    const moduleDeps = MODULE_DEPENDENCIES[moduleId];
    if (moduleDeps?.prerequisites) {
      return moduleDeps.prerequisites.every(prereq => 
        lessonProgress.completedModules.includes(prereq)
      );
    }
    
    return true;
  };

  const getModuleProgress = (moduleId: string): number => {
    return lessonProgress.moduleProgress[moduleId] || 0;
  };

  const getLessonProgress = (lessonId: string): number => {
    return lessonProgress.lessonProgress[lessonId] || 0;
  };

  const resetProgress = () => {
    setLessonProgress({
      completedLessons: [],
      completedModules: [],
      currentModule: 'climate-change',
      currentLesson: 'climate-1',
      unlockedModules: ['climate-change'],
      unlockedLessons: ['climate-1'],
      moduleProgress: {},
      lessonProgress: {},
    });
  };

  const value: LessonProgressionContextType = {
    lessonProgress,
    completeLesson,
    completeModule,
    unlockNextLesson,
    unlockNextModule,
    canAccessLesson,
    canAccessModule,
    getModuleProgress,
    getLessonProgress,
    resetProgress,
  };

  return (
    <LessonProgressionContext.Provider value={value}>
      {children}
    </LessonProgressionContext.Provider>
  );
};

export const useLessonProgression = (): LessonProgressionContextType => {
  const context = useContext(LessonProgressionContext);
  if (context === undefined) {
    throw new Error('useLessonProgression must be used within a LessonProgressionProvider');
  }
  return context;
};
