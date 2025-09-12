// Lesson-Connected Quest System
// Each lesson unlocks specific related quests and boss battles

export interface LessonQuest {
  id: string;
  lessonId: string; // The lesson that unlocks this quest
  title: string;
  description: string;
  type: 'simulation' | 'puzzle' | 'action' | 'strategy' | 'quiz';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number; // in minutes
  points: number;
  rewards: { [itemId: string]: number };
  instructions: string;
  objectives: string[];
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[]; // lesson IDs that must be completed first
  questTheme: string;
  learningConnection: string; // How this quest reinforces the lesson
}

export interface LessonBoss {
  id: string;
  lessonId: string; // The lesson this boss tests
  title: string;
  description: string;
  difficulty: 'medium' | 'hard' | 'extreme';
  duration: number; // in minutes
  points: number;
  rewards: { [itemId: string]: number };
  instructions: string;
  objectives: string[];
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[]; // All quests for this lesson must be completed
  bossType: 'quiz' | 'simulation' | 'puzzle' | 'action';
  bossTheme: string;
  learningConnection: string; // How this boss tests the lesson knowledge
}

export interface LessonQuestModule {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  theme: string;
  quests: LessonQuest[];
  boss: LessonBoss;
  isCompleted: boolean;
  isLocked: boolean;
  totalQuests: number;
  completedQuests: number;
  progress: number; // percentage
}

