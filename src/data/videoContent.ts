// YouTube Video IDs for Environmental Education Content
// Replace these with actual educational video IDs

export const VIDEO_CONTENT = {
  // Climate Change Module
  'climate-1': {
    title: 'Introduction to Climate Change',
    videoId: 'IJoAcD0oUww', // Replace with actual climate change video
    duration: '5:30',
    description: 'Comprehensive introduction to climate change fundamentals'
  },
  'climate-2': {
    title: 'Greenhouse Effect Explained',
    videoId: '_LwH6O4jaXY', // Replace with actual greenhouse effect video
    duration: '4:15',
    description: 'Understanding how the greenhouse effect works'
  },
  'climate-3': {
    title: 'Human Impact on Climate',
    videoId: 'dQw4w9WgXcQ', // Replace with actual human impact video
    duration: '6:20',
    description: 'How human activities affect global climate'
  },
  'climate-4': {
    title: 'Climate Change Solutions',
    videoId: 'dQw4w9WgXcQ', // Replace with actual solutions video
    duration: '7:45',
    description: 'Innovative solutions to combat climate change'
  },
  'climate-5': {
    title: 'Climate Policy and Action',
    videoId: 'dQw4w9WgXcQ', // Replace with actual policy video
    duration: '9:15',
    description: 'Global climate policies and collective action'
  },
  
  // Waste Management Module
  'waste-1': {
    title: 'Waste Management Fundamentals',
    videoId: 'dQw4w9WgXcQ', // Replace with actual waste management video
    duration: '4:15',
    description: 'Introduction to waste management principles'
  },
  'waste-2': {
    title: 'The 3 R\'s of Waste Management',
    videoId: 'dQw4w9WgXcQ', // Replace with actual 3Rs video
    duration: '3:45',
    description: 'Reduce, Reuse, Recycle - the foundation of waste management'
  },
  'waste-3': {
    title: 'Recycling Process Explained',
    videoId: 'dQw4w9WgXcQ', // Replace with actual recycling video
    duration: '5:20',
    description: 'How the recycling process works'
  },
  'waste-4': {
    title: 'Circular Economy Principles',
    videoId: 'dQw4w9WgXcQ', // Replace with actual circular economy video
    duration: '6:30',
    description: 'Understanding circular economy concepts'
  },
  'waste-5': {
    title: 'Zero Waste Living',
    videoId: 'dQw4w9WgXcQ', // Replace with actual zero waste video
    duration: '7:15',
    description: 'Practical tips for zero waste living'
  },
  
  // Renewable Energy Module
  'energy-1': {
    title: 'Renewable Energy Explained',
    videoId: 'dQw4w9WgXcQ', // Replace with actual renewable energy video
    duration: '6:45',
    description: 'Introduction to renewable energy sources'
  },
  'energy-2': {
    title: 'Solar Power Technology',
    videoId: 'dQw4w9WgXcQ', // Replace with actual solar video
    duration: '5:30',
    description: 'How solar panels work and their benefits'
  },
  'energy-3': {
    title: 'Wind Energy Systems',
    videoId: 'dQw4w9WgXcQ', // Replace with actual wind energy video
    duration: '4:50',
    description: 'Understanding wind power generation'
  },
  'energy-4': {
    title: 'Energy Storage Solutions',
    videoId: 'dQw4w9WgXcQ', // Replace with actual energy storage video
    duration: '7:20',
    description: 'Battery technology and energy storage systems'
  },
  'energy-5': {
    title: 'Future of Clean Energy',
    videoId: 'dQw4w9WgXcQ', // Replace with actual future energy video
    duration: '8:30',
    description: 'Emerging clean energy technologies'
  },
  
  // Conservation Module
  'conservation-1': {
    title: 'Biodiversity Conservation',
    videoId: 'dQw4w9WgXcQ', // Replace with actual biodiversity video
    duration: '5:40',
    description: 'Protecting Earth\'s biodiversity'
  },
  'conservation-2': {
    title: 'Habitat Protection',
    videoId: 'dQw4w9WgXcQ', // Replace with actual habitat video
    duration: '4:25',
    description: 'Conserving natural habitats'
  },
  'conservation-3': {
    title: 'Wildlife Conservation',
    videoId: 'dQw4w9WgXcQ', // Replace with actual wildlife video
    duration: '6:10',
    description: 'Protecting endangered species'
  },
  'conservation-4': {
    title: 'Ecosystem Restoration',
    videoId: 'dQw4w9WgXcQ', // Replace with actual restoration video
    duration: '7:35',
    description: 'Restoring damaged ecosystems'
  },
  'conservation-5': {
    title: 'Marine Conservation',
    videoId: 'dQw4w9WgXcQ', // Replace with actual marine video
    duration: '8:15',
    description: 'Protecting our oceans and marine life'
  }
};

// Helper function to get video content by lesson ID
export const getVideoContent = (lessonId: string) => {
  return VIDEO_CONTENT[lessonId as keyof typeof VIDEO_CONTENT] || null;
};

// Helper function to get all videos for a module
export const getModuleVideos = (moduleId: string) => {
  const moduleVideos: { [key: string]: any } = {};
  
  Object.entries(VIDEO_CONTENT).forEach(([lessonId, content]) => {
    if (lessonId.startsWith(moduleId)) {
      moduleVideos[lessonId] = content;
    }
  });
  
  return moduleVideos;
};
