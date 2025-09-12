import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, BookOpen, Lightbulb, Target, Leaf, Play, Youtube } from 'lucide-react';

import { Lesson } from '@/data/lessons';
import { getVideoContent } from '@/data/videoContent';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onClose: () => void;
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Define lesson content based on lesson ID
  const getLessonContent = (lessonId: string) => {
    const contentMap: { [key: string]: any } = {
      'climate-1': {
        title: 'Understanding Climate Change',
        steps: [
          {
            type: 'video',
            title: 'Introduction to Climate Change',
            content: 'Watch this comprehensive video about climate change fundamentals.',
            videoId: getVideoContent('climate-1')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('climate-1')?.duration || '5:30'
          },
          {
            type: 'study',
            title: 'Key Concepts Study Module',
            content: 'Let\'s dive deeper into the fundamental concepts of climate change.',
            modules: [
              {
                title: 'Greenhouse Gases',
                content: 'Greenhouse gases like carbon dioxide (CO₂), methane (CH₄), and nitrous oxide (N₂O) trap heat in the atmosphere. These gases act like a blanket around Earth.',
                icon: '🌫️',
                facts: [
                  'CO₂ levels have increased by 50% since 1750',
                  'Methane is 25 times more potent than CO₂',
                  'Water vapor is the most abundant greenhouse gas'
                ]
              },
              {
                title: 'Global Temperature Rise',
                content: 'The average global temperature has risen by about 1.1°C since the late 1800s. This may seem small, but it has significant impacts.',
                icon: '🌡️',
                facts: [
                  '2023 was the warmest year on record',
                  'Arctic warming is 2-3 times faster than global average',
                  'Ocean temperatures are also rising'
                ]
              },
              {
                title: 'Carbon Cycle',
                content: 'The carbon cycle is the process by which carbon moves through Earth\'s atmosphere, oceans, and land. Human activities have disrupted this natural balance.',
                icon: '🔄',
                facts: [
                  'Oceans absorb about 30% of human CO₂ emissions',
                  'Forests act as carbon sinks',
                  'Fossil fuels release ancient carbon into the atmosphere'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'What is Climate Change?',
            content: 'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver of climate change since the 1800s.',
            image: '🌍'
          },
          {
            type: 'interactive',
            title: 'Greenhouse Effect',
            content: 'The greenhouse effect is a natural process that warms the Earth\'s surface. When the Sun\'s energy reaches the Earth, some of it is reflected back to space and the rest is absorbed and re-radiated by greenhouse gases.',
            question: 'What happens when greenhouse gases trap heat?',
            options: [
              'The Earth gets cooler',
              'The Earth gets warmer',
              'Nothing changes',
              'The Sun stops shining'
            ],
            correct: 1
          },
          {
            type: 'reading',
            title: 'Human Impact',
            content: 'Human activities, particularly the burning of fossil fuels, have increased the concentration of greenhouse gases in the atmosphere. This has led to a rise in global temperatures.',
            image: '🏭'
          },
          {
            type: 'quiz',
            title: 'Quick Check',
            question: 'What is the main cause of recent climate change?',
            options: [
              'Natural climate cycles',
              'Human activities',
              'Solar radiation changes',
              'Volcanic eruptions'
            ],
            correct: 1
          }
        ]
      },
      'climate-2': {
        title: 'Effects of Climate Change',
        steps: [
          {
            type: 'video',
            title: 'Greenhouse Effect Explained',
            content: 'Watch this detailed explanation of how the greenhouse effect works and its impact on our planet.',
            videoId: getVideoContent('climate-2')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('climate-2')?.duration || '4:15'
          },
          {
            type: 'study',
            title: 'Climate Change Effects Study Module',
            content: 'Explore the various impacts of climate change on our planet and ecosystems.',
            modules: [
              {
                title: 'Rising Sea Levels',
                content: 'Melting ice sheets and thermal expansion cause sea levels to rise, threatening coastal areas.',
                icon: '🌊',
                facts: [
                  'Sea levels rising 3.3mm per year',
                  'Threatens 40% of world population near coasts',
                  'Small island nations most at risk'
                ]
              },
              {
                title: 'Extreme Weather Events',
                content: 'Climate change increases the frequency and intensity of hurricanes, droughts, and heatwaves.',
                icon: '🌀',
                facts: [
                  'Hurricanes are becoming more intense',
                  'Heatwaves are more frequent and longer',
                  'Droughts affect agriculture and water supply'
                ]
              },
              {
                title: 'Ecosystem Disruption',
                content: 'Changing temperatures and precipitation patterns disrupt ecosystems and species habitats.',
                icon: '🌿',
                facts: [
                  'Species migrating to cooler areas',
                  'Coral reefs bleaching due to warming',
                  'Forest fires becoming more common'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Rising Temperatures',
            content: 'Global average temperatures have increased by about 1.1°C since the late 1800s. This may seem small, but it has significant impacts on weather patterns and ecosystems.',
            image: '🌡️'
          },
          {
            type: 'interactive',
            title: 'Melting Ice',
            content: 'Rising temperatures cause ice sheets and glaciers to melt, leading to rising sea levels. This threatens coastal communities and ecosystems.',
            question: 'What happens when ice melts?',
            options: [
              'Sea levels rise',
              'Sea levels fall',
              'Nothing changes',
              'Oceans freeze'
            ],
            correct: 0
          },
          {
            type: 'reading',
            title: 'Extreme Weather',
            content: 'Climate change increases the frequency and intensity of extreme weather events like hurricanes, droughts, and heatwaves.',
            image: '🌀'
          }
        ]
      },
      'climate-3': {
        title: 'Human Impact on Climate',
        steps: [
          {
            type: 'video',
            title: 'Human Impact on Climate',
            content: 'Learn how human activities have accelerated climate change and what we can do about it.',
            videoId: getVideoContent('climate-3')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('climate-3')?.duration || '6:20'
          },
          {
            type: 'study',
            title: 'Human Activities Study Module',
            content: 'Explore the main human activities contributing to climate change.',
            modules: [
              {
                title: 'Fossil Fuel Burning',
                content: 'Burning coal, oil, and gas releases CO₂ and other greenhouse gases into the atmosphere.',
                icon: '🏭',
                facts: [
                  'Accounts for 75% of global CO₂ emissions',
                  'Transportation is the largest source',
                  'Electricity generation is second largest'
                ]
              },
              {
                title: 'Deforestation',
                content: 'Cutting down forests reduces the Earth\'s ability to absorb CO₂ from the atmosphere.',
                icon: '🌳',
                facts: [
                  'Forests absorb 30% of human CO₂ emissions',
                  'Deforestation releases stored carbon',
                  'Reduces biodiversity and ecosystem services'
                ]
              },
              {
                title: 'Agriculture',
                content: 'Farming practices contribute to greenhouse gas emissions through methane and nitrous oxide.',
                icon: '🚜',
                facts: [
                  'Livestock produces methane',
                  'Fertilizers release nitrous oxide',
                  'Land use changes affect carbon storage'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Industrial Revolution Impact',
            content: 'Since the Industrial Revolution, human activities have dramatically increased greenhouse gas concentrations in the atmosphere.',
            image: '🏭'
          },
          {
            type: 'interactive',
            title: 'Carbon Footprint Quiz',
            content: 'Test your knowledge about human activities that contribute to climate change.',
            question: 'Which human activity produces the most CO₂ emissions?',
            options: [
              'Transportation',
              'Electricity generation',
              'Agriculture',
              'Manufacturing'
            ],
            correct: 1
          }
        ]
      },
      'climate-4': {
        title: 'Climate Change Solutions',
        steps: [
          {
            type: 'video',
            title: 'Climate Change Solutions',
            content: 'Discover innovative solutions and actions we can take to combat climate change.',
            videoId: getVideoContent('climate-4')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('climate-4')?.duration || '7:45'
          },
          {
            type: 'study',
            title: 'Climate Solutions Study Module',
            content: 'Learn about the various solutions available to address climate change.',
            modules: [
              {
                title: 'Renewable Energy',
                content: 'Switching to solar, wind, and other renewable energy sources reduces greenhouse gas emissions.',
                icon: '⚡',
                facts: [
                  'Solar and wind are now cheaper than coal',
                  'Can provide 100% of our energy needs',
                  'Creates more jobs than fossil fuels'
                ]
              },
              {
                title: 'Energy Efficiency',
                content: 'Using energy more efficiently reduces the amount of energy needed and cuts emissions.',
                icon: '💡',
                facts: [
                  'LED bulbs use 80% less energy',
                  'Smart thermostats save 10-15% on heating',
                  'Energy Star appliances are more efficient'
                ]
              },
              {
                title: 'Carbon Capture',
                content: 'Technologies that capture and store CO₂ from the atmosphere or industrial processes.',
                icon: '🌫️',
                facts: [
                  'Direct air capture removes CO₂ from air',
                  'Carbon storage in underground formations',
                  'Nature-based solutions like reforestation'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Individual Actions',
            content: 'Every person can make a difference through their daily choices and actions to reduce their carbon footprint.',
            image: '👤'
          },
          {
            type: 'interactive',
            title: 'Solution Effectiveness Quiz',
            content: 'Test your understanding of climate change solutions.',
            question: 'What is the most effective way to reduce your carbon footprint?',
            options: [
              'Using renewable energy',
              'Eating a plant-based diet',
              'Using public transportation',
              'All of the above'
            ],
            correct: 3
          }
        ]
      },
      'climate-5': {
        title: 'Climate Policy and Action',
        steps: [
          {
            type: 'video',
            title: 'Climate Policy and Action',
            content: 'Learn about global climate policies and collective action needed to address climate change.',
            videoId: getVideoContent('climate-5')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('climate-5')?.duration || '9:15'
          },
          {
            type: 'study',
            title: 'Climate Policy Study Module',
            content: 'Explore the policies and agreements that shape global climate action.',
            modules: [
              {
                title: 'Paris Agreement',
                content: 'International treaty to limit global warming to well below 2°C above pre-industrial levels.',
                icon: '🌍',
                facts: [
                  'Signed by 196 countries in 2015',
                  'Aims to limit warming to 1.5°C',
                  'Each country sets its own targets'
                ]
              },
              {
                title: 'Carbon Pricing',
                content: 'Economic tools that put a price on carbon emissions to encourage reduction.',
                icon: '💰',
                facts: [
                  'Carbon taxes directly price emissions',
                  'Cap-and-trade systems limit total emissions',
                  'Creates economic incentive to reduce'
                ]
              },
              {
                title: 'Green New Deal',
                content: 'Comprehensive plan to address climate change while creating jobs and economic growth.',
                icon: '🔄',
                facts: [
                  'Invests in renewable energy infrastructure',
                  'Creates millions of green jobs',
                  'Addresses environmental justice'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Global Cooperation',
            content: 'Addressing climate change requires cooperation between governments, businesses, and individuals worldwide.',
            image: '🤝'
          },
          {
            type: 'interactive',
            title: 'Policy Impact Quiz',
            content: 'Test your knowledge about climate policies and their effectiveness.',
            question: 'What is the main goal of the Paris Agreement?',
            options: [
              'Eliminate all greenhouse gas emissions',
              'Limit global warming to below 2°C',
              'Increase renewable energy by 50%',
              'Plant 1 trillion trees'
            ],
            correct: 1
          }
        ]
      },
      'waste-1': {
        title: 'Understanding Waste Management',
        steps: [
          {
            type: 'video',
            title: 'Waste Management Fundamentals',
            content: 'Learn about different types of waste and proper disposal methods.',
            videoId: getVideoContent('waste-1')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('waste-1')?.duration || '4:15'
          },
          {
            type: 'study',
            title: 'Waste Types Study Module',
            content: 'Explore the different categories of waste and how to handle each type properly.',
            modules: [
              {
                title: 'Organic Waste',
                content: 'Food scraps, yard waste, and other biodegradable materials that can be composted.',
                icon: '🍎',
                facts: [
                  'Makes up 30-40% of household waste',
                  'Can be composted to create nutrient-rich soil',
                  'Reduces methane emissions from landfills'
                ]
              },
              {
                title: 'Recyclable Materials',
                content: 'Paper, cardboard, glass, metal, and certain plastics that can be processed into new products.',
                icon: '♻️',
                facts: [
                  'Paper can be recycled 5-7 times',
                  'Aluminum cans are 100% recyclable',
                  'Glass can be recycled indefinitely'
                ]
              },
              {
                title: 'Hazardous Waste',
                content: 'Batteries, electronics, chemicals, and other materials that require special disposal.',
                icon: '⚠️',
                facts: [
                  'Never put in regular trash',
                  'Take to designated collection centers',
                  'Can contaminate soil and water'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Types of Waste',
            content: 'Waste can be categorized into different types: organic waste, recyclable materials, hazardous waste, and non-recyclable waste. Each type requires different handling methods.',
            image: '🗑️'
          },
          {
            type: 'interactive',
            title: 'The 3 R\'s',
            content: 'The three R\'s of waste management are Reduce, Reuse, and Recycle. This hierarchy helps us minimize waste and its environmental impact.',
            question: 'What is the first R in waste management?',
            options: ['Recycle', 'Reuse', 'Reduce', 'Refuse'],
            correct: 2
          },
          {
            type: 'reading',
            title: 'Waste Impact',
            content: 'Improper waste disposal leads to pollution, habitat destruction, and contributes to climate change through methane emissions from landfills.',
            image: '🌱'
          }
        ]
      },
      'energy-1': {
        title: 'Renewable Energy Sources',
        steps: [
          {
            type: 'video',
            title: 'Renewable Energy Explained',
            content: 'Discover how renewable energy sources work and their benefits.',
            videoId: getVideoContent('energy-1')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('energy-1')?.duration || '6:45'
          },
          {
            type: 'study',
            title: 'Renewable Energy Sources Study Module',
            content: 'Learn about different types of renewable energy and how they work.',
            modules: [
              {
                title: 'Solar Power',
                content: 'Converts sunlight directly into electricity using photovoltaic cells or solar thermal systems.',
                icon: '☀️',
                facts: [
                  'Most abundant energy source on Earth',
                  'Costs have dropped 90% since 2010',
                  'Can be installed on rooftops or in large solar farms'
                ]
              },
              {
                title: 'Wind Energy',
                content: 'Uses wind turbines to convert wind motion into electrical energy.',
                icon: '💨',
                facts: [
                  'One of the fastest-growing energy sources',
                  'Offshore wind is more consistent than onshore',
                  'Turbines can power 1,500 homes each'
                ]
              },
              {
                title: 'Hydroelectric Power',
                content: 'Generates electricity by using flowing water to turn turbines.',
                icon: '🌊',
                facts: [
                  'Provides 16% of world\'s electricity',
                  'Most reliable renewable energy source',
                  'Can provide both power and water storage'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'Solar Energy',
            content: 'Solar energy comes from the sun and can be converted into electricity using solar panels. It\'s clean, renewable, and increasingly cost-effective.',
            image: '☀️'
          },
          {
            type: 'interactive',
            title: 'Wind Power',
            content: 'Wind turbines convert wind energy into electricity. Wind power is one of the fastest-growing renewable energy sources worldwide.',
            question: 'What do wind turbines convert into electricity?',
            options: ['Water', 'Sunlight', 'Wind', 'Heat'],
            correct: 2
          },
          {
            type: 'reading',
            title: 'Benefits of Renewables',
            content: 'Renewable energy sources produce little to no greenhouse gas emissions and help reduce our dependence on fossil fuels.',
            image: '💨'
          }
        ]
      },
      'conservation-1': {
        title: 'Biodiversity and Conservation',
        steps: [
          {
            type: 'video',
            title: 'Introduction to Biodiversity',
            content: 'Explore the importance of biodiversity and why we need to protect it.',
            videoId: getVideoContent('conservation-1')?.videoId || 'dQw4w9WgXcQ',
            duration: getVideoContent('conservation-1')?.duration || '7:00'
          },
          {
            type: 'study',
            title: 'Biodiversity Study Module',
            content: 'Learn about the different levels of biodiversity and their importance to our planet.',
            modules: [
              {
                title: 'Genetic Diversity',
                content: 'The variety of genes within a species, which allows populations to adapt to changing conditions.',
                icon: '🧬',
                facts: [
                  'Essential for species survival',
                  'Helps populations resist diseases',
                  'Enables adaptation to climate change'
                ]
              },
              {
                title: 'Species Diversity',
                content: 'The variety of different species in a particular area or ecosystem.',
                icon: '🦋',
                facts: [
                  'Scientists estimate 8.7 million species exist',
                  'Only 1.2 million species have been identified',
                  'Tropical rainforests have the highest species diversity'
                ]
              },
              {
                title: 'Ecosystem Diversity',
                content: 'The variety of different ecosystems, habitats, and ecological processes on Earth.',
                icon: '🌍',
                facts: [
                  'Includes forests, oceans, deserts, and wetlands',
                  'Each ecosystem provides unique services',
                  'Healthy ecosystems support human life'
                ]
              }
            ]
          },
          {
            type: 'reading',
            title: 'What is Biodiversity?',
            content: 'Biodiversity refers to the variety of life on Earth, from genes to ecosystems. It is crucial for maintaining healthy and resilient ecosystems.',
            image: '🦋'
          },
          {
            type: 'interactive',
            title: 'Threats to Biodiversity',
            content: 'Habitat loss, pollution, climate change, and overexploitation are major threats to biodiversity.',
            question: 'Which of these is a major threat to biodiversity?',
            options: ['Recycling', 'Habitat Loss', 'Renewable Energy', 'Conservation'],
            correct: 1
          },
          {
            type: 'reading',
            title: 'Conservation Strategies',
            content: 'Conservation efforts include establishing protected areas, restoring habitats, sustainable resource management, and educating the public.',
            image: '🌳'
          }
        ]
      }
    };

    return contentMap[lessonId] || {
      title: lesson.title,
      steps: [
        {
          type: 'reading',
          title: 'Introduction',
          content: lesson.description,
          image: '📚'
        }
      ]
    };
  };

  const content = getLessonContent(lesson.id);
  const totalSteps = content.steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleAnswer = (answerIndex: number, correctIndex: number) => {
    if (answerIndex === correctIndex) {
      handleStepComplete();
    } else {
      // Show feedback for wrong answer
      alert('Not quite right! Try again.');
    }
  };

  const renderStep = (step: any, index: number) => {
    if (index !== currentStep) return null;

    return (
      <div className="space-y-8">
        <div className="text-center">
          {step.image && <div className="text-8xl mb-6">{step.image}</div>}
          <h3 className="text-4xl font-bold text-gray-900 mb-4">{step.title}</h3>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">{step.content}</p>
          </div>
        </div>

        {step.type === 'video' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-900 rounded-t-lg overflow-hidden">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${step.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={step.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 bg-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span className="font-medium">YouTube Video</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Play className="w-4 h-4" />
                    <span>{step.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 text-center">
              <Button
                onClick={handleStepComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Continue to Next Section
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step.type === 'interactive' && step.question && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{step.question}</h4>
              <p className="text-lg text-gray-600 mb-6">{step.content}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {step.options.map((option: string, optionIndex: number) => (
                <Button
                  key={optionIndex}
                  variant="outline"
                  className="justify-start h-auto p-6 text-left hover:bg-blue-50 border-2 hover:border-blue-300 text-lg"
                  onClick={() => handleAnswer(optionIndex, step.correct)}
                >
                  <span className="font-bold mr-3 text-blue-600">{String.fromCharCode(65 + optionIndex)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step.type === 'quiz' && step.question && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">{step.question}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {step.options.map((option: string, optionIndex: number) => (
                <Button
                  key={optionIndex}
                  variant="outline"
                  className="justify-start h-auto p-6 text-left hover:bg-green-50 border-2 hover:border-green-300 text-lg"
                  onClick={() => handleAnswer(optionIndex, step.correct)}
                >
                  <span className="font-bold mr-3 text-green-600">{String.fromCharCode(65 + optionIndex)}.</span>
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step.type === 'study' && step.modules && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-purple-900 mb-2">{step.title}</h4>
              <p className="text-purple-700">{step.content}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {step.modules.map((module: any, moduleIndex: number) => (
                <div key={moduleIndex} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{module.icon}</span>
                    <h5 className="font-semibold text-gray-900">{module.title}</h5>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{module.content}</p>
                  <div className="space-y-2">
                    <h6 className="font-medium text-gray-800 text-xs">Key Facts:</h6>
                    <ul className="space-y-1">
                      {module.facts.map((fact: string, factIndex: number) => (
                        <li key={factIndex} className="text-xs text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button 
                onClick={handleStepComplete}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue to Next Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step.type === 'reading' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              {step.image && <div className="text-8xl mb-6">{step.image}</div>}
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">{step.content}</p>
              </div>
            </div>
            <div className="text-center">
              <Button
                onClick={handleStepComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <BookOpen className="w-4 h-4 mr-1" />
                {lesson.difficulty}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Target className="w-4 h-4 mr-1" />
                {lesson.points} pts
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Leaf className="w-4 h-4 mr-1" />
                {lesson.duration} min
              </Badge>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/20 text-xl p-2">
            ✕
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {totalSteps}</span>
        </div>
        <Progress value={progress} className="w-full h-3" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          {renderStep(content.steps[currentStep], currentStep)}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Button 
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} 
            disabled={currentStep === 0}
            variant="outline"
            className="px-6 py-2"
          >
            Previous
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Button 
            onClick={handleStepComplete}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep < totalSteps - 1 ? 'Next' : 'Complete Lesson'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
