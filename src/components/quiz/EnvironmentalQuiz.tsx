import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/contexts/ProgressContext';
import { QuizModule, QuizQuestion } from '@/data/quizData';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Star, Trophy } from 'lucide-react';

interface EnvironmentalQuizProps {
  module: QuizModule;
  onComplete?: (score: number, totalPoints: number) => void;
  onClose?: () => void;
  isDarkMode?: boolean;
}

const EnvironmentalQuiz: React.FC<EnvironmentalQuizProps> = ({ 
  module, 
  onComplete, 
  onClose,
  isDarkMode = false 
}) => {
  const { completeQuiz, userProgress } = useProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [streak, setStreak] = useState(0);

  const currentQuestion = module.questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / module.questions.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!showResult && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswerClick(selectedAnswer || '');
    }
  }, [timeLeft, showResult, quizCompleted, selectedAnswer]);

  const handleAnswerClick = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      const points = currentQuestion.points || 10;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < module.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      const finalScore = score + (isCorrect ? (currentQuestion.points || 10) : 0);
      const totalPoints = module.totalPoints;
      const percentage = Math.round((finalScore / totalPoints) * 100);
      
      // Calculate rewards based on performance
      const rewards = getQuizRewards(finalScore, percentage);
      
      setQuizCompleted(true);
      completeQuiz(`quiz-${module.id}-${Date.now()}`, finalScore, rewards);
      
      if (onComplete) {
        onComplete(finalScore, totalPoints);
      }
    }
  };

  const getQuizRewards = (finalScore: number, percentage: number) => {
    const rewards: { [itemId: string]: number } = {};

    // Always give a seed for first quiz completion
    if (userProgress.completedQuizzes === 0) {
      rewards.seed = 1;
    }

    // Give water for good scores (60%+)
    if (percentage >= 60) {
      rewards.water = 1;
    }

    // Give sunlight for excellent scores (80%+)
    if (percentage >= 80) {
      rewards.sunlight = 1;
    }

    // Give nutrients for perfect scores (90%+)
    if (percentage >= 90) {
      rewards.nutrients = 1;
    }

    // Give fertilizer for perfect scores with streak
    if (percentage >= 90 && streak >= 3) {
      rewards.fertilizer = 1;
    }

    // Give love for perfect scores
    if (percentage === 100) {
      rewards.love = 1;
    }

    return rewards;
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setTimeLeft(30);
    setStreak(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (quizCompleted) {
    const finalScore = score;
    const totalPoints = module.totalPoints;
    const percentage = Math.round((finalScore / totalPoints) * 100);
    const rewards = getQuizRewards(finalScore, percentage);

    return (
      <Card className={`bg-white border-blue-200 shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <CardContent className="p-6 text-center">
          <div className="mb-6">
            {percentage >= 90 ? (
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            ) : percentage >= 70 ? (
              <Star className="w-20 h-20 text-blue-500 mx-auto mb-4" />
            ) : (
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            )}
            
            <h3 className="text-3xl font-bold text-blue-600 mb-2">
              {percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Great Job!' : 'Well Done!'}
            </h3>
            <p className="text-gray-600 mb-4">You completed the {module.title} quiz!</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{finalScore}</div>
                <div className="text-blue-500 text-sm">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">{percentage}%</div>
                <div className="text-green-500 text-sm">Accuracy</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{streak}</div>
              <div className="text-purple-500 text-sm">Max Streak</div>
            </div>
          </div>

          {/* Rewards Display */}
          {Object.keys(rewards).length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3">Items Collected! 🌱</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.entries(rewards).map(([itemId, quantity]) => {
                  const itemIcons: { [key: string]: string } = {
                    seed: '🌱',
                    water: '💧',
                    sunlight: '☀️',
                    nutrients: '🌿',
                    fertilizer: '💩',
                    love: '❤️'
                  };
                  return (
                    <div key={itemId} className="flex items-center space-x-1 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <span className="text-lg">{itemIcons[itemId] || '🎁'}</span>
                      <span className="text-sm font-medium text-gray-700 capitalize">{itemId}</span>
                      <span className="text-xs text-gray-500">x{quantity}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-green-700 text-sm mt-2">Use these items to grow your eco tree!</p>
            </div>
          )}

          <div className="space-y-3">
            <Button onClick={handleRestartQuiz} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Quiz Again
            </Button>
            {onClose && (
              <Button onClick={onClose} variant="outline" className="w-full">
                Close Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-white border-blue-200 shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{module.icon}</span>
            <div>
              <CardTitle className="text-xl text-blue-900">{module.title}</CardTitle>
              <p className="text-sm text-blue-600">{module.description}</p>
            </div>
          </div>
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {module.questions.length}</span>
            <span>Score: {score} / {module.totalPoints}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Timer */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            timeLeft > 10 ? 'bg-green-100 text-green-800' : 
            timeLeft > 5 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            ⏱️ {timeLeft}s
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {currentQuestion.question}
          </h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";
              
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
                }
              } else {
                buttonClass += selectedAnswer === option 
                  ? "border-blue-500 bg-blue-50 text-blue-800" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result and Explanation */}
        {showResult && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50">
            <div className="flex items-center space-x-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
              {isCorrect && (
                <span className="text-green-600 text-sm">
                  +{currentQuestion.points || 10} points
                </span>
              )}
            </div>
            
            {currentQuestion.explanation && (
              <p className="text-blue-800 text-sm">
                {currentQuestion.explanation}
              </p>
            )}
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button 
            onClick={handleNextQuestion}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {currentQuestionIndex < module.questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Finish Quiz
                <Trophy className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EnvironmentalQuiz;
