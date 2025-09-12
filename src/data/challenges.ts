export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'waste' | 'energy' | 'water' | 'biodiversity' | 'climate' | 'lifestyle';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  treeRewards: {
    seed?: number;
    water?: number;
    sunlight?: number;
    nutrients?: number;
    fertilizer?: number;
    love?: number;
  };
  requirements: {
    level?: number;
    completedChallenges?: string[];
    items?: { [key: string]: number };
  };
  isLocked: boolean;
  isCompleted: boolean;
  progress?: number;
  maxProgress?: number;
  instructions: string[];
  verificationMethod: 'photo' | 'quiz' | 'timer' | 'manual' | 'location';
  estimatedTime: string;
  tags: string[];
}

export const CHALLENGES: Challenge[] = [
  // DAILY CHALLENGES
  {
    id: 'daily-water-bottle',
    title: '💧 Reusable Water Bottle Day',
    description: 'Use only a reusable water bottle for the entire day',
    type: 'daily',
    category: 'waste',
    difficulty: 'easy',
    points: 50,
    treeRewards: { water: 2, love: 1 },
    requirements: {},
    isLocked: false,
    isCompleted: false,
    instructions: [
      'Fill your reusable water bottle in the morning',
      'Avoid using any single-use plastic bottles',
      'Take a photo of your bottle at the end of the day',
      'Share your eco-friendly choice!'
    ],
    verificationMethod: 'photo',
    estimatedTime: '1 day',
    tags: ['plastic-free', 'daily-habit', 'sustainability']
  },
  {
    id: 'daily-lights-off',
    title: '💡 Lights Off Challenge',
    description: 'Turn off all unnecessary lights for 2 hours',
    type: 'daily',
    category: 'energy',
    difficulty: 'easy',
    points: 30,
    treeRewards: { sunlight: 1 },
    requirements: {},
    isLocked: false,
    isCompleted: false,
    instructions: [
      'Identify unnecessary lights in your home',
      'Turn them off for 2 consecutive hours',
      'Use natural light or essential lighting only',
      'Take a before/after photo'
    ],
    verificationMethod: 'photo',
    estimatedTime: '2 hours',
    tags: ['energy-saving', 'daily-habit', 'conservation']
  },
  {
    id: 'daily-walk',
    title: '🚶‍♀️ Green Commute',
    description: 'Walk or cycle instead of using motorized transport',
    type: 'daily',
    category: 'climate',
    difficulty: 'easy',
    points: 40,
    treeRewards: { seed: 1, water: 1 },
    requirements: {},
    isLocked: false,
    isCompleted: false,
    instructions: [
      'Choose walking or cycling for at least one trip',
      'Track your distance (minimum 1km)',
      'Take a photo of your journey',
      'Calculate CO2 saved'
    ],
    verificationMethod: 'photo',
    estimatedTime: '30 minutes',
    tags: ['carbon-footprint', 'exercise', 'transportation']
  },

  // WEEKLY CHALLENGES
  {
    id: 'weekly-meat-free',
    title: '🌱 Meat-Free Week',
    description: 'Go vegetarian for an entire week',
    type: 'weekly',
    category: 'climate',
    difficulty: 'medium',
    points: 200,
    treeRewards: { seed: 3, water: 2, nutrients: 2 },
    requirements: { level: 2 },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Plan your vegetarian meals for the week',
      'Try new plant-based recipes',
      'Document your meals with photos',
      'Calculate your carbon footprint reduction'
    ],
    verificationMethod: 'photo',
    estimatedTime: '7 days',
    tags: ['diet', 'carbon-footprint', 'sustainability', 'health']
  },
  {
    id: 'weekly-waste-audit',
    title: '🗑️ Zero Waste Week',
    description: 'Minimize waste to less than 1kg for the week',
    type: 'weekly',
    category: 'waste',
    difficulty: 'hard',
    points: 300,
    treeRewards: { seed: 2, water: 3, nutrients: 1, fertilizer: 1 },
    requirements: { level: 3, completedChallenges: ['daily-water-bottle'] },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Weigh your waste at the start of the week',
      'Implement waste reduction strategies',
      'Compost organic waste',
      'Recycle everything possible',
      'Weigh waste at the end of the week'
    ],
    verificationMethod: 'photo',
    estimatedTime: '7 days',
    tags: ['zero-waste', 'recycling', 'composting', 'sustainability']
  },
  {
    id: 'weekly-garden',
    title: '🌿 Plant Care Week',
    description: 'Tend to plants and learn about local biodiversity',
    type: 'weekly',
    category: 'biodiversity',
    difficulty: 'medium',
    points: 150,
    treeRewards: { seed: 2, water: 2, sunlight: 1, love: 2 },
    requirements: { level: 2 },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Water and care for existing plants',
      'Plant a new seed or seedling',
      'Identify 5 local plant species',
      'Document plant growth with photos',
      'Learn about plant benefits'
    ],
    verificationMethod: 'photo',
    estimatedTime: '7 days',
    tags: ['gardening', 'biodiversity', 'nature', 'learning']
  },

  // MONTHLY CHALLENGES
  {
    id: 'monthly-energy-audit',
    title: '⚡ Energy Audit Month',
    description: 'Reduce home energy consumption by 20%',
    type: 'monthly',
    category: 'energy',
    difficulty: 'hard',
    points: 500,
    treeRewards: { seed: 5, water: 3, sunlight: 4, nutrients: 2 },
    requirements: { level: 5, completedChallenges: ['daily-lights-off', 'weekly-meat-free'] },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Record baseline energy usage',
      'Implement energy-saving measures',
      'Monitor daily consumption',
      'Calculate monthly savings',
      'Share your energy-saving tips'
    ],
    verificationMethod: 'photo',
    estimatedTime: '30 days',
    tags: ['energy-efficiency', 'home-improvement', 'sustainability', 'monitoring']
  },
  {
    id: 'monthly-community-cleanup',
    title: '🧹 Community Cleanup',
    description: 'Organize or participate in 4 community cleanup events',
    type: 'monthly',
    category: 'waste',
    difficulty: 'medium',
    points: 400,
    treeRewards: { seed: 3, water: 2, nutrients: 3, love: 4 },
    requirements: { level: 4 },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Find or organize cleanup events',
      'Participate in 4 different cleanups',
      'Document each event with photos',
      'Track waste collected',
      'Share impact with community'
    ],
    verificationMethod: 'photo',
    estimatedTime: '30 days',
    tags: ['community', 'cleanup', 'social-impact', 'environmental-action']
  },

  // SPECIAL CHALLENGES
  {
    id: 'special-earth-hour',
    title: '🌍 Earth Hour Challenge',
    description: 'Participate in Earth Hour and extend it to 3 hours',
    type: 'special',
    category: 'climate',
    difficulty: 'easy',
    points: 100,
    treeRewards: { seed: 2, water: 1, sunlight: 2 },
    requirements: {},
    isLocked: false,
    isCompleted: false,
    instructions: [
      'Turn off all non-essential lights and electronics',
      'Spend 3 hours without electricity',
      'Engage in eco-friendly activities',
      'Take photos of your Earth Hour experience',
      'Share your commitment on social media'
    ],
    verificationMethod: 'photo',
    estimatedTime: '3 hours',
    tags: ['earth-hour', 'climate-action', 'global-movement', 'awareness']
  },
  {
    id: 'special-plastic-free-month',
    title: '🚫 Plastic-Free Month',
    description: 'Avoid single-use plastics for an entire month',
    type: 'special',
    category: 'waste',
    difficulty: 'hard',
    points: 800,
    treeRewards: { seed: 8, water: 5, nutrients: 4, fertilizer: 3, love: 5 },
    requirements: { level: 6, completedChallenges: ['weekly-waste-audit'] },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Audit your plastic usage',
      'Find plastic-free alternatives',
      'Plan shopping and meals carefully',
      'Document your plastic-free journey',
      'Share tips and challenges faced'
    ],
    verificationMethod: 'photo',
    estimatedTime: '30 days',
    tags: ['plastic-free', 'zero-waste', 'lifestyle-change', 'sustainability']
  },

  // GAME-BASED CHALLENGES
  {
    id: 'game-eco-simulator',
    title: '🎮 Eco City Simulator',
    description: 'Build a sustainable city in our interactive game (Coming Soon)',
    type: 'daily',
    category: 'climate',
    difficulty: 'medium',
    points: 100,
    treeRewards: { seed: 2, water: 1, nutrients: 2 },
    requirements: { level: 3 },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Open the Eco City Simulator game',
      'Build renewable energy sources',
      'Create green spaces and parks',
      'Achieve 80% sustainability score',
      'Screenshot your final city'
    ],
    verificationMethod: 'photo',
    estimatedTime: '45 minutes',
    tags: ['simulation', 'gaming', 'urban-planning', 'sustainability', 'coming-soon']
  },
  {
    id: 'game-waste-sorting',
    title: '♻️ Waste Sorting Master',
    description: 'Master the art of waste sorting in our mini-game (Coming Soon)',
    type: 'daily',
    category: 'waste',
    difficulty: 'easy',
    points: 60,
    treeRewards: { water: 1, nutrients: 1 },
    requirements: {},
    isLocked: false,
    isCompleted: false,
    instructions: [
      'Play the Waste Sorting mini-game',
      'Sort 50 items correctly',
      'Achieve 90% accuracy',
      'Learn about proper waste disposal',
      'Apply knowledge in real life'
    ],
    verificationMethod: 'quiz',
    estimatedTime: '20 minutes',
    tags: ['recycling', 'gaming', 'education', 'waste-management', 'coming-soon']
  },
  {
    id: 'game-carbon-calculator',
    title: '📊 Carbon Footprint Calculator',
    description: 'Calculate and reduce your carbon footprint (Coming Soon)',
    type: 'weekly',
    category: 'climate',
    difficulty: 'medium',
    points: 120,
    treeRewards: { seed: 2, water: 2, nutrients: 1 },
    requirements: { level: 2 },
    isLocked: true,
    isCompleted: false,
    instructions: [
      'Use our carbon footprint calculator',
      'Input your daily activities',
      'Identify high-impact areas',
      'Create a reduction plan',
      'Track progress over the week'
    ],
    verificationMethod: 'quiz',
    estimatedTime: '1 hour',
    tags: ['carbon-footprint', 'calculation', 'planning', 'climate-action', 'coming-soon']
  }
];

export const getChallengesByType = (type: Challenge['type']) => 
  CHALLENGES.filter(challenge => challenge.type === type);

export const getChallengesByCategory = (category: Challenge['category']) => 
  CHALLENGES.filter(challenge => challenge.category === category);

export const getUnlockedChallenges = (userLevel: number, completedChallengeIds: string[]) => 
  CHALLENGES.filter(challenge => 
    !challenge.isLocked && 
    (!challenge.requirements.level || userLevel >= challenge.requirements.level) &&
    (!challenge.requirements.completedChallenges || 
     challenge.requirements.completedChallenges.every(id => completedChallengeIds.includes(id)))
  );

export const getChallengeById = (id: string) => 
  CHALLENGES.find(challenge => challenge.id === id);
