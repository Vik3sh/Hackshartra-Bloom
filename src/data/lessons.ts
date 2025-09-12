// Lesson Data and Management System
export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  prerequisites: string[]; // lesson IDs that must be completed first
  isCompleted: boolean;
  isLocked: boolean;
  order: number; // order within the module
  resources: {
    videos?: string[];
    articles?: string[];
    quizzes?: string[];
    activities?: string[];
  };
  tags: string[];
}

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  totalLessons: number;
  completedLessons: number;
  progress: number; // percentage
  lessons: Lesson[];
  isLocked: boolean;
  prerequisites: string[]; // module IDs that must be completed first
}

export const LESSON_MODULES: LessonModule[] = [
  {
    id: 'climate-change',
    title: 'Climate Change',
    description: 'Understanding global warming and its impacts',
    icon: '🌍',
    color: 'red',
    totalLessons: 5,
    completedLessons: 0,
    progress: 0,
    isLocked: false,
    prerequisites: [],
    lessons: [
      {
        id: 'climate-1',
        moduleId: 'climate-change',
        title: 'Introduction to Climate Change',
        description: 'Learn the basics of climate change and global warming',
        content: 'Climate change refers to long-term shifts in global temperatures and weather patterns...',
        type: 'video',
        duration: 15,
        difficulty: 'beginner',
        points: 50,
        prerequisites: [],
        isCompleted: false,
        isLocked: false,
        order: 1,
        resources: {
          videos: ['https://example.com/climate-intro'],
          articles: ['https://example.com/climate-basics']
        },
        tags: ['basics', 'introduction', 'climate']
      },
      {
        id: 'climate-2',
        moduleId: 'climate-change',
        title: 'Greenhouse Effect Explained',
        description: 'Understand how greenhouse gases affect our planet',
        content: 'The greenhouse effect is a natural process that warms the Earth\'s surface...',
        type: 'interactive',
        duration: 20,
        difficulty: 'beginner',
        points: 60,
        prerequisites: ['climate-1'],
        isCompleted: false,
        isLocked: true,
        order: 2,
        resources: {
          videos: ['https://example.com/greenhouse-effect'],
          activities: ['https://example.com/greenhouse-simulation']
        },
        tags: ['greenhouse', 'gases', 'interactive']
      },
      {
        id: 'climate-3',
        moduleId: 'climate-change',
        title: 'Climate Change Impacts',
        description: 'Explore the effects of climate change on ecosystems',
        content: 'Climate change affects weather patterns, sea levels, and biodiversity...',
        type: 'reading',
        duration: 25,
        difficulty: 'intermediate',
        points: 70,
        prerequisites: ['climate-2'],
        isCompleted: false,
        isLocked: true,
        order: 3,
        resources: {
          articles: ['https://example.com/climate-impacts'],
          videos: ['https://example.com/ecosystem-effects']
        },
        tags: ['impacts', 'ecosystems', 'biodiversity']
      },
      {
        id: 'climate-4',
        moduleId: 'climate-change',
        title: 'Climate Solutions',
        description: 'Discover ways to combat climate change',
        content: 'There are many solutions to address climate change, from renewable energy to conservation...',
        type: 'video',
        duration: 30,
        difficulty: 'intermediate',
        points: 80,
        prerequisites: ['climate-3'],
        isCompleted: false,
        isLocked: true,
        order: 4,
        resources: {
          videos: ['https://example.com/climate-solutions'],
          activities: ['https://example.com/solution-calculator']
        },
        tags: ['solutions', 'renewable', 'conservation']
      },
      {
        id: 'climate-5',
        moduleId: 'climate-change',
        title: 'Climate Change Quiz',
        description: 'Test your knowledge about climate change',
        content: 'Complete this quiz to demonstrate your understanding of climate change concepts...',
        type: 'quiz',
        duration: 15,
        difficulty: 'intermediate',
        points: 100,
        prerequisites: ['climate-4'],
        isCompleted: false,
        isLocked: true,
        order: 5,
        resources: {
          quizzes: ['https://example.com/climate-quiz']
        },
        tags: ['quiz', 'assessment', 'knowledge']
      }
    ]
  },
  {
    id: 'waste-management',
    title: 'Waste Management',
    description: 'Learn about recycling and waste reduction',
    icon: '🗑️',
    color: 'green',
    totalLessons: 4,
    completedLessons: 0,
    progress: 0,
    isLocked: false,
    prerequisites: [],
    lessons: [
      {
        id: 'waste-1',
        moduleId: 'waste-management',
        title: 'Understanding Waste',
        description: 'Learn about different types of waste and their impact',
        content: 'Waste comes in many forms and affects our environment differently...',
        type: 'video',
        duration: 12,
        difficulty: 'beginner',
        points: 40,
        prerequisites: [],
        isCompleted: false,
        isLocked: false,
        order: 1,
        resources: {
          videos: ['https://example.com/waste-types'],
          articles: ['https://example.com/waste-impact']
        },
        tags: ['waste', 'types', 'impact']
      },
      {
        id: 'waste-2',
        moduleId: 'waste-management',
        title: 'The 3 R\'s: Reduce, Reuse, Recycle',
        description: 'Master the fundamental principles of waste management',
        content: 'The three R\'s are the foundation of effective waste management...',
        type: 'interactive',
        duration: 18,
        difficulty: 'beginner',
        points: 50,
        prerequisites: ['waste-1'],
        isCompleted: false,
        isLocked: true,
        order: 2,
        resources: {
          videos: ['https://example.com/three-rs'],
          activities: ['https://example.com/rs-simulation']
        },
        tags: ['reduce', 'reuse', 'recycle', 'interactive']
      },
      {
        id: 'waste-3',
        moduleId: 'waste-management',
        title: 'Composting Basics',
        description: 'Learn how to turn organic waste into valuable compost',
        content: 'Composting is a natural process that converts organic waste into nutrient-rich soil...',
        type: 'reading',
        duration: 20,
        difficulty: 'intermediate',
        points: 60,
        prerequisites: ['waste-2'],
        isCompleted: false,
        isLocked: true,
        order: 3,
        resources: {
          articles: ['https://example.com/composting-guide'],
          videos: ['https://example.com/composting-demo']
        },
        tags: ['composting', 'organic', 'soil']
      },
      {
        id: 'waste-4',
        moduleId: 'waste-management',
        title: 'Waste Management Quiz',
        description: 'Test your knowledge of waste management principles',
        content: 'Complete this quiz to demonstrate your understanding of waste management...',
        type: 'quiz',
        duration: 12,
        difficulty: 'intermediate',
        points: 70,
        prerequisites: ['waste-3'],
        isCompleted: false,
        isLocked: true,
        order: 4,
        resources: {
          quizzes: ['https://example.com/waste-quiz']
        },
        tags: ['quiz', 'assessment', 'waste']
      }
    ]
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    description: 'Solar, wind, and clean energy sources',
    icon: '⚡',
    color: 'yellow',
    totalLessons: 6,
    completedLessons: 0,
    progress: 0,
    isLocked: false,
    prerequisites: [],
    lessons: [
      {
        id: 'energy-1',
        moduleId: 'renewable-energy',
        title: 'Introduction to Renewable Energy',
        description: 'Learn about clean energy sources and their benefits',
        content: 'Renewable energy comes from natural sources that are constantly replenished...',
        type: 'video',
        duration: 15,
        difficulty: 'beginner',
        points: 50,
        prerequisites: [],
        isCompleted: false,
        isLocked: false,
        order: 1,
        resources: {
          videos: ['https://example.com/renewable-intro'],
          articles: ['https://example.com/clean-energy']
        },
        tags: ['renewable', 'clean', 'energy']
      },
      {
        id: 'energy-2',
        moduleId: 'renewable-energy',
        title: 'Solar Power',
        description: 'Understand how solar energy works and its applications',
        content: 'Solar power harnesses energy from the sun using photovoltaic cells...',
        type: 'interactive',
        duration: 25,
        difficulty: 'beginner',
        points: 60,
        prerequisites: ['energy-1'],
        isCompleted: false,
        isLocked: true,
        order: 2,
        resources: {
          videos: ['https://example.com/solar-power'],
          activities: ['https://example.com/solar-simulation']
        },
        tags: ['solar', 'photovoltaic', 'interactive']
      },
      {
        id: 'energy-3',
        moduleId: 'renewable-energy',
        title: 'Wind Energy',
        description: 'Explore wind power generation and wind farms',
        content: 'Wind energy uses the kinetic energy of moving air to generate electricity...',
        type: 'video',
        duration: 20,
        difficulty: 'intermediate',
        points: 65,
        prerequisites: ['energy-2'],
        isCompleted: false,
        isLocked: true,
        order: 3,
        resources: {
          videos: ['https://example.com/wind-energy'],
          articles: ['https://example.com/wind-farms']
        },
        tags: ['wind', 'turbines', 'farms']
      },
      {
        id: 'energy-4',
        moduleId: 'renewable-energy',
        title: 'Hydroelectric Power',
        description: 'Learn about water-based energy generation',
        content: 'Hydroelectric power uses the energy of flowing water to generate electricity...',
        type: 'reading',
        duration: 18,
        difficulty: 'intermediate',
        points: 55,
        prerequisites: ['energy-3'],
        isCompleted: false,
        isLocked: true,
        order: 4,
        resources: {
          articles: ['https://example.com/hydroelectric'],
          videos: ['https://example.com/dam-power']
        },
        tags: ['hydroelectric', 'water', 'dams']
      },
      {
        id: 'energy-5',
        moduleId: 'renewable-energy',
        title: 'Energy Storage Solutions',
        description: 'Understand how renewable energy is stored and managed',
        content: 'Energy storage is crucial for making renewable energy reliable and consistent...',
        type: 'interactive',
        duration: 22,
        difficulty: 'advanced',
        points: 75,
        prerequisites: ['energy-4'],
        isCompleted: false,
        isLocked: true,
        order: 5,
        resources: {
          videos: ['https://example.com/energy-storage'],
          activities: ['https://example.com/storage-simulation']
        },
        tags: ['storage', 'batteries', 'grid']
      },
      {
        id: 'energy-6',
        moduleId: 'renewable-energy',
        title: 'Renewable Energy Quiz',
        description: 'Test your knowledge of renewable energy concepts',
        content: 'Complete this comprehensive quiz on renewable energy...',
        type: 'quiz',
        duration: 20,
        difficulty: 'intermediate',
        points: 90,
        prerequisites: ['energy-5'],
        isCompleted: false,
        isLocked: true,
        order: 6,
        resources: {
          quizzes: ['https://example.com/energy-quiz']
        },
        tags: ['quiz', 'assessment', 'renewable']
      }
    ]
  }
];

