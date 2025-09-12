export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
}

export interface QuizModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  questions: QuizQuestion[];
  totalPoints: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const quizData: { [key: string]: QuizModule } = {
  ourPlanetOurHome: {
    id: 'ourPlanetOurHome',
    title: 'Our Planet, Our Home',
    description: 'Learn about Earth\'s natural systems and resources',
    icon: '🌍',
    color: 'blue',
    difficulty: 'beginner',
    totalPoints: 50,
    questions: [
      {
        question: "Which gas is most important for humans to breathe?",
        options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"],
        correctAnswer: "Oxygen",
        explanation: "Oxygen is essential for human respiration and makes up about 21% of Earth's atmosphere.",
        points: 10
      },
      {
        question: "Which is the largest source of fresh water?",
        options: ["Rivers", "Oceans", "Glaciers", "Rain"],
        correctAnswer: "Glaciers",
        explanation: "Glaciers and ice caps contain about 68.7% of Earth's fresh water.",
        points: 10
      },
      {
        question: "Soil helps plants mainly by providing:",
        options: ["Oxygen", "Nutrients", "Electricity", "Sound"],
        correctAnswer: "Nutrients",
        explanation: "Soil provides essential nutrients like nitrogen, phosphorus, and potassium that plants need to grow.",
        points: 10
      },
      {
        question: "Which of these covers most of Earth's surface?",
        options: ["Land", "Water", "Forests", "Ice"],
        correctAnswer: "Water",
        explanation: "Water covers about 71% of Earth's surface, which is why Earth is called the 'Blue Planet'.",
        points: 10
      },
      {
        question: "The Earth is also called the:",
        options: ["Red Planet", "Blue Planet", "White Planet", "Green Planet"],
        correctAnswer: "Blue Planet",
        explanation: "Earth is called the Blue Planet because of the vast amount of water covering its surface.",
        points: 10
      }
    ]
  },
  greenFriends: {
    id: 'greenFriends',
    title: 'Green Friends',
    description: 'Discover the amazing world of plants and trees',
    icon: '🌱',
    color: 'green',
    difficulty: 'beginner',
    totalPoints: 50,
    questions: [
      {
        question: "Plants make their own food using:",
        options: ["Sunlight", "Fire", "Soil only", "Rocks"],
        correctAnswer: "Sunlight",
        explanation: "Plants use sunlight, water, and carbon dioxide to make their own food through photosynthesis.",
        points: 10
      },
      {
        question: "Which part of the plant absorbs water?",
        options: ["Leaves", "Stem", "Roots", "Flowers"],
        correctAnswer: "Roots",
        explanation: "Roots absorb water and nutrients from the soil and transport them to other parts of the plant.",
        points: 10
      },
      {
        question: "Which tree is known as the 'Lungs of the Earth'?",
        options: ["Neem", "Banyan", "Rainforest", "Mango"],
        correctAnswer: "Rainforest",
        explanation: "Rainforests are called the 'Lungs of the Earth' because they produce about 20% of the world's oxygen.",
        points: 10
      },
      {
        question: "Which gas do plants release during photosynthesis?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Methane"],
        correctAnswer: "Oxygen",
        explanation: "During photosynthesis, plants absorb carbon dioxide and release oxygen, which is essential for life.",
        points: 10
      },
      {
        question: "Which of these is NOT a tree?",
        options: ["Pine", "Bamboo", "Rose", "Oak"],
        correctAnswer: "Rose",
        explanation: "Rose is a flowering plant, not a tree. Pine, bamboo, and oak are all types of trees.",
        points: 10
      }
    ]
  },
  balanceInNature: {
    id: 'balanceInNature',
    title: 'Balance in Nature',
    description: 'Understand ecosystems and food chains',
    icon: '🦋',
    color: 'purple',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "A food chain always begins with:",
        options: ["Animals", "Plants", "Humans", "Insects"],
        correctAnswer: "Plants",
        explanation: "Food chains always start with plants (producers) that make their own food using sunlight.",
        points: 10
      },
      {
        question: "Which animal is a herbivore?",
        options: ["Lion", "Cow", "Tiger", "Snake"],
        correctAnswer: "Cow",
        explanation: "Cows are herbivores that eat only plants, while lions, tigers, and snakes are carnivores.",
        points: 10
      },
      {
        question: "Which one is a predator-prey pair?",
        options: ["Rabbit–Carrot", "Lion–Deer", "Cow–Grass", "Bee–Flower"],
        correctAnswer: "Lion–Deer",
        explanation: "Lion and deer form a predator-prey relationship where the lion hunts the deer for food.",
        points: 10
      },
      {
        question: "If bees disappear, which will be affected most?",
        options: ["Pollination", "Rivers", "Rainfall", "Rocks"],
        correctAnswer: "Pollination",
        explanation: "Bees are crucial pollinators. Without them, many plants wouldn't be able to reproduce.",
        points: 10
      },
      {
        question: "Which shows the balance of living and non-living things?",
        options: ["School", "Garden", "Ecosystem", "Computer"],
        correctAnswer: "Ecosystem",
        explanation: "An ecosystem includes all living organisms and their physical environment working together.",
        points: 10
      }
    ]
  },
  threeRsInAction: {
    id: 'threeRsInAction',
    title: 'Three R\'s in Action',
    description: 'Master Reduce, Reuse, Recycle for a cleaner planet',
    icon: '♻️',
    color: 'green',
    difficulty: 'beginner',
    totalPoints: 50,
    questions: [
      {
        question: "Which of these is the first step in waste management?",
        options: ["Recycle", "Reduce", "Reuse", "Remove"],
        correctAnswer: "Reduce",
        explanation: "Reduce is the first and most important step - use less to create less waste.",
        points: 10
      },
      {
        question: "Using a cloth bag instead of a plastic bag is an example of:",
        options: ["Recycling", "Reducing", "Polluting", "Burning"],
        correctAnswer: "Reducing",
        explanation: "Using a reusable cloth bag reduces the need for single-use plastic bags.",
        points: 10
      },
      {
        question: "Which waste is best suited for composting?",
        options: ["Plastic bottle", "Banana peel", "Glass jar", "Metal can"],
        correctAnswer: "Banana peel",
        explanation: "Banana peels are organic waste that can be composted to create nutrient-rich soil.",
        points: 10
      },
      {
        question: "What does the recycling symbol ♻ represent?",
        options: ["Only reusing", "Throwing waste", "Reduce, Reuse, Recycle", "Burning waste"],
        correctAnswer: "Reduce, Reuse, Recycle",
        explanation: "The recycling symbol represents the three R's: Reduce, Reuse, and Recycle.",
        points: 10
      },
      {
        question: "Which is an example of recycling?",
        options: ["Making paper from old newspapers", "Throwing plastic bottles", "Burning garbage", "Using more plastic bags"],
        correctAnswer: "Making paper from old newspapers",
        explanation: "Recycling involves converting waste materials into new products, like making new paper from old newspapers.",
        points: 10
      }
    ]
  },
  pollutionAroundUs: {
    id: 'pollutionAroundUs',
    title: 'Pollution Around Us',
    description: 'Identify and understand different types of pollution',
    icon: '🏭',
    color: 'red',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "Which of these is NOT a type of pollution?",
        options: ["Air pollution", "Water pollution", "Noise pollution", "Color pollution"],
        correctAnswer: "Color pollution",
        explanation: "Color pollution is not a recognized type of environmental pollution.",
        points: 10
      },
      {
        question: "Burning plastic releases:",
        options: ["Clean air", "Harmful gases", "Fresh oxygen", "Pure water"],
        correctAnswer: "Harmful gases",
        explanation: "Burning plastic releases toxic gases like dioxins and furans that are harmful to health and environment.",
        points: 10
      },
      {
        question: "A loudspeaker at high volume causes:",
        options: ["Air pollution", "Noise pollution", "Soil pollution", "Water pollution"],
        correctAnswer: "Noise pollution",
        explanation: "Excessive noise from loudspeakers causes noise pollution, which can harm hearing and cause stress.",
        points: 10
      },
      {
        question: "Dumping untreated sewage in rivers causes:",
        options: ["Noise pollution", "Water pollution", "Soil pollution", "Air pollution"],
        correctAnswer: "Water pollution",
        explanation: "Untreated sewage contains harmful bacteria and chemicals that pollute water bodies.",
        points: 10
      },
      {
        question: "Which is the main cause of air pollution in cities?",
        options: ["Factories and vehicles", "Walking and cycling", "Gardening", "Reading books"],
        correctAnswer: "Factories and vehicles",
        explanation: "Factories and vehicles are the primary sources of air pollution in urban areas.",
        points: 10
      }
    ]
  },
  myFootprint: {
    id: 'myFootprint',
    title: 'My Footprint',
    description: 'Learn about carbon footprint and sustainable living',
    icon: '👣',
    color: 'orange',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "What does 'carbon footprint' measure?",
        options: ["Size of shoes", "CO₂ emissions from activities", "Number of trees", "Distance walked"],
        correctAnswer: "CO₂ emissions from activities",
        explanation: "Carbon footprint measures the total greenhouse gas emissions caused by an individual's activities.",
        points: 10
      },
      {
        question: "Which activity produces less carbon?",
        options: ["Driving a car", "Cycling", "Flying in a plane", "Using air-conditioners"],
        correctAnswer: "Cycling",
        explanation: "Cycling produces almost no carbon emissions and is one of the most eco-friendly transportation methods.",
        points: 10
      },
      {
        question: "Which type of bulb saves the most energy?",
        options: ["Incandescent", "Tube light", "LED", "Candle"],
        correctAnswer: "LED",
        explanation: "LED bulbs use up to 80% less energy than incandescent bulbs and last much longer.",
        points: 10
      },
      {
        question: "Using public transport instead of private cars:",
        options: ["Increases pollution", "Reduces carbon footprint", "Makes more traffic", "Wastes fuel"],
        correctAnswer: "Reduces carbon footprint",
        explanation: "Public transport reduces per-person emissions by carrying many people in one vehicle.",
        points: 10
      },
      {
        question: "Which action increases your carbon footprint?",
        options: ["Growing plants", "Switching off lights", "Wasting electricity", "Walking to school"],
        correctAnswer: "Wasting electricity",
        explanation: "Wasting electricity increases energy consumption and carbon emissions.",
        points: 10
      }
    ]
  },
  wasteAndCompost: {
    id: 'wasteAndCompost',
    title: 'Waste and Compost',
    description: 'Master waste segregation and composting techniques',
    icon: '🗑️',
    color: 'brown',
    difficulty: 'beginner',
    totalPoints: 50,
    questions: [
      {
        question: "Which bin should you throw fruit peels into?",
        options: ["Blue bin", "Green bin", "Red bin", "None"],
        correctAnswer: "Green bin",
        explanation: "Fruit peels are organic waste and should go in the green bin for composting.",
        points: 10
      },
      {
        question: "Composting turns kitchen waste into:",
        options: ["Plastic", "Fertile soil", "Stones", "Metal"],
        correctAnswer: "Fertile soil",
        explanation: "Composting breaks down organic waste into nutrient-rich soil that helps plants grow.",
        points: 10
      },
      {
        question: "Which of these is non-biodegradable?",
        options: ["Banana peel", "Glass bottle", "Paper", "Dry leaves"],
        correctAnswer: "Glass bottle",
        explanation: "Glass bottles are non-biodegradable and take thousands of years to decompose naturally.",
        points: 10
      },
      {
        question: "What do the blue bins in India usually collect?",
        options: ["Plastic & metals", "Food waste", "Soil", "Clothes"],
        correctAnswer: "Plastic & metals",
        explanation: "Blue bins in India typically collect recyclable materials like plastic and metal.",
        points: 10
      },
      {
        question: "Which is the best way to handle food waste at home?",
        options: ["Throw in open", "Burn it", "Compost it", "Store in plastic"],
        correctAnswer: "Compost it",
        explanation: "Composting food waste at home reduces landfill waste and creates useful fertilizer.",
        points: 10
      }
    ]
  },
  poweringOurWorld: {
    id: 'poweringOurWorld',
    title: 'Powering Our World',
    description: 'Explore renewable and non-renewable energy sources',
    icon: '⚡',
    color: 'yellow',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "Which is a renewable energy source?",
        options: ["Coal", "Solar", "Oil", "Natural gas"],
        correctAnswer: "Solar",
        explanation: "Solar energy is renewable because the sun will continue to shine for billions of years.",
        points: 10
      },
      {
        question: "Which of these is non-renewable?",
        options: ["Wind", "Sunlight", "Petroleum", "Tidal waves"],
        correctAnswer: "Petroleum",
        explanation: "Petroleum is a fossil fuel that takes millions of years to form and cannot be quickly replaced.",
        points: 10
      },
      {
        question: "Hydropower is generated using:",
        options: ["Sunlight", "Moving water", "Coal", "Sand"],
        correctAnswer: "Moving water",
        explanation: "Hydropower uses the energy of moving water to generate electricity.",
        points: 10
      },
      {
        question: "Which renewable energy is most used in India?",
        options: ["Geothermal", "Wind", "Solar", "Nuclear"],
        correctAnswer: "Solar",
        explanation: "India has abundant sunlight and is one of the world's largest solar energy producers.",
        points: 10
      },
      {
        question: "Which energy source causes the most air pollution?",
        options: ["Coal", "Solar", "Wind", "Hydropower"],
        correctAnswer: "Coal",
        explanation: "Coal burning releases large amounts of CO₂, sulfur dioxide, and other pollutants.",
        points: 10
      }
    ]
  },
  lifeAroundUs: {
    id: 'lifeAroundUs',
    title: 'Life Around Us',
    description: 'Discover biodiversity and wildlife conservation',
    icon: '🦋',
    color: 'purple',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "Which is the richest biodiversity hotspot in India?",
        options: ["Himalayas", "Rajasthan Desert", "Punjab Plains", "Delhi NCR"],
        correctAnswer: "Himalayas",
        explanation: "The Himalayas are one of the world's biodiversity hotspots with unique flora and fauna.",
        points: 10
      },
      {
        question: "Which of these animals is endangered?",
        options: ["Tiger", "Cow", "Goat", "Crow"],
        correctAnswer: "Tiger",
        explanation: "Tigers are endangered due to habitat loss, poaching, and human-wildlife conflict.",
        points: 10
      },
      {
        question: "Cutting down forests leads to:",
        options: ["Cleaner air", "Loss of habitat", "More rainfall", "Less pollution"],
        correctAnswer: "Loss of habitat",
        explanation: "Deforestation destroys the natural habitat of many species, leading to biodiversity loss.",
        points: 10
      },
      {
        question: "Which is a keystone species?",
        options: ["Lion", "Honeybee", "Cow", "Ant"],
        correctAnswer: "Honeybee",
        explanation: "Honeybees are keystone species because they pollinate many plants that other species depend on.",
        points: 10
      },
      {
        question: "Which Indian law protects biodiversity?",
        options: ["Wildlife Protection Act", "Forest Act", "Pollution Act", "Education Act"],
        correctAnswer: "Wildlife Protection Act",
        explanation: "The Wildlife Protection Act of 1972 protects India's wildlife and biodiversity.",
        points: 10
      }
    ]
  },
  protectingOurFriends: {
    id: 'protectingOurFriends',
    title: 'Protecting Our Friends',
    description: 'Learn about wildlife conservation and protection',
    icon: '🛡️',
    color: 'blue',
    difficulty: 'advanced',
    totalPoints: 50,
    questions: [
      {
        question: "Which activity helps conservation?",
        options: ["Poaching", "Afforestation", "Deforestation", "Mining"],
        correctAnswer: "Afforestation",
        explanation: "Planting trees (afforestation) helps restore ecosystems and provides habitat for wildlife.",
        points: 10
      },
      {
        question: "Setting up national parks is mainly for:",
        options: ["Fun", "Wildlife protection", "Farming", "Tourism only"],
        correctAnswer: "Wildlife protection",
        explanation: "National parks are established primarily to protect wildlife and their natural habitats.",
        points: 10
      },
      {
        question: "Which of these is a protected area in India?",
        options: ["Sundarbans", "Connaught Place", "Marine Drive", "Cyber City"],
        correctAnswer: "Sundarbans",
        explanation: "Sundarbans is a UNESCO World Heritage Site and national park protecting the Bengal tiger.",
        points: 10
      },
      {
        question: "Which small daily action helps wildlife most?",
        options: ["Throwing plastic in rivers", "Saving water", "Burning leaves", "Using firecrackers"],
        correctAnswer: "Saving water",
        explanation: "Saving water helps maintain aquatic ecosystems and reduces pressure on natural water sources.",
        points: 10
      },
      {
        question: "Which group helps in local conservation?",
        options: ["Eco-clubs", "Cricket clubs", "Gaming groups", "Shopping malls"],
        correctAnswer: "Eco-clubs",
        explanation: "Eco-clubs are student groups that promote environmental awareness and conservation activities.",
        points: 10
      }
    ]
  },
  climateChangeBasics: {
    id: 'climateChangeBasics',
    title: 'Climate Change Basics',
    description: 'Understand global warming and climate science',
    icon: '🌡️',
    color: 'red',
    difficulty: 'advanced',
    totalPoints: 50,
    questions: [
      {
        question: "Which gas is the largest contributor to global warming?",
        options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"],
        correctAnswer: "Carbon dioxide",
        explanation: "CO₂ is the most abundant greenhouse gas and the primary driver of global warming.",
        points: 10
      },
      {
        question: "The greenhouse effect is caused by:",
        options: ["Trapping of heat by gases", "Cooling of Earth", "Loss of oxygen", "Rotation of Earth"],
        correctAnswer: "Trapping of heat by gases",
        explanation: "Greenhouse gases trap heat in Earth's atmosphere, causing global warming.",
        points: 10
      },
      {
        question: "Which sector contributes the most greenhouse gases?",
        options: ["Agriculture", "Energy production", "Education", "Sports"],
        correctAnswer: "Energy production",
        explanation: "Energy production, especially from fossil fuels, is the largest source of greenhouse gas emissions.",
        points: 10
      },
      {
        question: "Which is a visible effect of global warming?",
        options: ["Melting glaciers", "More stars in the sky", "Colder summers", "Faster Earth rotation"],
        correctAnswer: "Melting glaciers",
        explanation: "Rising temperatures cause glaciers and ice caps to melt, raising sea levels.",
        points: 10
      },
      {
        question: "Which international agreement targets climate change?",
        options: ["Paris Agreement", "Geneva Agreement", "NATO Treaty", "Kyoto Sports Pact"],
        correctAnswer: "Paris Agreement",
        explanation: "The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial levels.",
        points: 10
      }
    ]
  },
  sustainableChoices: {
    id: 'sustainableChoices',
    title: 'Sustainable Choices',
    description: 'Make eco-friendly decisions for a better future',
    icon: '🌿',
    color: 'green',
    difficulty: 'intermediate',
    totalPoints: 50,
    questions: [
      {
        question: "What is the goal of sustainability?",
        options: ["Using up all resources", "Meeting needs without harming the future", "Stopping development", "Only saving money"],
        correctAnswer: "Meeting needs without harming the future",
        explanation: "Sustainability means meeting present needs without compromising future generations' ability to meet their needs.",
        points: 10
      },
      {
        question: "Which is a sustainable farming practice?",
        options: ["Using excessive fertilizers", "Organic farming", "Burning stubble", "Cutting forests"],
        correctAnswer: "Organic farming",
        explanation: "Organic farming uses natural methods and avoids harmful chemicals, making it more sustainable.",
        points: 10
      },
      {
        question: "Buying local fruits and vegetables helps because:",
        options: ["They cost more", "Reduce transport pollution", "Taste worse", "Increase imports"],
        correctAnswer: "Reduce transport pollution",
        explanation: "Local produce reduces transportation emissions and supports local farmers.",
        points: 10
      },
      {
        question: "Which building design is most sustainable?",
        options: ["Glass skyscrapers with AC", "Houses with solar panels", "Buildings with no ventilation", "Concrete-only houses"],
        correctAnswer: "Houses with solar panels",
        explanation: "Solar panels provide clean energy and reduce dependence on fossil fuels.",
        points: 10
      },
      {
        question: "Which of these is an example of sustainable transport?",
        options: ["Carpooling", "Flying everywhere", "Using private cars daily", "Driving diesel trucks"],
        correctAnswer: "Carpooling",
        explanation: "Carpooling reduces the number of vehicles on the road, decreasing emissions per person.",
        points: 10
      }
    ]
  },
  globalGoalsSDGs: {
    id: 'globalGoalsSDGs',
    title: 'Global Goals (SDGs)',
    description: 'Learn about Sustainable Development Goals',
    icon: '🎯',
    color: 'blue',
    difficulty: 'advanced',
    totalPoints: 50,
    questions: [
      {
        question: "How many Sustainable Development Goals (SDGs) are there?",
        options: ["12", "15", "17", "20"],
        correctAnswer: "17",
        explanation: "There are 17 SDGs that address global challenges including poverty, inequality, and climate change.",
        points: 10
      },
      {
        question: "Which SDG is about climate action?",
        options: ["Goal 7", "Goal 11", "Goal 13", "Goal 16"],
        correctAnswer: "Goal 13",
        explanation: "SDG 13 focuses on taking urgent action to combat climate change and its impacts.",
        points: 10
      },
      {
        question: "SDG 6 focuses on:",
        options: ["Zero hunger", "Clean water and sanitation", "Gender equality", "Life below water"],
        correctAnswer: "Clean water and sanitation",
        explanation: "SDG 6 aims to ensure availability and sustainable management of water and sanitation for all.",
        points: 10
      },
      {
        question: "Which organization created the SDGs?",
        options: ["World Bank", "United Nations", "NASA", "WHO"],
        correctAnswer: "United Nations",
        explanation: "The UN created the SDGs as part of the 2030 Agenda for Sustainable Development.",
        points: 10
      },
      {
        question: "Which SDG promotes responsible consumption & production?",
        options: ["Goal 12", "Goal 2", "Goal 5", "Goal 14"],
        correctAnswer: "Goal 12",
        explanation: "SDG 12 aims to ensure sustainable consumption and production patterns.",
        points: 10
      }
    ]
  },
  innovationForTheFuture: {
    id: 'innovationForTheFuture',
    title: 'Innovation for the Future',
    description: 'Explore green technology and sustainable innovations',
    icon: '🚀',
    color: 'purple',
    difficulty: 'advanced',
    totalPoints: 50,
    questions: [
      {
        question: "Which innovation helps reduce plastic use?",
        options: ["Biodegradable packaging", "Plastic straws", "Burning plastics", "Single-use bags"],
        correctAnswer: "Biodegradable packaging",
        explanation: "Biodegradable packaging breaks down naturally, reducing plastic waste in the environment.",
        points: 10
      },
      {
        question: "Electric vehicles mainly help by:",
        options: ["Producing more smoke", "Reducing air pollution", "Using more fuel", "Making noise"],
        correctAnswer: "Reducing air pollution",
        explanation: "Electric vehicles produce zero direct emissions, helping reduce air pollution in cities.",
        points: 10
      },
      {
        question: "Which technology helps save water in farming?",
        options: ["Flood irrigation", "Drip irrigation", "Over-watering", "None"],
        correctAnswer: "Drip irrigation",
        explanation: "Drip irrigation delivers water directly to plant roots, reducing water waste by up to 50%.",
        points: 10
      },
      {
        question: "Smart grids are designed to:",
        options: ["Waste energy", "Improve electricity efficiency", "Stop renewable energy", "Run only on coal"],
        correctAnswer: "Improve electricity efficiency",
        explanation: "Smart grids use digital technology to monitor and manage electricity distribution more efficiently.",
        points: 10
      },
      {
        question: "Vertical farming is best suited for:",
        options: ["Villages only", "Cities with less land", "Forests", "Deserts only"],
        correctAnswer: "Cities with less land",
        explanation: "Vertical farming grows crops in stacked layers, making it ideal for urban areas with limited space.",
        points: 10
      }
    ]
  }
};

export const getQuizModule = (id: string): QuizModule | undefined => {
  return quizData[id];
};

export const getAllQuizModules = (): QuizModule[] => {
  return Object.values(quizData);
};

export const getQuizModulesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): QuizModule[] => {
  return Object.values(quizData).filter(module => module.difficulty === difficulty);
};
