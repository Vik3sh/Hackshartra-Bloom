// Progress Context - Manages user progress and tree growth
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TreeItem, UserInventory, TreeStage, TREE_ITEMS, STAGE_REQUIREMENTS } from '@/types/items';

interface UserProgress {
  totalPoints: number;
  level: number;
  pointsToNextLevel: number;
  completedQuizzes: number;
  completedChallenges: number;
  completedChallengeIds: string[];
  completedLessons: string[];
  completedGames: string[];
  completedSubLevels: string[];
  completedMajorLevels: string[];
  learningStreak: number;
  lastActiveDate: string;
  inventory: UserInventory;
  currentStage: TreeStage;
}

interface ProgressContextType {
  userProgress: UserProgress;
  addPoints: (points: number) => void;
  addItem: (itemId: string, quantity?: number) => void;
  completeQuiz: (quizId: string, points: number, rewards?: { [itemId: string]: number }) => void;
  completeChallenge: (challengeId: string, points: number, rewards?: { [itemId: string]: number }) => void;
  completeLesson: (lessonId: string, points: number, rewards?: { [itemId: string]: number }) => void;
  completeGame: (gameId: string, points: number, rewards?: { [itemId: string]: number }) => void;
  completeBoss: (bossId: string, points: number, rewards?: { [itemId: string]: number }) => void;
  updateStreak: () => void;
  resetProgress: () => void;
  canUpgradeStage: (stage: TreeStage) => boolean;
  upgradeStage: (stage: TreeStage) => boolean;
  addItems: (items: { [itemId: string]: number }) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    pointsToNextLevel: 100,
    completedQuizzes: 0,
    completedChallenges: 0,
    completedChallengeIds: [],
    completedLessons: [],
    completedGames: [],
    completedSubLevels: [],
    completedMajorLevels: [],
    learningStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    inventory: {
      items: {},
      currentStage: 'pot',
      stageProgress: {}
    },
    currentStage: 'pot'
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('ecoLearnProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUserProgress(parsed);
      } catch (error) {
        console.error('Error loading progress from localStorage:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ecoLearnProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Check if user can upgrade to a specific stage
  const canUpgradeStage = (stage: TreeStage): boolean => {
    const requirements = STAGE_REQUIREMENTS[stage];
    const currentItems = userProgress.inventory?.items || {};
    
    if (!requirements || !currentItems) {
      return false;
    }
    
    for (const [itemId, requiredQuantity] of Object.entries(requirements)) {
      if ((currentItems[itemId] || 0) < requiredQuantity) {
        return false;
      }
    }
    return true;
  };

  // Add items to inventory
  const addItems = (items: { [itemId: string]: number }) => {
    setUserProgress(prev => {
      const newItems = { ...(prev.inventory?.items || {}) };
      
      // Add items
      for (const [itemId, quantity] of Object.entries(items)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }
      
      return {
        ...prev,
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  // Upgrade tree stage if requirements are met
  const upgradeStage = (stage: TreeStage): boolean => {
    if (!canUpgradeStage(stage)) {
      return false;
    }

    const requirements = STAGE_REQUIREMENTS[stage];
    if (!requirements) {
      return false;
    }

    setUserProgress(prev => {
      const newItems = { ...(prev.inventory?.items || {}) };
      
      // Consume required items
      for (const [itemId, requiredQuantity] of Object.entries(requirements)) {
        newItems[itemId] = (newItems[itemId] || 0) - requiredQuantity;
      }

      return {
        ...prev,
        currentStage: stage,
        inventory: {
          ...prev.inventory,
          items: newItems,
          currentStage: stage
        }
      };
    });

    return true;
  };

  // Calculate level based on total points
  const calculateLevel = (points: number): number => {
    return Math.floor(points / 100) + 1;
  };

  // Calculate points needed for next level
  const calculatePointsToNextLevel = (points: number): number => {
    const currentLevel = calculateLevel(points);
    const nextLevelPoints = currentLevel * 100;
    return nextLevelPoints - points;
  };

  const addPoints = (points: number) => {
    setUserProgress(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel
      };
    });
  };

  const addItem = (itemId: string, quantity: number = 1) => {
    setUserProgress(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        items: {
          ...(prev.inventory?.items || {}),
          [itemId]: ((prev.inventory?.items?.[itemId] || 0) + quantity)
        }
      }
    }));
  };

  const completeQuiz = (quizId: string, points: number, rewards: { [itemId: string]: number } = {}) => {
    setUserProgress(prev => {
      // Check if quiz was already completed
      const completedQuizzes = localStorage.getItem('completedQuizzes') || '[]';
      const quizList = JSON.parse(completedQuizzes);
      
      if (quizList.includes(quizId)) {
        return prev; // Quiz already completed
      }

      // Add quiz to completed list
      quizList.push(quizId);
      localStorage.setItem('completedQuizzes', JSON.stringify(quizList));

      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      // Add reward items
      const newItems = { ...prev.inventory.items };
      for (const [itemId, quantity] of Object.entries(rewards)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel,
        completedQuizzes: prev.completedQuizzes + 1,
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  const completeChallenge = (challengeId: string, points: number, rewards: { [itemId: string]: number } = {}) => {
    setUserProgress(prev => {
      // Check if challenge was already completed
      const completedChallenges = localStorage.getItem('completedChallenges') || '[]';
      const challengeList = JSON.parse(completedChallenges);
      
      if (challengeList.includes(challengeId)) {
        return prev; // Challenge already completed
      }

      // Add challenge to completed list
      challengeList.push(challengeId);
      localStorage.setItem('completedChallenges', JSON.stringify(challengeList));

      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      // Add reward items
      const newItems = { ...prev.inventory.items };
      for (const [itemId, quantity] of Object.entries(rewards)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel,
        completedChallenges: prev.completedChallenges + 1,
        completedChallengeIds: [...prev.completedChallengeIds, challengeId],
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  const completeLesson = (lessonId: string, points: number, rewards: { [itemId: string]: number } = {}) => {
    setUserProgress(prev => {
      // Check if lesson was already completed
      if (prev.completedLessons.includes(lessonId)) {
        return prev; // Lesson already completed
      }

      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      // Add reward items
      const newItems = { ...prev.inventory.items };
      for (const [itemId, quantity] of Object.entries(rewards)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel,
        completedLessons: [...prev.completedLessons, lessonId],
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  const completeGame = (gameId: string, points: number, rewards: { [itemId: string]: number } = {}) => {
    setUserProgress(prev => {
      // Check if game was already completed
      if (prev.completedGames.includes(gameId)) {
        return prev; // Game already completed
      }

      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      // Add reward items
      const newItems = { ...prev.inventory.items };
      for (const [itemId, quantity] of Object.entries(rewards)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel,
        completedGames: [...prev.completedGames, gameId],
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  const completeBoss = (bossId: string, points: number, rewards: { [itemId: string]: number } = {}) => {
    setUserProgress(prev => {
      // Check if boss was already completed
      if (prev.completedMajorLevels.includes(bossId)) {
        return prev; // Boss already completed
      }

      const newTotalPoints = prev.totalPoints + points;
      const newLevel = calculateLevel(newTotalPoints);
      const newPointsToNextLevel = calculatePointsToNextLevel(newTotalPoints);

      // Add reward items
      const newItems = { ...prev.inventory.items };
      for (const [itemId, quantity] of Object.entries(rewards)) {
        newItems[itemId] = (newItems[itemId] || 0) + quantity;
      }

      return {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        pointsToNextLevel: newPointsToNextLevel,
        completedMajorLevels: [...prev.completedMajorLevels, bossId],
        inventory: {
          ...prev.inventory,
          items: newItems
        }
      };
    });
  };

  const updateStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    setUserProgress(prev => {
      if (prev.lastActiveDate === today) {
        return prev; // Already updated today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prev.learningStreak;
      if (prev.lastActiveDate === yesterdayStr) {
        newStreak += 1; // Consecutive day
      } else if (prev.lastActiveDate !== today) {
        newStreak = 1; // Reset streak
      }

      return {
        ...prev,
        learningStreak: newStreak,
        lastActiveDate: today
      };
    });
  };

  const resetProgress = () => {
    setUserProgress({
      totalPoints: 0,
      level: 1,
      pointsToNextLevel: 100,
      completedQuizzes: 0,
      completedChallenges: 0,
      learningStreak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      inventory: {
        items: {},
        currentStage: 'pot',
        stageProgress: {}
      }
    });
    localStorage.removeItem('completedQuizzes');
    localStorage.removeItem('completedChallenges');
  };

  const value: ProgressContextType = {
    userProgress,
    addPoints,
    addItem,
    completeQuiz,
    completeChallenge,
    completeLesson,
    completeGame,
    completeBoss,
    updateStreak,
    resetProgress,
    canUpgradeStage,
    upgradeStage,
    addItems
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