// Helper functions
export const getModuleById = (moduleId: string): LessonModule | undefined => {
  return LESSON_MODULES.find(module => module.id === moduleId);
};

export const getLessonById = (lessonId: string): Lesson | undefined => {
  for (const module of LESSON_MODULES) {
    const lesson = module.lessons.find(lesson => lesson.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};

export const getNextLesson = (moduleId: string, currentLessonId: string): Lesson | undefined => {
  const module = getModuleById(moduleId);
  if (!module) return undefined;
  
  const currentLesson = module.lessons.find(lesson => lesson.id === currentLessonId);
  if (!currentLesson) return undefined;
  
  const nextOrder = currentLesson.order + 1;
  return module.lessons.find(lesson => lesson.order === nextOrder);
};

export const canAccessLesson = (lessonId: string, completedLessons: string[] = []): boolean => {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  
  // Check if all prerequisites are completed
  return lesson.prerequisites.every(prereqId => completedLessons.includes(prereqId));
};

export const updateModuleProgress = (moduleId: string, completedLessons: string[] = []): LessonModule | undefined => {
  const module = getModuleById(moduleId);
  if (!module) return undefined;
  
  const completedCount = module.lessons.filter(lesson => completedLessons.includes(lesson.id)).length;
  const progress = (completedCount / module.totalLessons) * 100;
  
  return {
    ...module,
    completedLessons: completedCount,
    progress: Math.round(progress)
  };
};
