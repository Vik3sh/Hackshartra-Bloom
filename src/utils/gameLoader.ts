// Utility to load HTML games from the Games folder
// Map game IDs to actual file names
const GAME_FILE_MAP: { [key: string]: string } = {
  'fire-escape': 'EnhancedFireEscape.html',
  'cyclone-survival': 'EnhancedCyclone.html',
  'earthquake-survival': 'EARTHQUAKE.HTML',
  'fire-escape-game': 'fire.html',
  'flood-escape': 'EnhancedFlood.html'
};

export const loadHtmlGame = async (gameId: string): Promise<string> => {
  try {
    const fileName = GAME_FILE_MAP[gameId];
    if (!fileName) {
      throw new Error(`Unknown game ID: ${gameId}`);
    }
    
    console.log(`Loading HTML game: ${gameId} -> ${fileName}`);
    const response = await fetch(`/Games/${fileName}`);
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load game: ${gameId} (Status: ${response.status})`);
    }
    
    const content = await response.text();
    console.log(`HTML content loaded, length: ${content.length}`);
    console.log(`First 200 characters:`, content.substring(0, 200));
    
    return content;
  } catch (error) {
    console.error(`Error loading game ${gameId}:`, error);
    return `
      <html>
        <body style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif; background: #f0f0f0;">
          <div style="text-align: center; padding: 20px;">
            <h2 style="color: #666;">Game Not Available</h2>
            <p style="color: #888;">Unable to load the game. Please try again later.</p>
            <p style="color: #888;">Error: ${error}</p>
          </div>
        </body>
      </html>
    `;
  }
};

// Game metadata for the HTML games
export const HTML_GAMES = {
  'fire-escape': {
    id: 'fire-escape',
    title: '🔥 Wildfire Prevention Challenge',
    description: 'Learn fire safety and prevention strategies while escaping a wildfire',
    type: 'action' as const,
    difficulty: 'medium' as const,
    duration: 5,
    points: 100,
    rewards: { water: 2, sunlight: 1, nutrients: 1 },
    instructions: 'Use arrow keys to move and spacebar to jump. Collect water buckets and avoid flames!',
    objectives: [
      'Escape the wildfire safely',
      'Collect at least 5 water buckets',
      'Avoid touching flames',
      'Reach the safe zone'
    ],
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  },
  'cyclone-survival': {
    id: 'cyclone-survival',
    title: '🌪️ Cyclone Survival',
    description: 'Survive a powerful cyclone by making smart decisions and finding shelter',
    type: 'action' as const,
    difficulty: 'hard' as const,
    duration: 8,
    points: 150,
    rewards: { water: 1, sunlight: 2, nutrients: 2 },
    instructions: 'Navigate through the storm using arrow keys. Find shelter and avoid debris!',
    objectives: [
      'Find safe shelter before the storm hits',
      'Avoid flying debris',
      'Help other survivors',
      'Survive for 2 minutes'
    ],
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  },
  'earthquake-survival': {
    id: 'earthquake-survival',
    title: '🌋 Earthquake Survival',
    description: 'Learn earthquake safety by surviving a major earthquake',
    type: 'action' as const,
    difficulty: 'medium' as const,
    duration: 6,
    points: 120,
    rewards: { water: 1, sunlight: 1, nutrients: 2 },
    instructions: 'Use WASD keys to move. Find cover under sturdy furniture and avoid falling objects!',
    objectives: [
      'Find cover under a sturdy table',
      'Avoid falling objects',
      'Help trapped survivors',
      'Reach the evacuation point'
    ],
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  },
  'fire-escape-game': {
    id: 'fire-escape-game',
    title: '🔥 Fire Escape Game',
    description: 'Navigate through a burning building to safety',
    type: 'action' as const,
    difficulty: 'easy' as const,
    duration: 4,
    points: 80,
    rewards: { water: 2, sunlight: 0, nutrients: 1 },
    instructions: 'Use arrow keys to move. Find the exit while avoiding flames and smoke!',
    objectives: [
      'Find the building exit',
      'Avoid flames and smoke',
      'Collect fire safety items',
      'Escape within the time limit'
    ],
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  },
  'flood-escape': {
    id: 'flood-escape',
    title: '🌊 Flood Escape',
    description: 'Escape rising floodwaters by making quick decisions',
    type: 'action' as const,
    difficulty: 'medium' as const,
    duration: 7,
    points: 130,
    rewards: { water: 3, sunlight: 0, nutrients: 1 },
    instructions: 'Use arrow keys to move. Stay on high ground and avoid deep water!',
    objectives: [
      'Stay on high ground',
      'Avoid deep water areas',
      'Help stranded people',
      'Reach the evacuation center'
    ],
    isCompleted: false,
    isLocked: false,
    prerequisites: []
  }
};

export const getHtmlGameById = (gameId: string) => {
  return HTML_GAMES[gameId as keyof typeof HTML_GAMES];
};