// Quest modules connected to specific lessons
export const LESSON_QUEST_MODULES: LessonQuestModule[] = [
  {
    id: 'climate-lesson-quests',
    lessonId: 'climate-1', // Introduction to Climate Change lesson
    title: 'Climate Change Quest',
    description: 'Apply your climate knowledge in interactive quests',
    icon: '🌍',
    color: 'red',
    theme: 'A mystical realm where climate forces battle for control',
    isCompleted: false,
    isLocked: false,
    totalQuests: 3,
    completedQuests: 0,
    progress: 0,
    quests: [
      {
        id: 'climate-quest-1',
        lessonId: 'climate-1',
        title: 'Temperature Rising Challenge',
        description: 'Help forest creatures adapt to rising temperatures using your climate knowledge',
        type: 'simulation',
        difficulty: 'easy',
        duration: 15,
        points: 50,
        rewards: { seed: 1, water: 1 },
        instructions: 'Use your climate change knowledge to help animals find suitable habitats as temperatures rise',
        objectives: [
          'Keep 5 animals comfortable using temperature controls',
          'Apply greenhouse effect knowledge to maintain forest balance',
          'Learn practical temperature effects on ecosystems'
        ],
        isCompleted: false,
        isLocked: false,
        prerequisites: ['climate-1'],
        questTheme: 'Forest temperature management simulation',
        learningConnection: 'Reinforces understanding of global warming effects on wildlife'
      },
      {
        id: 'climate-quest-2',
        lessonId: 'climate-1',
        title: 'Greenhouse Gas Puzzle',
        description: 'Solve puzzles using your knowledge of greenhouse gases and their effects',
        type: 'puzzle',
        difficulty: 'easy',
        duration: 12,
        points: 40,
        rewards: { sunlight: 1, nutrients: 1 },
        instructions: 'Match greenhouse gases with their effects based on your lesson knowledge',
        objectives: [
          'Identify 3 greenhouse gases from your lesson',
          'Match effects correctly using climate science',
          'Complete in under 12 minutes'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['climate-1', 'climate-quest-1'],
        questTheme: 'Interactive greenhouse gas matching game',
        learningConnection: 'Tests understanding of greenhouse gas properties and effects'
      },
      {
        id: 'climate-quest-3',
        lessonId: 'climate-1',
        title: 'Climate Impact Simulator',
        description: 'Simulate climate change impacts using your learned knowledge',
        type: 'simulation',
        difficulty: 'medium',
        duration: 20,
        points: 70,
        rewards: { seed: 2, water: 2, sunlight: 1 },
        instructions: 'Apply your climate change knowledge to predict and manage environmental impacts',
        objectives: [
          'Predict climate change effects on different regions',
          'Implement solutions based on lesson concepts',
          'Demonstrate understanding of climate science'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['climate-1', 'climate-quest-2'],
        questTheme: 'Climate impact prediction and management',
        learningConnection: 'Applies climate change knowledge to real-world scenarios'
      }
    ],
    boss: {
      id: 'climate-lesson-boss',
      lessonId: 'climate-1',
      title: 'The Climate Guardian',
      description: 'Face the ultimate test of your climate change knowledge',
      difficulty: 'hard',
      duration: 30,
      points: 150,
      rewards: { seed: 5, water: 3, sunlight: 3, nutrients: 2, fertilizer: 1 },
      instructions: 'Complete a comprehensive climate change challenge using all your learned knowledge',
      objectives: [
        'Answer 20 climate questions correctly',
        'Complete climate simulation using lesson concepts',
        'Prove mastery of climate change knowledge'
      ],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['climate-quest-1', 'climate-quest-2', 'climate-quest-3'],
      bossType: 'quiz',
      bossTheme: 'A powerful guardian who tests your complete climate knowledge',
      learningConnection: 'Comprehensive test of all climate change concepts from the lesson'
    }
  },
  {
    id: 'waste-lesson-quests',
    lessonId: 'waste-1', // Understanding Waste lesson
    title: 'Waste Management Quest',
    description: 'Master waste management through hands-on quests',
    icon: '🗑️',
    color: 'green',
    theme: 'A magical realm where waste transforms into valuable resources',
    isCompleted: false,
    isLocked: true, // Locked until waste-1 lesson is completed
    totalQuests: 3,
    completedQuests: 0,
    progress: 0,
    quests: [
      {
        id: 'waste-quest-1',
        lessonId: 'waste-1',
        title: 'Waste Sorting Master',
        description: 'Apply your waste knowledge to sort different types of waste correctly',
        type: 'action',
        difficulty: 'easy',
        duration: 10,
        points: 40,
        rewards: { seed: 1, water: 1 },
        instructions: 'Use your waste management knowledge to sort items into correct recycling bins',
        objectives: [
          'Sort 20 items correctly using lesson knowledge',
          'Learn practical recycling rules',
          'Avoid contamination using proper techniques'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['waste-1'],
        questTheme: 'Interactive waste sorting challenge',
        learningConnection: 'Applies waste classification knowledge from the lesson'
      },
      {
        id: 'waste-quest-2',
        lessonId: 'waste-1',
        title: 'Recycling Process Puzzle',
        description: 'Solve puzzles about recycling processes using your waste knowledge',
        type: 'puzzle',
        difficulty: 'medium',
        duration: 15,
        points: 60,
        rewards: { sunlight: 1, nutrients: 2 },
        instructions: 'Arrange recycling steps in correct order using your waste management knowledge',
        objectives: [
          'Complete 3 recycling processes using lesson concepts',
          'Understand material flows from your studies',
          'Learn about circular economy principles'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['waste-1', 'waste-quest-1'],
        questTheme: 'Recycling process sequencing puzzle',
        learningConnection: 'Tests understanding of waste processing and circular economy'
      },
      {
        id: 'waste-quest-3',
        lessonId: 'waste-1',
        title: 'Composting Simulator',
        description: 'Manage a composting system using your waste decomposition knowledge',
        type: 'simulation',
        difficulty: 'medium',
        duration: 25,
        points: 80,
        rewards: { seed: 3, water: 2, nutrients: 3 },
        instructions: 'Apply your waste management knowledge to create quality compost',
        objectives: [
          'Create quality compost using proper techniques',
          'Maintain composting conditions based on lesson knowledge',
          'Learn practical composting science'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['waste-1', 'waste-quest-2'],
        questTheme: 'Composting system management simulation',
        learningConnection: 'Applies organic waste management concepts from the lesson'
      }
    ],
    boss: {
      id: 'waste-lesson-boss',
      lessonId: 'waste-1',
      title: 'The Waste Wizard',
      description: 'Face the Waste Wizard in the ultimate waste management challenge',
      difficulty: 'hard',
      duration: 25,
      points: 120,
      rewards: { seed: 4, water: 2, sunlight: 2, nutrients: 3, fertilizer: 1 },
      instructions: 'Complete waste management challenges using all your learned knowledge',
      objectives: [
        'Master waste sorting using lesson concepts',
        'Complete composting challenge with proper techniques',
        'Design zero-waste system using waste knowledge'
      ],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['waste-quest-1', 'waste-quest-2', 'waste-quest-3'],
      bossType: 'simulation',
      bossTheme: 'A wise wizard who tests your complete waste management knowledge',
      learningConnection: 'Comprehensive test of all waste management concepts from the lesson'
    }
  },
  {
    id: 'energy-lesson-quests',
    lessonId: 'energy-1', // Introduction to Renewable Energy lesson
    title: 'Renewable Energy Quest',
    description: 'Build and manage renewable energy systems using your knowledge',
    icon: '⚡',
    color: 'yellow',
    theme: 'An empire powered by clean, renewable energy sources',
    isCompleted: false,
    isLocked: true, // Locked until energy-1 lesson is completed
    totalQuests: 4,
    completedQuests: 0,
    progress: 0,
    quests: [
      {
        id: 'energy-quest-1',
        lessonId: 'energy-1',
        title: 'Solar City Builder',
        description: 'Design solar energy systems using your renewable energy knowledge',
        type: 'strategy',
        difficulty: 'medium',
        duration: 30,
        points: 100,
        rewards: { seed: 2, water: 1, sunlight: 4 },
        instructions: 'Apply your solar energy knowledge to design efficient solar-powered cities',
        objectives: [
          'Power entire city with solar using lesson concepts',
          'Optimize panel placement based on energy knowledge',
          'Manage energy storage using renewable energy principles'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['energy-1'],
        questTheme: 'Solar energy system design and management',
        learningConnection: 'Applies solar energy concepts from the lesson to real-world scenarios'
      },
      {
        id: 'energy-quest-2',
        lessonId: 'energy-1',
        title: 'Wind Farm Simulator',
        description: 'Build wind energy farms using your renewable energy knowledge',
        type: 'simulation',
        difficulty: 'medium',
        duration: 25,
        points: 90,
        rewards: { seed: 1, water: 2, sunlight: 2 },
        instructions: 'Use your wind energy knowledge to optimize wind farm placement and operation',
        objectives: [
          'Maximize wind energy output using lesson concepts',
          'Minimize environmental impact with proper planning',
          'Balance energy grid using renewable energy knowledge'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['energy-1', 'energy-quest-1'],
        questTheme: 'Wind energy farm optimization simulation',
        learningConnection: 'Tests understanding of wind energy principles and environmental considerations'
      },
      {
        id: 'energy-quest-3',
        lessonId: 'energy-1',
        title: 'Energy Storage Challenge',
        description: 'Manage energy storage systems using your renewable energy knowledge',
        type: 'strategy',
        difficulty: 'hard',
        duration: 35,
        points: 120,
        rewards: { seed: 3, water: 3, sunlight: 3, nutrients: 2 },
        instructions: 'Apply your energy storage knowledge to create reliable renewable energy systems',
        objectives: [
          'Design efficient energy storage using lesson concepts',
          'Balance supply and demand with renewable energy',
          'Create reliable grid systems using energy knowledge'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['energy-1', 'energy-quest-2'],
        questTheme: 'Energy storage and grid management strategy',
        learningConnection: 'Applies energy storage and grid management concepts from the lesson'
      },
      {
        id: 'energy-quest-4',
        lessonId: 'energy-1',
        title: 'Renewable Energy Quiz',
        description: 'Test your renewable energy knowledge in an interactive quiz',
        type: 'quiz',
        difficulty: 'medium',
        duration: 20,
        points: 80,
        rewards: { seed: 2, water: 2, sunlight: 2, nutrients: 1 },
        instructions: 'Answer questions about renewable energy using your lesson knowledge',
        objectives: [
          'Answer 15 renewable energy questions correctly',
          'Apply lesson concepts to practical scenarios',
          'Demonstrate understanding of clean energy principles'
        ],
        isCompleted: false,
        isLocked: true,
        prerequisites: ['energy-1', 'energy-quest-3'],
        questTheme: 'Comprehensive renewable energy knowledge test',
        learningConnection: 'Tests comprehensive understanding of renewable energy concepts from the lesson'
      }
    ],
    boss: {
      id: 'energy-lesson-boss',
      lessonId: 'energy-1',
      title: 'The Energy Master',
      description: 'Face the Energy Master in the ultimate renewable energy challenge',
      difficulty: 'extreme',
      duration: 45,
      points: 200,
      rewards: { seed: 8, water: 4, sunlight: 6, nutrients: 4, fertilizer: 2, love: 1 },
      instructions: 'Design and implement a complete renewable energy system using all your knowledge',
      objectives: [
        'Create 100% renewable energy system using lesson concepts',
        'Optimize energy storage with renewable energy knowledge',
        'Prove mastery of renewable energy principles'
      ],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['energy-quest-1', 'energy-quest-2', 'energy-quest-3', 'energy-quest-4'],
      bossType: 'strategy',
      bossTheme: 'The ultimate renewable energy challenge to prove your mastery',
      learningConnection: 'Comprehensive test of all renewable energy concepts from the lesson'
    }
  }
];

// Helper functions
export const getQuestModuleByLessonId = (lessonId: string): LessonQuestModule | undefined => {
  return LESSON_QUEST_MODULES.find(module => module.lessonId === lessonId);
};

export const getQuestById = (questId: string): LessonQuest | undefined => {
  for (const module of LESSON_QUEST_MODULES) {
    const quest = module.quests.find(q => q.id === questId);
    if (quest) return quest;
  }
  return undefined;
};

export const getBossById = (bossId: string): LessonBoss | undefined => {
  for (const module of LESSON_QUEST_MODULES) {
    if (module.boss.id === bossId) return module.boss;
  }
  return undefined;
};

export const canAccessQuest = (questId: string, completedLessons: string[] = [], completedQuests: string[] = []): boolean => {
  const quest = getQuestById(questId);
  if (!quest) return false;
  
  // Check if the lesson is completed
  if (!completedLessons.includes(quest.lessonId)) return false;
  
  // Check if all quest prerequisites are completed
  return quest.prerequisites.every(prereqId => 
    completedLessons.includes(prereqId) || completedQuests.includes(prereqId)
  );
};

export const canAccessBoss = (bossId: string, completedLessons: string[] = [], completedQuests: string[] = []): boolean => {
  const boss = getBossById(bossId);
  if (!boss) return false;
  
  // Check if the lesson is completed
  if (!completedLessons.includes(boss.lessonId)) return false;
  
  // Check if all quest prerequisites are completed
  return boss.prerequisites.every(prereqId => 
    completedLessons.includes(prereqId) || completedQuests.includes(prereqId)
  );
};

export const updateQuestModuleProgress = (moduleId: string, completedQuests: string[] = []): LessonQuestModule | undefined => {
  const module = LESSON_QUEST_MODULES.find(m => m.id === moduleId);
  if (!module) return undefined;
  
  const completedCount = module.quests.filter(quest => completedQuests.includes(quest.id)).length;
  const progress = (completedCount / module.totalQuests) * 100;
  
  return {
    ...module,
    completedQuests: completedCount,
    progress: Math.round(progress)
  };
};
