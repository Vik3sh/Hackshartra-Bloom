// Item types for the tree growing system
export interface TreeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requiredForStage: TreeStage;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic';
}

export type TreeStage = 'pot' | 'seed' | 'sapling' | 'growing' | 'mature' | 'blooming';

export interface UserInventory {
  items: {
    [itemId: string]: number; // quantity of each item
  };
  currentStage: TreeStage;
  stageProgress: {
    [stage: string]: {
      requiredItems: { [itemId: string]: number };
      collectedItems: { [itemId: string]: number };
      isComplete: boolean;
    };
  };
}

export const TREE_ITEMS: TreeItem[] = [
  {
    id: 'seed',
    name: 'Tree Seed',
    description: 'A small seed that can grow into a beautiful tree',
    icon: '🌱',
    color: 'text-green-600',
    requiredForStage: 'seed',
    rarity: 'common'
  },
  {
    id: 'water',
    name: 'Water',
    description: 'Essential for plant growth and hydration',
    icon: '💧',
    color: 'text-blue-600',
    requiredForStage: 'sapling',
    rarity: 'common'
  },
  {
    id: 'sunlight',
    name: 'Sunlight',
    description: 'Natural light energy for photosynthesis',
    icon: '☀️',
    color: 'text-yellow-600',
    requiredForStage: 'growing',
    rarity: 'common'
  },
  {
    id: 'nutrients',
    name: 'Soil Nutrients',
    description: 'Essential minerals and nutrients for healthy growth',
    icon: '🌿',
    color: 'text-green-700',
    requiredForStage: 'mature',
    rarity: 'uncommon'
  },
  {
    id: 'fertilizer',
    name: 'Organic Fertilizer',
    description: 'Natural fertilizer to boost growth and flowering',
    icon: '🌾',
    color: 'text-brown-600',
    requiredForStage: 'blooming',
    rarity: 'rare'
  },
  {
    id: 'love',
    name: 'Care & Love',
    description: 'The most important ingredient for any living thing',
    icon: '❤️',
    color: 'text-pink-600',
    requiredForStage: 'blooming',
    rarity: 'epic'
  }
];

export const STAGE_REQUIREMENTS: { [key in TreeStage]: { [itemId: string]: number } } = {
  pot: {}, // Empty pot, no requirements
  seed: { seed: 1 },
  sapling: { seed: 1, water: 3 },
  growing: { seed: 1, water: 3, sunlight: 5 },
  mature: { seed: 1, water: 3, sunlight: 5, nutrients: 2 },
  blooming: { seed: 1, water: 3, sunlight: 5, nutrients: 2, fertilizer: 1, love: 1 }
};
