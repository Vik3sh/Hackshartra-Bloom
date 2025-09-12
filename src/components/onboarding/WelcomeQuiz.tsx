import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useProgress } from '@/contexts/ProgressContext';
import { Sprout, Droplets, Sun, Leaf, ArrowRight, Gift } from 'lucide-react';

interface WelcomeQuizProps {
  onComplete: () => void;
}

const WELCOME_QUESTIONS = [
  {
    id: 'welcome-1',
    question: 'What is the first step to growing your eco tree?',
    options: ['Plant a seed', 'Water the soil', 'Add sunlight', 'Wait patiently'],
    correctIndex: 0,
    explanation: 'Every great tree starts with a single seed! 🌱'
  },
  {
    id: 'welcome-2',
    question: 'What do plants need most to grow?',
    options: ['Just water', 'Water and sunlight', 'Only soil', 'Magic'],
    correctIndex: 1,
    explanation: 'Plants need both water and sunlight to grow healthy and strong! ☀️💧'
  },
  {
    id: 'welcome-3',
    question: 'How can you earn items for your tree?',
    options: ['Buy them', 'Complete quizzes and challenges', 'Wait for them to appear', 'Ask friends'],
    correctIndex: 1,
    explanation: 'Complete environmental quizzes, challenges, and lessons to earn tree items! 🎯'
  }
];

const ITEM_SOURCES = [
  {
    item: 'Seeds',
    icon: <Sprout className="w-6 h-6 text-green-600" />,
    sources: ['Complete Beginner quizzes', 'Finish environmental challenges', 'Daily login rewards'],
    color: 'text-green-600'
  },
  {
    item: 'Water',
    icon: <Droplets className="w-6 h-6 text-blue-600" />,
    sources: ['Complete Intermediate quizzes', 'Water conservation challenges', 'Daily care activities'],
    color: 'text-blue-600'
  },
  {
    item: 'Sunlight',
    icon: <Sun className="w-6 h-6 text-yellow-600" />,
    sources: ['Complete Advanced quizzes', 'Solar energy challenges', 'Daily learning streaks'],
    color: 'text-yellow-600'
  },
  {
    item: 'Nutrients',
    icon: <Leaf className="w-6 h-6 text-emerald-600" />,
    sources: ['Complete all lesson modules', 'Boss battles in RPG mode', 'Achievement rewards'],
    color: 'text-emerald-600'
  }
];

const WelcomeQuiz: React.FC<WelcomeQuizProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const { completeQuiz } = useProgress();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showItemGuide, setShowItemGuide] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      toast({
        title: 'Please select an answer',
        description: 'Choose an option before continuing.',
        variant: 'destructive'
      });
      return;
    }

    const question = WELCOME_QUESTIONS[currentQuestion];
    const isCorrect = selectedAnswer === question.correctIndex;

    if (isCorrect) {
      toast({
        title: 'Correct! 🎉',
        description: question.explanation,
        variant: 'default'
      });
    } else {
      toast({
        title: 'Not quite right',
        description: question.explanation,
        variant: 'destructive'
      });
    }

    setShowExplanation(true);
  };

  const handleContinue = () => {
    if (currentQuestion < WELCOME_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed - give seed reward
      completeQuiz('welcome-quiz', 100, { seed: 1 });
      setQuizCompleted(true);
      toast({
        title: 'Welcome Quiz Complete! 🌱',
        description: 'You earned your first seed! Now learn how to get more items.',
        variant: 'success'
      });
    }
  };

  const handleStartJourney = () => {
    onComplete();
  };

  if (quizCompleted && !showItemGuide) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Congratulations! 🎉</CardTitle>
            <p className="text-gray-600">You earned your first seed! Your eco tree journey begins now.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Your First Reward:</h3>
              <div className="flex items-center gap-2">
                <Sprout className="w-6 h-6 text-green-600" />
                <span className="text-green-700">1 Seed - Ready to plant!</span>
              </div>
            </div>
            <Button 
              onClick={() => setShowItemGuide(true)} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Learn How to Get More Items
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showItemGuide) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-800">How to Grow Your Tree 🌳</CardTitle>
            <p className="text-gray-600">Here's how you can earn different items to help your tree grow:</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ITEM_SOURCES.map((item, index) => (
                <Card key={index} className="border-2 border-gray-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      {item.icon}
                      <h3 className={`font-semibold ${item.color}`}>{item.item}</h3>
                    </div>
                    <ul className="space-y-2">
                      {item.sources.map((source, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {source}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tip:</h3>
              <p className="text-blue-700 text-sm">
                Complete daily activities to maintain your learning streak and earn bonus items! 
                The more you learn about the environment, the more your tree will flourish.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowItemGuide(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleStartJourney} 
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Start My Journey!
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = WELCOME_QUESTIONS[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl text-blue-800">Welcome to EcoEdu Punjab! 🌱</CardTitle>
          <p className="text-gray-600">
            Let's start your environmental learning journey with a quick quiz. 
            Answer correctly to earn your first tree seed!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                Question {currentQuestion + 1} of {WELCOME_QUESTIONS.length}
              </span>
              <span className="text-sm text-blue-600">
                {Math.round(((currentQuestion + 1) / WELCOME_QUESTIONS.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / WELCOME_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={showExplanation ? handleContinue : handleNext}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {showExplanation ? 'Continue' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeQuiz;
