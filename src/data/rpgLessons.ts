// RPG-Style Environmental Education System
export interface Game {
  id: string;
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
  prerequisites: string[]; // game IDs that must be completed first
}

export interface Boss {
  id: string;
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
  prerequisites: string[]; // all sub-level games must be completed
  bossType: 'quiz' | 'simulation' | 'puzzle' | 'action';
  bossTheme: string;
}

export interface SubLevel {
  id: string;
  title: string;
  description: string;
  order: number;
  games: Game[];
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[]; // previous sub-level IDs
}

export interface MajorLevel {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  theme: string;
  order: number;
  subLevels: SubLevel[];
  boss: Boss;
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites: string[]; // previous major level IDs
  totalGames: number;
  completedGames: number;
  progress: number; // percentage
}

export const RPG_MAJOR_LEVELS: MajorLevel[] = [
  {
    id: 'climate-kingdom',
    title: 'Climate Kingdom',
    description: 'Master the forces of climate change and global warming',
    icon: '🌍',
    color: 'red',
    theme: 'A mystical kingdom where climate forces battle for control',
    order: 1,
    isCompleted: false,
    isLocked: false,
    prerequisites: [],
    totalGames: 8,
    completedGames: 0,
    progress: 0,
    subLevels: [
      {
        id: 'climate-1',
        title: 'The Warming Forest',
        description: 'Learn about global warming in an enchanted forest',
        order: 1,
        isCompleted: false,
        isLocked: false,
        prerequisites: [],
        games: [
          {
            id: 'warming-forest-game',
            title: 'Temperature Rising',
            description: 'Help forest creatures adapt to rising temperatures',
            type: 'simulation',
            difficulty: 'easy',
            duration: 15,
            points: 50,
            rewards: { seed: 1, water: 1 },
            instructions: 'Drag temperature controls to help animals find suitable habitats',
            objectives: ['Keep 5 animals comfortable', 'Maintain forest balance', 'Learn temperature effects'],
            isCompleted: false,
            isLocked: false,
            prerequisites: []
          },
          {
            id: 'greenhouse-puzzle',
            title: 'Greenhouse Gas Puzzle',
            description: 'Solve puzzles to understand greenhouse gas effects',
            type: 'puzzle',
            difficulty: 'easy',
            duration: 12,
            points: 40,
            rewards: { sunlight: 1, nutrients: 1 },
            instructions: 'Match greenhouse gases with their effects on the environment',
            objectives: ['Identify 3 greenhouse gases', 'Match effects correctly', 'Complete in under 12 minutes'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['warming-forest-game']
          }
        ]
      },
      {
        id: 'climate-2',
        title: 'The Melting Glaciers',
        description: 'Explore the impact of melting ice on sea levels',
        order: 2,
        isCompleted: false,
        isLocked: true,
        prerequisites: ['climate-1'],
        games: [
          {
            id: 'glacier-simulator',
            title: 'Glacier Melt Simulator',
            description: 'Control glacier melting and see its effects',
            type: 'simulation',
            difficulty: 'medium',
            duration: 20,
            points: 70,
            rewards: { seed: 2, water: 2 },
            instructions: 'Adjust global temperature and watch glacier changes',
            objectives: ['Prevent complete glacier melt', 'Maintain sea level balance', 'Save polar habitats'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['greenhouse-puzzle']
          },
          {
            id: 'sea-level-action',
            title: 'Rising Seas Action',
            description: 'Quick action game to protect coastal cities',
            type: 'action',
            difficulty: 'medium',
            duration: 18,
            points: 60,
            rewards: { sunlight: 2, nutrients: 1 },
            instructions: 'Build sea walls and relocate cities as sea levels rise',
            objectives: ['Protect 3 coastal cities', 'Build effective barriers', 'Minimize damage'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['glacier-simulator']
          }
        ]
      }
    ],
    boss: {
      id: 'climate-boss',
      title: 'The Climate Guardian',
      description: 'Face the ultimate climate challenge to prove your knowledge',
      difficulty: 'hard',
      duration: 30,
      points: 150,
      rewards: { seed: 5, water: 3, sunlight: 3, nutrients: 2, fertilizer: 1 },
      instructions: 'Complete a comprehensive climate change quiz and simulation',
      objectives: ['Answer 20 climate questions correctly', 'Complete climate simulation', 'Prove mastery of climate concepts'],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['glacier-simulator', 'sea-level-action'],
      bossType: 'quiz',
      bossTheme: 'A powerful guardian who tests your climate knowledge'
    }
  },
  {
    id: 'waste-realm',
    title: 'Waste Realm',
    description: 'Conquer the world of waste management and recycling',
    icon: '🗑️',
    color: 'green',
    theme: 'A magical realm where waste transforms into valuable resources',
    order: 2,
    isCompleted: false,
    isLocked: true,
    prerequisites: ['climate-kingdom'],
    totalGames: 6,
    completedGames: 0,
    progress: 0,
    subLevels: [
      {
        id: 'waste-1',
        title: 'The Sorting Valley',
        description: 'Master the art of waste sorting and recycling',
        order: 1,
        isCompleted: false,
        isLocked: true,
        prerequisites: ['climate-kingdom'],
        games: [
          {
            id: 'waste-sorting-game',
            title: 'Waste Sorting Master',
            description: 'Sort different types of waste into correct bins',
            type: 'action',
            difficulty: 'easy',
            duration: 10,
            points: 40,
            rewards: { seed: 1, water: 1 },
            instructions: 'Drag waste items to the correct recycling bins',
            objectives: ['Sort 20 items correctly', 'Learn recycling rules', 'Avoid contamination'],
            isCompleted: false,
            isLocked: true,
            prerequisites: []
          },
          {
            id: 'recycling-puzzle',
            title: 'Recycling Process Puzzle',
            description: 'Solve puzzles to understand recycling processes',
            type: 'puzzle',
            difficulty: 'medium',
            duration: 15,
            points: 60,
            rewards: { sunlight: 1, nutrients: 2 },
            instructions: 'Arrange recycling steps in the correct order',
            objectives: ['Complete 3 recycling processes', 'Understand material flows', 'Learn about circular economy'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['waste-sorting-game']
          }
        ]
      },
      {
        id: 'waste-2',
        title: 'The Composting Garden',
        description: 'Learn about composting and organic waste management',
        order: 2,
        isCompleted: false,
        isLocked: true,
        prerequisites: ['waste-1'],
        games: [
          {
            id: 'composting-simulator',
            title: 'Composting Simulator',
            description: 'Manage a composting system to create rich soil',
            type: 'simulation',
            difficulty: 'medium',
            duration: 25,
            points: 80,
            rewards: { seed: 3, water: 2, nutrients: 3 },
            instructions: 'Add organic materials and manage composting conditions',
            objectives: ['Create quality compost', 'Maintain proper conditions', 'Learn composting science'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['recycling-puzzle']
          }
        ]
      }
    ],
    boss: {
      id: 'waste-boss',
      title: 'The Waste Wizard',
      description: 'Face the Waste Wizard in the ultimate recycling challenge',
      difficulty: 'hard',
      duration: 25,
      points: 120,
      rewards: { seed: 4, water: 2, sunlight: 2, nutrients: 3, fertilizer: 1 },
      instructions: 'Complete waste management challenges and prove your expertise',
      objectives: ['Master waste sorting', 'Complete composting challenge', 'Design zero-waste system'],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['composting-simulator'],
      bossType: 'simulation',
      bossTheme: 'A wise wizard who tests your waste management skills'
    }
  },
  {
    id: 'energy-empire',
    title: 'Energy Empire',
    description: 'Build and manage renewable energy systems',
    icon: '⚡',
    color: 'yellow',
    theme: 'An empire powered by clean, renewable energy sources',
    order: 3,
    isCompleted: false,
    isLocked: true,
    prerequisites: ['waste-realm'],
    totalGames: 10,
    completedGames: 0,
    progress: 0,
    subLevels: [
      {
        id: 'energy-1',
        title: 'Solar City',
        description: 'Build and optimize solar energy systems',
        order: 1,
        isCompleted: false,
        isLocked: true,
        prerequisites: ['waste-realm'],
        games: [
          {
            id: 'solar-city-builder',
            title: 'Solar City Builder',
            description: 'Design and build an efficient solar-powered city',
            type: 'strategy',
            difficulty: 'medium',
            duration: 30,
            points: 100,
            rewards: { seed: 2, water: 1, sunlight: 4 },
            instructions: 'Place solar panels and manage energy distribution',
            objectives: ['Power entire city with solar', 'Optimize panel placement', 'Manage energy storage'],
            isCompleted: false,
            isLocked: true,
            prerequisites: []
          },
          {
            id: 'wind-farm-simulator',
            title: 'Wind Farm Simulator',
            description: 'Build and manage wind energy farms',
            type: 'simulation',
            difficulty: 'medium',
            duration: 25,
            points: 90,
            rewards: { seed: 1, water: 2, sunlight: 2 },
            instructions: 'Place wind turbines and optimize energy production',
            objectives: ['Maximize wind energy output', 'Minimize environmental impact', 'Balance energy grid'],
            isCompleted: false,
            isLocked: true,
            prerequisites: ['solar-city-builder']
          }
        ]
      }
    ],
    boss: {
      id: 'energy-boss',
      title: 'The Energy Master',
      description: 'Face the Energy Master in the ultimate renewable energy challenge',
      difficulty: 'extreme',
      duration: 45,
      points: 200,
      rewards: { seed: 8, water: 4, sunlight: 6, nutrients: 4, fertilizer: 2, love: 1 },
      instructions: 'Design and implement a complete renewable energy system',
      objectives: ['Create 100% renewable energy system', 'Optimize energy storage', 'Prove energy mastery'],
      isCompleted: false,
      isLocked: true,
      prerequisites: ['solar-city-builder', 'wind-farm-simulator'],
      bossType: 'strategy',
      bossTheme: 'The ultimate energy challenge to prove your mastery'
    }
  }
];

// Helper functions
export const getMajorLevelById = (levelId: string): MajorLevel | undefined => {
  return RPG_MAJOR_LEVELS.find(level => level.id === levelId);
};

export const getSubLevelById = (subLevelId: string): SubLevel | undefined => {
  for (const majorLevel of RPG_MAJOR_LEVELS) {
    const subLevel = majorLevel.subLevels.find(sub => sub.id === subLevelId);
    if (subLevel) return subLevel;
  }
  return undefined;
};

export const getGameById = (gameId: string): Game | undefined => {
  for (const majorLevel of RPG_MAJOR_LEVELS) {
    for (const subLevel of majorLevel.subLevels) {
      const game = subLevel.games.find(g => g.id === gameId);
      if (game) return game;
    }
  }
  return undefined;
};

export const canAccessMajorLevel = (levelId: string, completedLevels: string[]): boolean => {
  const level = getMajorLevelById(levelId);
  if (!level) return false;
  return level.prerequisites.every(prereqId => completedLevels.includes(prereqId));
};

export const canAccessSubLevel = (subLevelId: string, completedSubLevels: string[]): boolean => {
  const subLevel = getSubLevelById(subLevelId);
  if (!subLevel) return false;
  return subLevel.prerequisites.every(prereqId => completedSubLevels.includes(prereqId));
};

export const canAccessGame = (gameId: string, completedGames: string[]): boolean => {
  const game = getGameById(gameId);
  if (!game) return false;
  return game.prerequisites.every(prereqId => completedGames.includes(prereqId));
};

export const canAccessBoss = (bossId: string, completedGames: string[]): boolean => {
  const majorLevel = RPG_MAJOR_LEVELS.find(level => level.boss.id === bossId);
  if (!majorLevel) return false;
  return majorLevel.boss.prerequisites.every(prereqId => completedGames.includes(prereqId));
};

export const updateLevelProgress = (levelId: string, completedGames: string[]): MajorLevel | undefined => {
  const level = getMajorLevelById(levelId);
  if (!level) return undefined;
  
  const completedCount = level.subLevels.reduce((total, subLevel) => {
    return total + subLevel.games.filter(game => completedGames.includes(game.id)).length;
  }, 0);
  
  const progress = (completedCount / level.totalGames) * 100;
  
  return {
    ...level,
    completedGames: completedCount,
    progress: Math.round(progress)
  };
};
